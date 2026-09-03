/* Kör sw.js på riktigt i stället för att läsa den.

   Serviceworkerns fel visar sig först i drift, och först när nätet försvinner —
   alltså vid väggplattan, aldrig vid skrivbordet. Här spelas scenarierna upp mot
   den verkliga filen med stubbade webbläsar-API:er.

   Kör: node sw-check.mjs
   Exit-koden är 1 om något scenario faller. */

import { readFileSync } from "node:fs";
import vm from "node:vm";

const SERVICE_WORKER_PATH = new URL("./sw.js", import.meta.url);

const SITE_ORIGIN = "https://roffecon.github.io";
const SITE_BASE = `${SITE_ORIGIN}/TimeFun/`;
const START_PAGE_URL = `${SITE_BASE}index.html`;
const PROVERB_PAGE_URL = `${SITE_BASE}ordsprak.html`;

/* Innehållsmarkörer i stället för riktiga filer: utskriften ska visa vilken sida
   som faktiskt kom ut ur cachen, inte drunkna i 4400 rader HTML. */
const START_PAGE_BODY = "KLOCKAN";
const PROVERB_PAGE_BODY = "ORDSPRÅKSSIDAN";

const NAVIGATION_REQUEST_MODE = "navigate";
const GET_METHOD = "GET";
const NETWORK_FAILURE_MESSAGE = "Failed to fetch";
const NOT_FOUND_BODY = "404";

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;


/* ==========================================================================
   Stubbade webbläsar-API:er
   ========================================================================== */

function createResponse(bodyText, { ok = true } = {}) {
  return {
    ok,
    type: "basic",
    body: bodyText,
    clone: () => createResponse(bodyText, { ok })
  };
}

/* Cache-nycklar är absoluta adresser. Utan den här normaliseringen matchar inte
   "./index.html" från app-skalet den fullständiga adress en navigering bär. */
function toCacheKey(requestOrPath) {
  const rawUrl = typeof requestOrPath === "string" ? requestOrPath : requestOrPath.url;
  return new URL(rawUrl, SITE_BASE).href;
}

class CacheStub {
  constructor() {
    this.entries = new Map();
  }

  async match(requestOrPath) {
    return this.entries.get(toCacheKey(requestOrPath));
  }

  async put(requestOrPath, response) {
    this.entries.set(toCacheKey(requestOrPath), response);
  }

  async add(request) {
    const response = await fetchFromServer(request);
    if (!response.ok) throw new Error(`Kunde inte cacha ${toCacheKey(request)}`);
    this.entries.set(toCacheKey(request), response);
  }
}

const cacheStorage = new Map();

const cachesStub = {
  async open(cacheName) {
    if (!cacheStorage.has(cacheName)) cacheStorage.set(cacheName, new CacheStub());
    return cacheStorage.get(cacheName);
  },
  async keys() {
    return [...cacheStorage.keys()];
  },
  async delete(cacheName) {
    return cacheStorage.delete(cacheName);
  }
};

/* Servern. Filerna speglar repots rot; isNetworkAvailable styr om de går att nå. */
let isNetworkAvailable = true;

const SERVER_FILES = new Map([
  [SITE_BASE, START_PAGE_BODY],
  [START_PAGE_URL, START_PAGE_BODY],
  [PROVERB_PAGE_URL, PROVERB_PAGE_BODY],
  [`${SITE_BASE}quotes.js`, "QUOTES"],
  [`${SITE_BASE}logo.png`, "LOGO"],
  [`${SITE_BASE}manifest.json`, "MANIFEST"],
  [`${SITE_BASE}icon-192.png`, "ICON192"],
  [`${SITE_BASE}icon-512.png`, "ICON512"]
]);

async function fetchFromServer(requestOrPath) {
  if (!isNetworkAvailable) throw new TypeError(NETWORK_FAILURE_MESSAGE);

  const bodyText = SERVER_FILES.get(toCacheKey(requestOrPath));
  if (bodyText === undefined) return createResponse(NOT_FOUND_BODY, { ok: false });
  return createResponse(bodyText);
}

class RequestStub {
  constructor(input, options = {}) {
    this.url = toCacheKey(input);
    this.method = options.method ?? GET_METHOD;
    this.mode = options.mode ?? "no-cors";
  }
}

