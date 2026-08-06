# Klockan – PWA

En klocka som fyller hela skärmen, med analog urtavla, digital klocka,
namn, ett litet påskägg och en rad valbara extra funktioner.

---

## Vad som ändrats sedan förra versionen

Dina två senaste förbättringar finns kvar och är oförändrade i sak:

- **Fallbladstavlan med ett kort per siffra** — du hade rätt, ett blad per
  tecken är hur en riktig tavla fungerar. Nu viker dessutom bara den siffra
  som faktiskt ändras.
- **Din vapensköld** på den eleganta urtavlan. Den ligger numera som
  `logo.png` i stället för base64 inuti HTML-filen, så att koden går att
  läsa och jämföra. Bilden är oförändrad.

### Buggar som rättats

| | Vad som hände |
|---|---|
| 🟠 | `setInterval` driftade — klockan kunde hoppa över sekunder. Nu en självkorrigerande timer. |
| 🟠 | Partikelloopen ritade om skärmen 60 ggr/s **året runt**, även utan effekt. Stoppas nu helt. |
| 🟠 | Rastsignalen hade ett tvåsekundersfönster och missades helt om appen legat i bakgrunden. |
| 🟠 | Flip-klockan byggde om alla kort varje sekund — 300 nya DOM-noder i minuten. |
| 🟡 | Påskägget gick inte att nå i läget "Bara digital". |
| 🟡 | Fel typsnitt satt kvar vid byte till flip-stil (inline-stil vann över CSS). |
| 🟡 | `"25:99"` godkändes som klockslag. |
| 🟡 | Inställningar försvann om panelen stängdes utan att trycka "Klar". |
| 🟡 | Canvas saknade `devicePixelRatio` — suddiga partiklar. |
| 🔴 | QR-biblioteket hämtades från en CDN utan integritetskontroll. |

### Nytt

- **Tio teman.** Dina fyra urtavlor finns kvar oförändrade, med sina namn och
  sin palett. Utöver dem sex nya som styr hela utseendet — palett, typsnitt,
  urtavlans uppbyggnad och panelerna: Funkis, Deco, Station, Bakelit,
  Neonrör och Hårstreck. De två sistnämnda hette först Neon och Minimal, men
  döptes om så att dina namn fick behålla sina.
- **Vikanimation** på fallbladen — fyra lager per kort, med studs mot stoppet.
- **QR-koden är tillbaka, utan internetberoende.** Kodaren är inbyggd
  (byte-läge, nivå M) och verifierad mot ISO-tabellerna och en riktig
  avkodare. Det var nätberoendet som gjorde den opålitlig, inte funktionen.
- **`quotes.js`** — två skilda samlingar på ett enda ställe: `QUOTES` för
  påskägget och `PROVERBS` för QR-sidan. De ska inte överlappa — den som
  skannar koden på väggen ska få något annat än den som hittat påskägget.
- **Robust serviceworker.** Din `cache.addAll()` avbryter hela
  installationen om en enda fil saknas, och då försvinner offline-läget
  utan felmeddelande. Nu hämtas filerna var för sig.

### Bra att veta

- **Sparade inställningar följer med automatiskt.** Gamla nycklar
  (`frukostTime`, `bg`, `clockStyle` …) migreras vid första starten.
  Ingen tappar sina val.
- **Monogramfältet finns kvar.** Lämnar du det tomt visas din vapensköld,
  skriver du något visas den texten. Automatiska initialer från namnen
  utgick — den funktionen togs bort redan i din version.
- Alla identifierare är engelska, alla kommentarer och all text mot
  användaren är svensk.

---

## Grundfunktioner

- **Analog urtavla** (SVG) och **digital klocka** — visa båda eller bara
  den ena, via Inställningar → Visning.
- **Fritt val av färg**, som ett alternativ till temats egen palett.
- **Ett eller två namn** under klockan med valfritt typsnitt.
- **Helskärm** (nere till vänster) och **wake lock** så skärmen inte somnar.

## Teman — svepbara

Svep åt vänster eller höger på den analoga klockan för att byta tema, och
på digitalklockan för att byta mellan Vanlig och Flip-klocka. Prickraden
under visar var i karusellen du är. Går även att välja i Inställningar.

| Tema | Urtavla |
|---|---|
| **Funkis** | Alla siffror, minutring, batongvisare med motvikt |
| **Deco** | Solstrålar, siffror vid 12/3/6/9, rombvisare, vapenskölden |
| **Station** | Inga siffror, röd sekundvisare som sveper och vilar vid tolv |
| **Bakelit** | Glödande radioskala, kondenserat typsnitt |
| **Neonrör** | Cyan och magenta, hårfina visare |
| **Hårstreck** | Fyra streck och inget mer |
| **Klassisk** | Originalet — alla siffror, raka visare |
| **Minimalistisk** | Originalet — bara timstreck, inga siffror |
| **Neon** | Originalet — glöd i den färg du valt |
| **Lyxig** | Originalet — antikva, tunna visare, vapenskölden |

De fyra sista är de ursprungliga urtavlorna, med sin gamla mörkblå palett.
Den som uppdaterar från en tidigare version behåller exakt den tavla hen
redan valt. Vill du styra färgerna själv finns "Använd egna färger" kvar —
då följer hela tavlan dina val, precis som förut.

