# Fyra digitalstilar till, larmband, flip-rörelser — och en fix som får bygget att gå igenom

## Läs den här först

`index.html` innehåller en JSDoc-kommentar med `{{`. GitHub Pages kör Jekyll,
som tolkar `{{` som sin egen mallsyntax och avbryter bygget. **Det är därför
de senaste körningarna av `pages-build-deployment` misslyckats** — filerna har
legat rätt i repot men aldrig publicerats.

Två saker åtgärdar det:

- kommentaren är omskriven utan dubbelklammer
- en tom `.nojekyll` läggs till, så Jekyll aldrig kör igen

Utan `.nojekyll` kan samma sak hända nästa gång någon skriver `{{` eller `{%`
var som helst i koden — inklusive i en kommentar.

---

## Nytt

### Tre digitalstilar till

| Stil | |
|---|---|
| **Väckarklocka** | De släckta segmenten ligger kvar svagt bakom siffrorna. Det är dem man ser på en riktig LCD. |
| **Ord** | "kvart över tre", "fem i halv nio". Avrundar till närmaste femminutersteg. |
| **Binär** | Sex kolumner, en per siffra, med värdena 8·4·2·1. |

### Flippens rörelse kan väljas

Fallblad (den befintliga), Rulle och Toning. Valet syns bara när Flip-klocka
är vald.

Koden kollade tidigare animationens *namn* för att veta när ett blad landat.
Med flera rörelser hade det gått sönder, så den tittar nu på vilket element
som slutat i stället.

### Rullande larmtext

Ett band över skärmen som visas när en tid slår till — "Dags för lunch",
"Dags att gå hem" — och försvinner av sig självt efter en halv minut. Ett
tredje varningssätt vid sidan av ljud och blink.

Varningarna är nu tre kryssrutor var för raster och för arbetsdagens gränser,
i stället för ett samlat val.

### Fönster som ligger överst

Knapp under Digitalklockans stil som öppnar klockan i ett litet fönster ovanpå
allt annat, via Document Picture-in-Picture. Visas bara i webbläsare som klarar
det.

Noderna *flyttas* dit i stället för att kopieras — då följer alla lyssnare med
och det är samma klocka som går vidare, inte en andra instans. Stängs fönstret
kommer allt tillbaka.

---

## Rättat

- **Alla siffror i flip-klockan är lika breda.** Kortets bredd mättes förut mot
  siffran som visades, så en etta blev smalare än en nolla i typsnitt utan
  tabellsiffror. Bredden mäts nu alltid mot samma tecken.
- **Sekunderna syns igen i små fönster.** Korten gjordes smalare i stället för
  att sekunderna släpptes. Sex kort ryms ner till ungefär 5x3 cm.
- **Alla fem tider ligger i samma rutnät** — start, frukost, lunch, fika och
  hemgång — som lägger om sig efter panelens bredd.
- **Svenskt datumformat** i versionsraden, `2026-08-07 06:40` i stället för
  `08/07/2026`.
- En konstant deklarerades efter den funktion som använde den. Felet fångades
  av ett try/catch, så appen såg ut att fungera men **föll tyst tillbaka på
  standardvärden vid varje start**. Det hade märkts som att den glömmer
  inställningar ibland.

---

## Att veta

**Sparade inställningar migreras automatiskt**, hela vägen från de äldsta
svenska nycklarna. Testat från version 1, 2, 3 och 4 — ingen tappar sina val.

`CACHE_VERSION` är höjd till `klockan-v5`.

**Filer:** `.nojekyll` (ny), `index.html`, `ordsprak.html`, `sw.js`.
`quotes.js` och `README.md` är oförändrade och behöver inte laddas upp.
