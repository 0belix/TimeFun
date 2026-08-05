/* ==========================================================================
   Serviceworker för Klockan

   Uppgiften är att väggklockan ska fortsätta fungera när nätet försvinner.
   Höj CACHE_VERSION varje gång Klockan.html ändras — det är signalen som
   gör att den gamla cachen städas bort.
   ========================================================================== */

const CACHE_VERSION = "klockan-v1";
const APP_START_PAGE = "./index.html";

/* Filer som ska finnas i cachen direkt vid installationen. */
const APP_SHELL_PATHS = Object.freeze([
  "./",
  APP_START_PAGE,
  "./quotes.js",
  "./logo.png",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
]);

/* Typsnitten ligger hos Google och hämtas i två steg: först en CSS-fil, sedan
   själva typsnittsfilerna. Båda värdarna cachas i takt med att de används. */
const FONT_HOSTS = Object.freeze(["fonts.googleapis.com", "fonts.gstatic.com"]);

const NAVIGATION_REQUEST_MODE = "navigate";
const GET_METHOD = "GET";
const OPAQUE_RESPONSE_TYPE = "opaque";


/* ==========================================================================
   Installation
   ========================================================================== */

/* Varje fil hämtas för sig. Med cache.addAll() räcker det att en enda fil
   saknas för att hela installationen ska avbrytas — och då uteblir
   offline-läget helt, utan synligt felmeddelande. */
async function cacheAppShell() {
  const cache = await caches.open(CACHE_VERSION);

  await Promise.all(APP_SHELL_PATHS.map(async (path) => {
    try {
      // cache: "reload" kringgår webbläsarens vanliga cache vid installationen
      await cache.add(new Request(path, { cache: "reload" }));
    } catch (error) {
      console.warn(`Klockan: ${path} kunde inte cachas och hoppas över.`, error);
    }
  }));

  // Ny version tar över direkt i stället för att vänta på att alla flikar stängs
  await self.skipWaiting();
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell());
});


/* ==========================================================================
   Aktivering
   ========================================================================== */

async function removeOutdatedCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((cacheName) => cacheName !== CACHE_VERSION)
      .map((cacheName) => caches.delete(cacheName))
  );
  await self.clients.claim();
}

self.addEventListener("activate", (event) => {
  event.waitUntil(removeOutdatedCaches());
});


/* ==========================================================================
   Hämtning
   ========================================================================== */

/* Sidan hämtas i första hand från nätet, så att en ny version slår igenom vid
   nästa laddning. Först när nätet inte svarar används den sparade kopian. */
async function respondWithNetworkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(APP_START_PAGE, response.clone());
    return response;
  } catch (error) {
    const cachedPage = await cache.match(APP_START_PAGE);
    if (cachedPage !== undefined) return cachedPage;
    throw error;
  }
}

/* Ikoner, manifest och typsnitt ändras sällan och hämtas därför från cachen
   när de finns där. Det gör starten snabb och oberoende av nätet. */
async function respondWithCacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cachedResponse = await cache.match(request);
  if (cachedResponse !== undefined) return cachedResponse;

  const response = await fetch(request);
  /* Typsnitten kommer från en annan domän och svarar ogenomskinligt, utan
     läsbar status. De går ändå att spara och återanvända. */
  if (response.ok || response.type === OPAQUE_RESPONSE_TYPE) {
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== GET_METHOD) return;

  if (request.mode === NAVIGATION_REQUEST_MODE) {
    event.respondWith(respondWithNetworkFirst(request));
    return;
  }

  const requestUrl = new URL(request.url);
  const isOwnFile = requestUrl.origin === self.location.origin;
  const isFontFile = FONT_HOSTS.includes(requestUrl.hostname);
  if (isOwnFile || isFontFile) {
    event.respondWith(respondWithCacheFirst(request));
  }
});
