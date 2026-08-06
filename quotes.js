/* ==========================================================================
   Texter — gemensam källa

   Två skilda samlingar, med varsin plats i appen:

   QUOTES   – litterära citat, visas av påskägget i index.html
   PROVERBS – svenska ordspråk, visas av ordsprak.html som QR-koden pekar på

   De ska medvetet inte överlappa. Skannar någon koden på väggen ska hen få
   något annat än den som hittat påskägget.
   ========================================================================== */

export const QUOTES = Object.freeze([
  { text: "Man bör leva sitt liv så man blir vän med döden.", author: "Astrid Lindgren" },
  { text: "Ge barnen kärlek, mera kärlek och ännu mera kärlek.", author: "Astrid Lindgren" },
  { text: "Det har jag aldrig provat förut, så det klarar jag säkert.", author: "Astrid Lindgren, Pippi Långstrump" },
  { text: "Man kan inte piska in något i barn, men man kan smeka fram mycket.", author: "Astrid Lindgren" },
  { text: "Den som är väldigt stark måste också vara väldigt snäll.", author: "Astrid Lindgren, Pippi Långstrump" },
  { text: "Och så ska man ju ha några stunder att bara sitta och glo också!", author: "Astrid Lindgren" },
  { text: "Barn måste få vara barn och de måste få vara fria.", author: "Astrid Lindgren" },
  { text: "Sandaler minsann! Fint som kattskit i vällingen!", author: "Astrid Lindgren, Madicken" },
  { text: "Herr Blomkvist är en skicklig kemist, kan jag förstå?", author: "Astrid Lindgren, Mästerdetektiven Blomkvist" },
  { text: "Ta vara på ditt liv, för nu är det din stund på jorden.", author: "Vilhelm Moberg, Din stund på jorden" }
]);

/* Traditionella svenska ordspråk. De saknar upphovsperson — det är själva
   poängen med ett ordspråk — så sidan sätter i stället en fast underrubrik. */
export const PROVERBS = Object.freeze([
  "Morgonstund har guld i mund.",
  "Många bäckar små gör en stor å.",
  "Man ska smida medan järnet är varmt.",
  "Den som väntar på något gott väntar aldrig för länge.",
  "Den som gapar efter mycket mister ofta hela stycket.",
  "Bättre en fågel i handen än tio i skogen.",
  "Tala är silver, tiga är guld.",
  "Ju fler kockar, desto sämre soppa.",
  "Övning ger färdighet.",
  "Man ska inte döma hunden efter håren.",
  "Nya kvastar sopar bäst.",
  "Efter regn kommer solsken.",
  "Nöden är uppfinningarnas moder.",
  "Man saknar inte kon förrän båset är tomt.",
  "Man ska inte köpa grisen i säcken.",
  "Det är inte guld allt som glimmar.",
  "Ingen rök utan eld.",
  "Bättre fly än illa fäkta.",
  "Lika barn leka bäst.",
  "Borta bra men hemma bäst."
]);
