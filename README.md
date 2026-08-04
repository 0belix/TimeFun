# Klockan – PWA

En klocka som fyller hela skärmen, med analog urtavla, digital klocka,
namn, ett litet påskägg, och en rad valbara extra funktioner.

## Grundfunktioner
- **Analog urtavla** (SVG, uppdateras varje sekund) och **digital klocka**
  — visa båda, eller bara den ena, via Inställningar → Visning.
- **Fritt val av färg** på förgrund och bakgrund. Sparas i webbläsaren.
- **Ett eller två namn** under klockan, med valfritt typsnitt (Standard,
  Fraktur, Comic Sans, Filttusch, Bubblig, Retro-tv).
- **Helskärm** (nere till vänster) och **wake lock** så skärmen inte somnar.

## Urtavlestilar — svepbara
Sväp direkt åt vänster/höger på den analoga klockan eller på digital-
klockan för att bläddra mellan stilar (en liten prickrad under varje
visar var i karusellen du är). Går även att välja i Inställningar.

**Analog:**
- **Klassisk** — den ursprungliga stilen med siffror och minutstreck.
- **Minimalistisk** — bara timstreck, inga siffror.
- **Neon** — samma som klassisk men med ett mjukt glow i förgrundsfärgen.
- **Lyxig** — elegant seriftypsnitt (Playfair Display) och ett litet eget
  monogram under mitten (dina initialer, eller skriv in valfria 1–3
  bokstäver i Inställningar). Det här är en helt egen, orginal design —
  *inte* en kopia av något varumärkes logotyp.

**Digital:**
- **Vanlig** — text i det typsnitt du valt för digitalklockan.
- **Flip-klocka** — siffrorna visas som "split-flap"-kort, ungefär som en
  gammaldags flygplats- eller tågstationstavla.

Tryck fortfarande **5 gånger** (korta tryck, inte svep) på den analoga
klockan för att öppna påskägget med skärmtangentbordet — se nedan.

## Raster: frukost, lunch, fika
I Inställningar → Raster ställer du in klockslag för Frukost, Lunch och
Fika (standard 09:00 / 12:00 / 14:30). Nedräkningen räknar alltid till
nästa kommande rast och byter automatiskt mål när en rast passeras —
oavsett vilken ordning du råkar mata in tiderna i.

- **Visa nedräkning till nästa rast**: en liten ruta uppe i vänstra
  hörnet med tid kvar. Helt valfri, av som standard.
- **Spela ljud när en rast börjar**: en kort tvåtonssignal (genereras i
  webbläsaren, ingen ljudfil behövs) spelas exakt när frukost, lunch
  eller fika börjar. Fungerar oberoende av om rutan syns eller inte.
  Webbläsare kräver interaktion innan ljud får spelas — det sker
  automatiskt vid första tryck någonstans i appen.

## Säsongseffekter
Valfri (på som standard) diskret partikeleffekt ovanpå allt annat:
- **Snö** i december och fram till och med 6 januari (trettondagen).
- **Konfetti** på nyårsafton (31/12) och nyårsdagen (1/1).
- **Extra fest-dag**: fyll i ett eget datum (format `MM-DD`, t.ex. `04-12`
  för 12 april) i Inställningar för konfetti även den dagen — perfekt
  för en födelsedag.

## QR-kod: slumpmässigt visdomsord
Knappen 🔳 nere till höger visar en QR-kod. Skannar man den med en annan
enhet (telefon, surfplatta) öppnas `ordsprak.html` — en liten fristående
sida med ett slumpat svenskt ordspråk ur en lista på ett femtiotal, och
en knapp för att slumpa ett nytt (samma ordspråk visas aldrig två gånger
i rad på samma enhet). Sidan behöver ligga i samma mapp som `index.html`
på GitHub Pages för att länken ska fungera.

## Påskägget
Tryck (inte sväp) **5 gånger** på den analoga klockan inom ett par
sekunder för att öppna ett skärmtangentbord. Skriv "Stockholm" så visas
ett slumpat citat av Astrid Lindgren eller Vilhelm Moberg.

## Filer
```
index.html          – appen
ordsprak.html        – sidan QR-koden länkar till
manifest.json        – gör appen installerbar
sw.js                – service worker, cache för offline
icon-192.png / icon-512.png
```

## Installation
1. Ladda upp alla filer (även `ordsprak.html`) i repots rot på GitHub.
2. Aktivera GitHub Pages (Settings → Pages → Deploy from branch → main → root).
3. Öppna länken i Chrome på Android-plattan → meny → "Lägg till på
   startskärmen" / "Installera app".
4. Tryck "⛶" nere till vänster för extra helskärmsläge utöver PWA-läget.

## Att känna till
- **Google Fonts och QR-biblioteket** hämtas från internet. Fungerar
  offline efter första besöket tack vare service workern, men om
  plattan aldrig varit uppkopplad visas standard-typsnitt istället och
  QR-knappen visar ett felmeddelande.
- Den "lyxiga" urtavlan med monogram är en **egen, orginal design** —
  inte en kopia av något bilmärkes eller varumärkes logotyp.
- Citaten (påskägget) och ordspråken (QR-koden) är noga utvalda för att
  vara verifierbara respektive fritt kulturarv utan enskild upphovsperson.

## Anpassa
- **Citaten**: `quotes`-arrayen i `index.html`.
- **Ordspråken**: `sayings`-arrayen i `ordsprak.html`.
- **Urtavlestilarna**: `CLOCK_STYLES` / `DIGITAL_STYLES` i `index.html`,
  plus motsvarande CSS-klasser (`#clock.style-...`, `#digital-clock.style-...`).
- **Rasttiderna** (standardvärden): `defaults.frukostTime` m.fl.
- **Säsongseffekternas datum**: funktionen `getSeasonalEffect(now)`.
- **Ljudsignalen**: funktionen `playChime()`.