Tryck **5 gånger** (korta tryck, inte svep) på klockan för att öppna
påskägget med skärmtangentbordet. Skriv "Stockholm" så visas ett slumpat
litterärt citat. Fungerar på både den analoga och den digitala klockan.

## Raster

Ställ in klockslag för Frukost, Lunch och Fika (standard 09:00 / 12:00 /
14:30). Nedräkningen räknar alltid till nästa kommande rast, oavsett i
vilken ordning tiderna matas in.

### Arbetsdagens slut

En egen tid för när det är dags att gå hem (standard 16:30). Den ingår i
nedräkningen som rasterna, men signalen är längre och kraftigare och hela
sidan blinkar fyra gånger. Varningen har egen kryssruta och går fram även
för den som stängt av rastpling.

Blinkningen pulsar 1 Hz — långt under gränsen där blinkande ytor blir en
risk för ljuskänsliga. Vid reducerad rörelse ersätts pulserna av en lugn
toning.

Ljudsignalen för raster är en kort tvåtonssignal som genereras i webbläsaren. Den
spelas även om appen legat i bakgrunden en stund — men tystnar om rasten
passerade för mer än fem minuter sedan.

## Säsongseffekter

- **Snö** i december till och med trettondagen.
- **Konfetti** på nyårsafton och nyårsdagen.
- **Extra festdag** — eget datum i formatet `MM-DD`.

Stängs automatiskt av om systemet är inställt på reducerad rörelse. Det
gäller även fallbladens vikning och stationsklockans svep.

## Små fönster

Klockan skalar ner i två steg. Under 480 px höjd krymper knappar, text och
marginaler. Under 300 px höjd plockas allt utom tiden bort — namn, prickar
och rastnedräkning tas bort, och bara kugghjulet och rastnedräkningen blir kvar.
Sekunderna släpps också: fyra fallbladskort i stället för sex gör varje
siffra omkring femtio procent större, och det är radens bredd som tar slut
först — inte höjden.

Vid den storleken finns det bara plats för en klocka, och fönstrets form
avgör vilken: en bred och låg remsa visar siffrorna, en kvadratisk ruta
urtavlan. Panelerna täcker hela rutan för att gå att använda alls.

Ungefär 5x3 cm är den minsta storlek där det fortfarande ser avsiktligt ut.

## Ljud

Två oberoende ljud, båda avstängda från början:

- **Rastsignal** — kort tvåtonssignal när en rast börjar.
- **Fallbladens klack** — ett anslag i samma ögonblick som bladet slår i
  stoppet. Ett klack per sekund, inte ett per siffra.

Båda genereras i webbläsaren, inga ljudfiler behövs.

---

## Vilken version kör plattan?

Längst ner i Inställningar står tre uppgifter:

- **Version** — appens versionsnummer, höjs för hand i `APP_VERSION`.
- **Filens datum** — kommer från serverns svar och sköter sig självt. Visar
  det ett gammalt datum är det en cachad kopia som visas, inte det som
  ligger på servern.
- **Cache** — vilken service worker som faktiskt är i tjänst.

Knappen **Hämta om allt från servern** raderar alla cachar, avregistrerar
service workern och laddar om. Den finns för att en gammal service worker
annars kan fortsätta servera gamla filer långt efter att servern
uppdaterats — GitHub låter dessutom webbläsaren cacha `sw.js` i tio
minuter, så en höjd `CACHE_VERSION` slår inte igenom direkt.

## Filer

```
index.html                  – appen
quotes.js                   – citaten, delas med ordsprak.html
ordsprak.html               – svenska ordspråk, sidan QR-koden pekar på
logo.png                    – vapenskölden på Deco-tavlan
manifest.json               – gör appen installerbar
sw.js                       – service worker, cache för offline
icon-192.png / icon-512.png / icon-maskable-512.png
```

## Installation

1. Lägg alla filer i repots rot.
2. Aktivera GitHub Pages (Settings → Pages → Deploy from branch → main → root).
3. Öppna länken i Chrome på plattan → meny → "Installera app".

**Serviceworkern kräver `https://` eller `localhost`.** Öppnar du filen
direkt från disk blir det varken app eller offline-läge — då säger appen
till i stället för att tiga.

## Anpassa

| Vad | Var |
|---|---|
| Citaten i påskägget | `QUOTES` i `quotes.js` |
| Ordspråken på QR-sidan | `PROVERBS` i `quotes.js` |
| Teman | `THEMES` i `index.html`, plus `:root[data-theme="..."]` i CSS |
| Vapenskölden | byt ut `logo.png`, justera `DIAL_CREST_WIDTH` / `DIAL_CREST_HEIGHT` |
| Rasttider | `DEFAULT_SETTINGS.breakfastTime` m.fl. |
| Säsongsdatum | `getSeasonalEffect()` |
| Ljudsignalen | `playChime()` och `CHIME_*`-konstanterna |
| Vikningens fart | `--flip-leaf-duration` i CSS — klacket följer med automatiskt |
| Svepets fördelning | `@keyframes station-sweep` i CSS |
| Klackets klang | `CLACK_*`-konstanterna |

Egna filer levereras ur cachen direkt men hämtas om i bakgrunden, så en
ändring slår igenom vid nästa laddning utan att `CACHE_VERSION` behöver
höjas. Höj den ändå om du vill tvinga fram en total omladdning.