const eventListeners = new Map();

const selfStub = {
  location: { origin: SITE_ORIGIN },
  addEventListener: (type, handler) => eventListeners.set(type, handler),
  skipWaiting: async () => undefined,
  clients: { claim: async () => undefined }
};

const sandbox = {
  self: selfStub,
  caches: cachesStub,
  fetch: fetchFromServer,
  Request: RequestStub,
  URL,
  console
};

vm.createContext(sandbox);
vm.runInContext(readFileSync(SERVICE_WORKER_PATH, "utf8"), sandbox, { filename: "sw.js" });


/* ==========================================================================
   Drivning
   ========================================================================== */

/* waitUntil och respondWith tar båda emot ett löfte som serviceworkern vill att
   webbläsaren ska vänta in. Här fångas det så att scenariot kan invänta det. */
async function dispatchEvent(type, eventProperties = {}) {
  let pendingWork;
  const handler = eventListeners.get(type);
  if (handler === undefined) throw new Error(`sw.js lyssnar inte på "${type}"`);

  handler({
    ...eventProperties,
    waitUntil: (promise) => { pendingWork = promise; },
    respondWith: (promise) => { pendingWork = promise; }
  });

  return pendingWork;
}

/* Plattan sätts alltid upp med nät — annars finns ingenting att cacha. Varje
   scenario börjar därför online, oavsett hur det föregående slutade. */
async function installServiceWorker() {
  cacheStorage.clear();
  isNetworkAvailable = true;
  await dispatchEvent("install");
  await dispatchEvent("activate");
}

async function navigateTo(pageUrl) {
  const request = new RequestStub(pageUrl, {
    method: GET_METHOD,
    mode: NAVIGATION_REQUEST_MODE
  });

  try {
    const response = await dispatchEvent("fetch", { request });
    return response?.body ?? "(inget svar)";
  } catch {
    return "(nätverksfel — sidan gick inte att visa)";
  }
}


/* ==========================================================================
   Scenarier
   ========================================================================== */

let hasFailure = false;

function check(description, actualBody, expectedBody) {
  const passed = actualBody === expectedBody;
  console.log(`  ${passed ? "OK  " : "FEL "} ${description}`);
  if (!passed) {
    console.log(`         förväntat: ${expectedBody}`);
    console.log(`         faktiskt:  ${actualBody}`);
    hasFailure = true;
  }
}

/* Väggplattan har visat både klockan och ordspråkssidan innan nätet försvann.
   Sidorna får inte dela cache-nyckel — då ersätter den ena den andra. */
console.log("\n1. QR-koden har skannats, sedan försvinner nätet");
await installServiceWorker();
await navigateTo(START_PAGE_URL);
await navigateTo(PROVERB_PAGE_URL);
isNetworkAvailable = false;

check("Klockan visas offline, inte ordspråkssidan", await navigateTo(START_PAGE_URL), START_PAGE_BODY);
check("Ordspråkssidan visas när man ber om den", await navigateTo(PROVERB_PAGE_URL), PROVERB_PAGE_BODY);

/* En nyuppsatt platta har aldrig öppnat QR-sidan. Ligger den inte i app-skalet
   är QR-koden värdelös utan nät. */
console.log("\n2. Ny platta: QR-koden skannas för första gången offline");
await installServiceWorker();
isNetworkAvailable = false;

check("Ordspråkssidan fungerar utan tidigare besök", await navigateTo(PROVERB_PAGE_URL), PROVERB_PAGE_BODY);
check("Klockan fungerar utan tidigare besök", await navigateTo(START_PAGE_URL), START_PAGE_BODY);

/* En adress som varken finns i app-skalet eller har besökts. Klockan är ett
   bättre svar än webbläsarens felsida på en skärm ingen kan klicka på. */
console.log("\n3. Okänd adress offline");
await installServiceWorker();
isNetworkAvailable = false;

check("Faller tillbaka på klockan", await navigateTo(`${SITE_BASE}finns-inte.html`), START_PAGE_BODY);

console.log(hasFailure ? "\nFEL  minst ett scenario föll\n" : "\nOK   alla scenarier håller\n");
process.exit(hasFailure ? EXIT_FAILURE : EXIT_SUCCESS);
