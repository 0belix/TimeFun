# Klockan – PWA

En vanlig analog klocka som fyller hela skärmen, med:

- **Analog urtavla** (timmar/minuter/sekunder som visare), ritad i SVG och
  uppdaterad varje sekund.
- **Digital klocka** ovanför den analoga, i det pixliga "digitalur"-typsnittet
  VT323 — för kollegor (eller andra) som hellre vill läsa siffror.
- **Fritt val av färg** på förgrund (visare, siffror, text) och bakgrund,
  via kugghjulet uppe till höger. Sparas i webbläsaren (`localStorage`) så
  det ligger kvar nästa gång appen öppnas.
- **Ett eller två namn** under klockan, med valfritt typsnitt (se nedan).
  Fyll bara i namn 1 så visas det centrerat. Fyll i båda så visas de
  bredvid varandra med ett "&" emellan.
- **Valfri måltidsnedräkning** uppe i vänstra hörnet (se nedan).
- **Påskägg**: tryck/tappa på klockan 5 gånger (inom ett par sekunder) så
  dyker ett skärmtangentbord upp. Skriv "Stockholm" så visas ett slumpat
  citat av antingen Astrid Lindgren eller Vilhelm Moberg.
- **Helskärm** (knappen nere till vänster) och **wake lock** så skärmen
  inte somnar, precis som i nedräkningsappen.

## Typsnitt för namn och digitalklocka
I inställningarna finns typsnitts-menyer med förhandsvisning direkt i
listan, för både namnen och digitalklockan:

| Alternativ        | Typsnitt (Google Fonts)      |
|--------------------|-------------------------------|
| Standard           | Systemets vanliga typsnitt    |
| Digitalur (VT323)  | VT323 (pixligt digitalur-typsnitt) |
| Fraktur            | UnifrakturMaguntia (gotisk)   |
| Comic Sans         | Comic Neue (öppen tvilling till Comic Sans MS — den riktiga Comic Sans finns inte gratis/licensierad för webben, men Comic Neue är i praktiken identisk i stilen) |
| Filttusch          | Permanent Marker              |
| Bubblig            | Pacifico                      |
| Retro-tv           | Press Start 2P (8-bitars speltypsnitt) |

Kryssrutan **"Samma typsnitt för namn och digitalklocka"** styr om de två
ska följas åt eller ställas in var för sig:
- **Ikryssad**: bara en typsnittsmeny visas (för namnen), och digitalklockan
  följer automatiskt samma val.
- **Urkryssad**: en egen meny för digitalklockans typsnitt dyker upp, så du
  kan välja olika typsnitt för namnen och klockan.

Typsnitten laddas från Google Fonts, så plattan behöver vara uppkopplad
mot internet första gången (eller då och då) för att hämta dem. Är den
offline visas texten i webbläsarens vanliga typsnitt istället.

## Måltidsnedräkningen
Går att slå på/av via kryssrutan i inställningarna ("Visa nedräkning till
frukost/lunch/fika"). När den är på visas en liten ruta uppe i vänstra
hörnet som följer ett dagligt schema:

| Tid           | Vad som visas                          |
|---------------|-----------------------------------------|
| 07:00 – 09:00 | Nedräkning till **Frukost** (09:00)     |
| 09:00 – 12:00 | Nedräkning till **Lunch** (12:00)       |
| 12:00 – 14:30 | Nedräkning till **Fika** (14:30)        |
| 14:30 – 07:00 (nästa dygn) | Vilar, väntar till kl 07:00 |

Klockan 14:30 nollställs den alltså och väntar tyst till nästa dags 07:00,
då en ny nedräkning mot frukost börjar om.

## Filer
```
index.html         – appen
manifest.json       – gör appen installerbar
sw.js               – service worker, cache för offline
icon-192.png / icon-512.png
```

## Installation (samma flöde som tidigare)
1. Ladda upp alla filer i repots rot på GitHub.
2. Aktivera GitHub Pages (Settings → Pages → Deploy from branch → main → root).
3. Öppna länken i Chrome på Android-plattan → meny → "Lägg till på
   startskärmen" / "Installera app".
4. Tryck "⛶" nere till vänster för extra helskärmsläge utöver PWA-läget.

## Om citaten
Jag har bara tagit med citat jag kunnat verifiera mot flera oberoende
källor, och hållit dem korta. Vilhelm Mobergs kända *korta* citat visade
sig vara ovanligt få att hitta belagda — det mesta som cirkulerar om
honom är antingen längre stycken ur böckerna eller oklart varifrån de
kommer — så listan lutar åt Astrid Lindgren (9 av 10). Vill du ha fler
Moberg-citat, lägg gärna till egna i `quotes`-arrayen i `index.html`,
men dubbelkolla källan så att attributionen stämmer.

## Anpassa
- **Citaten**: `quotes`-arrayen i `index.html`.
- **Lösenordet** för påskägget (just nu "stockholm"): sök efter
  `checkEasterEgg` i `index.html` och byt ut strängen `"stockholm"`.
- **Antal tryck / tidsfönster** för påskägget: variablerna `TAP_TARGET`
  (antal tryck, nu 5) och `TAP_RESET_MS` (hur lång paus som nollställer
  räkningen, nu 2500 ms).
- **Måltidstiderna**: funktionen `getMealState(now)` i `index.html` — byt
  ut klockslagen (7/9/12/14:30) om du vill ha andra tider eller fler
  pass.
- **Standardfärger**: `defaults`-objektet i `index.html`.
- **Typsnitten**: `FONT_OPTIONS`-arrayen i `index.html` — lägg till,
  ta bort eller byt ut typsnitt (hämta då gärna motsvarande
  Google Fonts-länk och lägg till i `<head>`). Samma lista används
  både för namnen och digitalklockan.
