import type { ExerciseSeed } from "./types";

/** B1 & B2 exercises */
export const EXERCISES_B: ExerciseSeed[] = [
  // ── B1 grammar ──
  {
    slug: "b1-praeteritum-gap", levelCode: "B1", title: "Präteritum-Formen", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Setze das Verb im Präteritum ein.", grammarTopicSlug: "praeteritum",
    questions: [
      { id: "pr-1", type: "gap", prompt: "Gestern ___ ich sehr müde. (sein)", answers: ["war"], explanation: "sein → war." },
      { id: "pr-2", type: "gap", prompt: "Wir ___ leider keine Zeit. (haben)", answers: ["hatten"], explanation: "haben → hatten (wir)." },
      { id: "pr-3", type: "gap", prompt: "Er ___ nach Hause und dachte nach. (gehen)", answers: ["ging"], explanation: "Irregular: gehen → ging." },
      { id: "pr-4", type: "gap", prompt: "Als Kind ___ ich nicht schwimmen. (können)", answers: ["konnte"], explanation: "können → konnte (no umlaut in Präteritum!)." },
      { id: "pr-5", type: "gap", prompt: "Sie ___ nichts von dem Termin. (wissen)", answers: ["wusste"], explanation: "Mischverb: wissen → wusste." },
    ],
  },
  {
    slug: "b1-nebensaetze-ordnen", levelCode: "B1", title: "Nebensätze bauen", skill: "GRAMMAR", type: "ORDERING",
    instructions: "Baue die Sätze — Verb ans Ende des Nebensatzes!", grammarTopicSlug: "nebensaetze-weil-dass-wenn",
    questions: [
      { id: "ns-1", type: "order", prompt: "weil:", fragments: ["Ich", "lerne", "Deutsch,", "weil", "ich", "in", "Berlin", "arbeiten", "will."], explanation: "weil-clause: … arbeiten will (verb cluster at the end)." },
      { id: "ns-2", type: "order", prompt: "dass:", fragments: ["Er", "sagt,", "dass", "er", "morgen", "keine", "Zeit", "hat."], explanation: "dass … hat — conjugated verb last." },
      { id: "ns-3", type: "order", prompt: "Nebensatz zuerst:", fragments: ["Wenn", "ich", "Zeit", "habe,", "koche", "ich", "gern."], explanation: "Verb-Verb at the comma: … habe, koche …" },
      { id: "ns-4", type: "order", prompt: "obwohl:", fragments: ["Wir", "fahren", "Rad,", "obwohl", "es", "regnet."], explanation: "obwohl … regnet." },
    ],
  },
  {
    slug: "b1-wechselpraep-mcq", levelCode: "B1", title: "Wohin oder wo?", skill: "GRAMMAR", type: "MCQ",
    instructions: "Akkusativ (wohin?) oder Dativ (wo?)?", grammarTopicSlug: "wechselpraepositionen",
    questions: [
      { id: "wp-1", type: "mcq", prompt: "Ich gehe ___ Kino.", options: ["im", "ins", "in der"], answerIndex: 1, explanation: "Movement → Akkusativ: in das = ins." },
      { id: "wp-2", type: "mcq", prompt: "Wir sind ___ Kino.", options: ["ins", "in das", "im"], answerIndex: 2, explanation: "Location → Dativ: in dem = im." },
      { id: "wp-3", type: "mcq", prompt: "Das Buch liegt ___ Tisch.", options: ["auf den", "auf dem", "auf das"], answerIndex: 1, explanation: "liegen = position → Dativ." },
      { id: "wp-4", type: "mcq", prompt: "Er hängt das Bild ___ Wand.", options: ["an die", "an der", "an dem"], answerIndex: 0, explanation: "hängen (action, wohin?) → Akkusativ: an die Wand." },
      { id: "wp-5", type: "mcq", prompt: "Sie stellt die Flasche ___ Kühlschrank.", options: ["im", "in den", "in dem"], answerIndex: 1, explanation: "stellen → Akkusativ: in den Kühlschrank." },
    ],
  },
  {
    slug: "b1-adjektive-gap", levelCode: "B1", title: "Adjektivendungen", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Setze die richtige Endung ein (nur die Endung!).", grammarTopicSlug: "adjektivdeklination",
    questions: [
      { id: "ad-1", type: "gap", prompt: "Das ist ein interessant___ Buch.", answers: ["es"], explanation: "ein + neuter Nominativ → -es (the adjective shows das)." },
      { id: "ad-2", type: "gap", prompt: "Ich trinke einen heiß___ Kaffee.", answers: ["en"], explanation: "Akkusativ maskulin → immer -en." },
      { id: "ad-3", type: "gap", prompt: "Die klein___ Wohnung ist trotzdem teuer.", answers: ["e"], explanation: "After die (Nom.) → -e." },
      { id: "ad-4", type: "gap", prompt: "Er hilft der alt___ Frau.", answers: ["en"], explanation: "Dativ → always -en." },
      { id: "ad-5", type: "gap", prompt: "Das sind die best___ Restaurants der Stadt.", answers: ["en"], explanation: "Plural with article → -en." },
    ],
  },
  {
    slug: "b1-reflexiv-mcq", levelCode: "B1", title: "Reflexivpronomen", skill: "GRAMMAR", type: "MCQ",
    instructions: "Wähle das richtige Pronomen.", grammarTopicSlug: "reflexive-verben",
    questions: [
      { id: "rf-1", type: "mcq", prompt: "Ich freue ___ auf das Wochenende.", options: ["mir", "mich", "sich"], answerIndex: 1, explanation: "sich freuen: default Akkusativ → mich." },
      { id: "rf-2", type: "mcq", prompt: "Ich wasche ___ die Hände.", options: ["mich", "mir", "sich"], answerIndex: 1, explanation: "Second object (die Hände) → reflexive becomes Dativ: mir." },
      { id: "rf-3", type: "mcq", prompt: "Interessierst du ___ für Musik?", options: ["dir", "dich", "sich"], answerIndex: 1, explanation: "sich interessieren für + Akk → dich." },
      { id: "rf-4", type: "mcq", prompt: "Wir treffen ___ um acht vor dem Kino.", options: ["sich", "uns", "euch"], answerIndex: 1, explanation: "wir → uns." },
    ],
  },
  // ── B1 lesson exercises ──
  {
    slug: "b1-medien-mcq", levelCode: "B1", title: "Textverständnis: Medien", skill: "READING", type: "MCQ",
    instructions: "Beziehe dich auf den Text aus der Lektion.",
    questions: [
      { id: "md-1", type: "mcq", prompt: "Wie lange sind junge Erwachsene laut Studie täglich am Handy?", options: ["mehr als drei Stunden", "genau zwei Stunden", "eine Stunde"], answerIndex: 0, explanation: "„im Durchschnitt mehr als drei Stunden\"." },
      { id: "md-2", type: "mcq", prompt: "Was ist ein genannter Vorteil?", options: ["besserer Schlaf", "Tickets kaufen und Nachrichten lesen", "mehr Konzentration"], answerIndex: 1, explanation: "Apps make everyday life easier — tickets, family, news." },
      { id: "md-3", type: "mcq", prompt: "„Digital Detox\" bedeutet im Text:", options: ["ein neues Handy kaufen", "ein Tag ohne Smartphone", "eine App löschen"], answerIndex: 1, explanation: "One day per week completely without the smartphone." },
      { id: "md-4", type: "mcq", prompt: "„Laut einer Studie\" — laut steht mit:", options: ["Akkusativ", "Genitiv", "Dativ"], answerIndex: 2, explanation: "laut + Dativ: laut einer Studie." },
    ],
  },
  {
    slug: "b1-umwelt-gap", levelCode: "B1", title: "Umwelt-Vorschläge", skill: "VOCABULARY", type: "GAP_FILL",
    instructions: "Ergänze die Wörter aus der Lektion.",
    questions: [
      { id: "uw-1", type: "gap", prompt: "Plastikverpackungen kommen in die ___ Tonne.", answers: ["gelbe"], explanation: "Gelbe Tonne = plastic & packaging." },
      { id: "uw-2", type: "gap", prompt: "Auf der Flasche sind 25 Cent ___.", answers: ["Pfand"], explanation: "Deposit = das Pfand." },
      { id: "uw-3", type: "gap", prompt: "Wir ___ weniger Plastik kaufen. (Vorschlag mit sollen, Konjunktiv)", answers: ["sollten"], explanation: "Suggestion: sollten." },
      { id: "uw-4", type: "gap", prompt: "Man ___ öfter mit dem Rad fahren. (können, Konjunktiv)", answers: ["könnte"], explanation: "Softer suggestion: könnte." },
      { id: "uw-5", type: "gap", prompt: "Ich versuche, Plastik zu ___.", answers: ["vermeiden"], explanation: "vermeiden = to avoid." },
    ],
  },
  {
    slug: "b1-reisen-ordnen", levelCode: "B1", title: "Reisegeschichte ordnen", skill: "GRAMMAR", type: "ORDERING",
    instructions: "Baue die Erzählsätze.",
    questions: [
      { id: "rs-1", type: "order", prompt: "Konnektor zuerst:", fragments: ["Zuerst", "sind", "wir", "zwei", "Tage", "in", "Lissabon", "geblieben."], explanation: "Connector position 1 → verb position 2." },
      { id: "rs-2", type: "order", prompt: "als-Satz:", fragments: ["Als", "wir", "in", "Porto", "ankamen,", "hat", "es", "geregnet."], explanation: "als-clause: verb at its end, then main clause starts with verb." },
      { id: "rs-3", type: "order", prompt: "danach:", fragments: ["Danach", "haben", "wir", "ein", "Auto", "gemietet."], explanation: "Danach + Perfekt bracket." },
    ],
  },
  {
    slug: "b1-test-mix", levelCode: "B1", title: "B1-Test: Mix", skill: "GRAMMAR", type: "MCQ",
    instructions: "Der B1-Querschnitt.", xpReward: 20,
    questions: [
      { id: "b1t-1", type: "mcq", prompt: "Ich bleibe zu Hause, weil ich krank ___.", options: ["bin", "ist", "bist"], answerIndex: 0, explanation: "weil … ich bin — verb at the end, matching ich." },
      { id: "b1t-2", type: "mcq", prompt: "___ ich 18 war, habe ich den Führerschein gemacht.", options: ["Wenn", "Als", "Ob"], answerIndex: 1, explanation: "Single past event → als." },
      { id: "b1t-3", type: "mcq", prompt: "Sie stellt die Vase ___ Regal.", options: ["auf das", "auf dem", "über der"], answerIndex: 0, explanation: "stellen → wohin? → Akkusativ." },
      { id: "b1t-4", type: "mcq", prompt: "Das ist ein sehr gut___ Restaurant.", options: ["-e", "-es", "-er"], answerIndex: 1, explanation: "ein + das Restaurant (Nom.) → gutes." },
      { id: "b1t-5", type: "mcq", prompt: "Früher ___ es hier eine Bäckerei.", options: ["gab", "gibt", "gegeben"], answerIndex: 0, explanation: "Präteritum of geben: gab." },
      { id: "b1t-6", type: "mcq", prompt: "Ich erinnere ___ gern an den Urlaub.", options: ["mir", "mich", "sich"], answerIndex: 1, explanation: "sich erinnern an + Akk → mich." },
    ],
  },
  // ── B2 grammar ──
  {
    slug: "b2-passiv-gap", levelCode: "B2", title: "Passiv-Formen", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Bilde das Passiv.", grammarTopicSlug: "passiv",
    questions: [
      { id: "pv-1", type: "gap", prompt: "Der Brief ___ gerade geschrieben. (Präsens)", answers: ["wird"], explanation: "Vorgangspassiv Präsens: wird + P2." },
      { id: "pv-2", type: "gap", prompt: "Das Haus ___ 1990 gebaut. (Präteritum)", answers: ["wurde"], explanation: "Past process: wurde + P2." },
      { id: "pv-3", type: "gap", prompt: "Die Daten müssen gespeichert ___.", answers: ["werden"], explanation: "Modal + P2 + werden." },
      { id: "pv-4", type: "gap", prompt: "Der Fehler ist gestern entdeckt ___. (Perfekt)", answers: ["worden"], explanation: "Passive Perfekt: ist + P2 + worden (no ge-!)." },
      { id: "pv-5", type: "gap", prompt: "In der Schweiz ___ vier Sprachen gesprochen.", answers: ["werden"], explanation: "Plural subject: werden gesprochen." },
    ],
  },
  {
    slug: "b2-konjunktiv-gap", levelCode: "B2", title: "Konjunktiv II", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Setze die Konjunktiv-II-Form ein.", grammarTopicSlug: "konjunktiv-2",
    questions: [
      { id: "kj-1", type: "gap", prompt: "Wenn ich reich ___, würde ich viel reisen. (sein)", answers: ["wäre"], explanation: "sein → wäre." },
      { id: "kj-2", type: "gap", prompt: "Ich ___ gern einen Kaffee, bitte. (haben)", answers: ["hätte"], explanation: "The polite order: ich hätte gern." },
      { id: "kj-3", type: "gap", prompt: "___ Sie mir bitte helfen? (können)", answers: ["Könnten", "könnten"], explanation: "Polite request: Könnten Sie…?" },
      { id: "kj-4", type: "gap", prompt: "An deiner Stelle ___ ich den Job nehmen. (werden)", answers: ["würde"], explanation: "Advice: würde + Infinitiv." },
      { id: "kj-5", type: "gap", prompt: "Ich ___ gern, wo der Fehler liegt. (wissen)", answers: ["wüsste"], explanation: "wissen → wüsste." },
    ],
  },
  {
    slug: "b2-relativ-mcq", levelCode: "B2", title: "Relativpronomen", skill: "GRAMMAR", type: "MCQ",
    instructions: "Wähle das richtige Relativpronomen.", grammarTopicSlug: "relativsaetze",
    questions: [
      { id: "rl-1", type: "mcq", prompt: "Das ist der Kollege, ___ mir geholfen hat.", options: ["den", "der", "dem"], answerIndex: 1, explanation: "Subject of the clause → der." },
      { id: "rl-2", type: "mcq", prompt: "Der Film, ___ wir gesehen haben, war super.", options: ["der", "dem", "den"], answerIndex: 2, explanation: "Akkusativ object → den." },
      { id: "rl-3", type: "mcq", prompt: "Die Frau, mit ___ ich arbeite, kommt aus Wien.", options: ["der", "die", "dem"], answerIndex: 0, explanation: "mit + Dativ feminin → der." },
      { id: "rl-4", type: "mcq", prompt: "Die Leute, ___ ich vertraue, sind ehrlich.", options: ["die", "denen", "deren"], answerIndex: 1, explanation: "vertrauen + Dativ, Plural → denen." },
      { id: "rl-5", type: "mcq", prompt: "Der Autor, ___ Buch ich lese, kommt aus Zürich.", options: ["dessen", "deren", "das"], answerIndex: 0, explanation: "Genitiv maskulin → dessen." },
    ],
  },
  {
    slug: "b2-nvv-match", levelCode: "B2", title: "Nomen-Verb-Verbindungen", skill: "VOCABULARY", type: "MATCHING",
    instructions: "Welches Verb gehört zum Nomen?", grammarTopicSlug: "nomen-verb-verbindungen",
    questions: [
      { id: "nv-1", type: "match", prompt: "Verbinde:", pairs: [
        { left: "eine Entscheidung", right: "treffen" },
        { left: "eine Frage", right: "stellen" },
        { left: "eine Rolle", right: "spielen" },
        { left: "Maßnahmen", right: "ergreifen" },
      ], explanation: "Fixed pairings — memorize as chunks." },
      { id: "nv-2", type: "match", prompt: "Und diese:", pairs: [
        { left: "zur Verfügung", right: "stehen" },
        { left: "Kritik", right: "üben" },
        { left: "Rücksicht", right: "nehmen" },
        { left: "einen Beitrag", right: "leisten" },
      ], explanation: "All B2/C1 exam favorites." },
    ],
  },
  // ── B2 lesson exercises ──
  {
    slug: "b2-vortrag-match", levelCode: "B2", title: "Vortrags-Phrasen", skill: "VOCABULARY", type: "MATCHING",
    instructions: "Ordne die Signalphrase der Phase zu.",
    questions: [
      { id: "vt-1", type: "match", prompt: "Phase → Phrase", pairs: [
        { left: "Einstieg", right: "Heute möchte ich über … sprechen." },
        { left: "Übergang", right: "Kommen wir nun zum nächsten Punkt." },
        { left: "Beispiel", right: "Ein gutes Beispiel dafür ist …" },
        { left: "Schluss", right: "Zusammenfassend lässt sich sagen, dass …" },
      ] },
      { id: "vt-2", type: "match", prompt: "Auf Fragen reagieren:", pairs: [
        { left: "Frage nicht verstanden", right: "Könnten Sie die Frage bitte wiederholen?" },
        { left: "Zeit gewinnen", right: "Das ist eine gute Frage …" },
        { left: "Keine sichere Antwort", right: "Das kann ich nicht genau sagen, aber ich vermute …" },
        { left: "Zustimmung", right: "Da haben Sie völlig recht." },
      ] },
    ],
  },
  {
    slug: "b2-bewerbung-gap", levelCode: "B2", title: "Bewerbungs-Deutsch", skill: "VOCABULARY", type: "GAP_FILL",
    instructions: "Vervollständige die Bewerbungssätze.",
    questions: [
      { id: "bw-1", type: "gap", prompt: "Mit großem Interesse habe ich Ihre ___ gelesen.", answers: ["Stellenanzeige", "Ausschreibung", "Anzeige"], explanation: "Stellenanzeige/Ausschreibung = job posting." },
      { id: "bw-2", type: "gap", prompt: "In meiner letzten Position habe ich viel Verantwortung ___.", answers: ["übernommen"], explanation: "Verantwortung übernehmen — Partizip: übernommen." },
      { id: "bw-3", type: "gap", prompt: "Für Rückfragen stehe ich Ihnen gern zur ___.", answers: ["Verfügung"], explanation: "zur Verfügung stehen — the classic closing." },
      { id: "bw-4", type: "gap", prompt: "Über die Einladung zu einem persönlichen ___ freue ich mich sehr.", answers: ["Gespräch"], explanation: "das persönliche Gespräch = the interview." },
      { id: "bw-5", type: "gap", prompt: "Meine ___ entnehmen Sie bitte dem beigefügten Lebenslauf. (skills/qualifications)", answers: ["Qualifikationen", "Fähigkeiten", "Kenntnisse"], explanation: "All three work — professional application vocabulary." },
    ],
  },
  {
    slug: "b2-test-mix", levelCode: "B2", title: "B2-Test: Mix", skill: "GRAMMAR", type: "MCQ",
    instructions: "Das große Finale.", xpReward: 20,
    questions: [
      { id: "b2t-1", type: "mcq", prompt: "Der Vertrag muss bis Freitag unterschrieben ___.", options: ["worden", "werden", "wurde"], answerIndex: 1, explanation: "Modal passive: muss + P2 + werden." },
      { id: "b2t-2", type: "mcq", prompt: "Wenn ich mehr Zeit ___, würde ich ein Buch schreiben.", options: ["hätte", "habe", "hatte"], answerIndex: 0, explanation: "Irreale Bedingung → hätte." },
      { id: "b2t-3", type: "mcq", prompt: "Das Projekt, an ___ wir arbeiten, ist fast fertig.", options: ["das", "dem", "den"], answerIndex: 1, explanation: "an + Dativ (wo/woran) → dem." },
      { id: "b2t-4", type: "mcq", prompt: "Bei der Planung müssen alle Faktoren ___ werden.", options: ["berücksichtigt", "berücksichtigen", "berücksichtigte"], answerIndex: 0, explanation: "Passive: Partizip II berücksichtigt." },
      { id: "b2t-5", type: "mcq", prompt: "Es stimmt ___, dass es teuer ist, aber die Qualität überzeugt.", options: ["zwar", "doch", "noch"], answerIndex: 0, explanation: "zwar … aber — concede and counter." },
      { id: "b2t-6", type: "mcq", prompt: "Der Preis spielt eine große ___.", options: ["Bedeutung", "Rolle", "Wichtigkeit"], answerIndex: 1, explanation: "eine Rolle spielen — fixed pairing." },
    ],
  },
];
