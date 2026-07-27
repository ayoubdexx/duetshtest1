import type { ExerciseSeed } from "./types";

/** A1 & A2 exercises (grammar-attached + lesson exercises) */
export const EXERCISES_A: ExerciseSeed[] = [
  // ── A1 grammar ──
  {
    slug: "a1-sein-haben-gap", levelCode: "A1", title: "sein oder haben?", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Setze die richtige Form von sein oder haben ein.", grammarTopicSlug: "personalpronomen-sein-haben",
    questions: [
      { id: "shg-1", type: "gap", prompt: "Ich ___ müde.", answers: ["bin"], explanation: "Feelings and states use sein: ich bin." },
      { id: "shg-2", type: "gap", prompt: "___ du Geschwister?", answers: ["Hast", "hast"], explanation: "Possession → haben: du hast." },
      { id: "shg-3", type: "gap", prompt: "Wir ___ aus Spanien.", answers: ["sind"], explanation: "Origin uses sein: wir sind." },
      { id: "shg-4", type: "gap", prompt: "Er ___ heute keine Zeit.", answers: ["hat"], explanation: "Zeit haben — er hat." },
      { id: "shg-5", type: "gap", prompt: "___ Sie Herr Schmidt?", answers: ["Sind", "sind"], explanation: "Formal Sie takes the plural form: Sind Sie…?" },
    ],
  },
  {
    slug: "a1-praesens-endungen", levelCode: "A1", title: "Präsens-Endungen", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Konjugiere das Verb in Klammern.", grammarTopicSlug: "praesens-regelmaessig",
    questions: [
      { id: "pe-1", type: "gap", prompt: "Ich ___ in Berlin. (wohnen)", answers: ["wohne"], explanation: "ich → stem + e." },
      { id: "pe-2", type: "gap", prompt: "___ du Fußball? (spielen)", answers: ["Spielst", "spielst"], explanation: "du → stem + st." },
      { id: "pe-3", type: "gap", prompt: "Sie ___ als Ärztin. (arbeiten)", answers: ["arbeitet"], explanation: "Stem ends in -t → extra e: arbeit-e-t." },
      { id: "pe-4", type: "gap", prompt: "Wir ___ Deutsch. (lernen)", answers: ["lernen"], explanation: "wir → full infinitive form." },
      { id: "pe-5", type: "gap", prompt: "Heute ___ er nicht. (kommen)", answers: ["kommt"], explanation: "er → stem + t. Verb stays in position 2 after 'Heute'." },
    ],
  },
  {
    slug: "a1-artikel-match", levelCode: "A1", title: "der, die oder das?", skill: "GRAMMAR", type: "MATCHING",
    instructions: "Ordne jedem Nomen den richtigen Artikel zu.", grammarTopicSlug: "artikel-genus",
    questions: [
      { id: "am-1", type: "match", prompt: "Nomen → Artikel (denk an die Endungs-Signale!)", pairs: [
        { left: "Wohnung", right: "die (Endung -ung)" },
        { left: "Mädchen", right: "das (Endung -chen)" },
        { left: "Lehrer", right: "der (Person auf -er)" },
        { left: "Nation", right: "die (Endung -ion)" },
      ], explanation: "-ung/-ion → die, -chen → das, male persons on -er → der." },
      { id: "am-2", type: "match", prompt: "Und diese Klassiker? (auswendig lernen!)", pairs: [
        { left: "Buch", right: "das" },
        { left: "Tisch", right: "der" },
        { left: "Lampe", right: "die" },
        { left: "Auto", right: "das" },
      ], explanation: "No signal endings here — these you simply memorize with the noun." },
    ],
  },
  {
    slug: "a1-akkusativ-gap", levelCode: "A1", title: "Akkusativ-Training", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Setze den richtigen Artikel im Akkusativ ein.", grammarTopicSlug: "nominativ-akkusativ",
    questions: [
      { id: "ak-1", type: "gap", prompt: "Ich habe ___ Bruder. (ein/der Bruder)", answers: ["einen"], explanation: "Masculine object → einen." },
      { id: "ak-2", type: "gap", prompt: "Er kauft ___ Computer. (der)", answers: ["den"], explanation: "der → den in the Akkusativ." },
      { id: "ak-3", type: "gap", prompt: "Wir trinken ___ Cola. (eine)", answers: ["eine"], explanation: "Feminine doesn't change: eine." },
      { id: "ak-4", type: "gap", prompt: "Siehst du ___ Auto? (das)", answers: ["das"], explanation: "Neuter doesn't change: das." },
      { id: "ak-5", type: "gap", prompt: "Es gibt ___ Park in der Nähe. (ein/der Park)", answers: ["einen"], explanation: "es gibt always takes Akkusativ → einen Park." },
    ],
  },
  {
    slug: "a1-fragen-ordnen", levelCode: "A1", title: "Fragen bauen", skill: "GRAMMAR", type: "ORDERING",
    instructions: "Bringe die Wörter in die richtige Reihenfolge.", grammarTopicSlug: "fragen-stellen",
    questions: [
      { id: "fo-1", type: "order", prompt: "Baue eine W-Frage:", fragments: ["Woher", "kommst", "du?"], explanation: "W-Wort + Verb + Subjekt." },
      { id: "fo-2", type: "order", prompt: "Baue eine Ja/Nein-Frage:", fragments: ["Hast", "du", "heute", "Zeit?"], explanation: "Ja/Nein-Frage: verb first." },
      { id: "fo-3", type: "order", prompt: "Baue eine W-Frage:", fragments: ["Wie", "viel", "kostet", "das", "Brot?"], explanation: "Wie viel + Verb + Subjekt." },
      { id: "fo-4", type: "order", prompt: "Baue eine formelle Frage:", fragments: ["Sprechen", "Sie", "Englisch?"], explanation: "Formal question: Verb + Sie." },
    ],
  },
  {
    slug: "a1-negation-mcq", levelCode: "A1", title: "nicht oder kein?", skill: "GRAMMAR", type: "MCQ",
    instructions: "Wähle die richtige Negation.", grammarTopicSlug: "negation-nicht-kein",
    questions: [
      { id: "ng-1", type: "mcq", prompt: "Ich habe ___ Auto.", options: ["nicht", "kein", "keine"], answerIndex: 1, explanation: "das Auto (neuter noun with ein) → kein." },
      { id: "ng-2", type: "mcq", prompt: "Das Hotel ist ___ teuer.", options: ["kein", "keine", "nicht"], answerIndex: 2, explanation: "Adjectives are negated with nicht." },
      { id: "ng-3", type: "mcq", prompt: "Er trinkt ___ Kaffee.", options: ["keinen", "nicht", "kein"], answerIndex: 0, explanation: "der Kaffee, Akkusativ → keinen." },
      { id: "ng-4", type: "mcq", prompt: "Ich verstehe das ___.", options: ["kein", "nicht", "keine"], answerIndex: 1, explanation: "Negating the verb → nicht at the end." },
      { id: "ng-5", type: "mcq", prompt: "Wir haben ___ Zeit.", options: ["nicht", "keinen", "keine"], answerIndex: 2, explanation: "die Zeit → keine." },
    ],
  },
  // ── A1 lesson exercises ──
  {
    slug: "a1-hallo-mcq", levelCode: "A1", title: "Begrüßung: Was passt?", skill: "VOCABULARY", type: "MCQ",
    instructions: "Wähle die passende Antwort.",
    questions: [
      { id: "hm-1", type: "mcq", prompt: "Es ist 9 Uhr morgens. Du kommst ins Büro:", options: ["Gute Nacht!", "Guten Morgen!", "Auf Wiedersehen!"], answerIndex: 1, explanation: "Morning greeting: Guten Morgen." },
      { id: "hm-2", type: "mcq", prompt: "„Ich bin Anna. Und wer bist du?\" — ", options: ["Ich bin Tom.", "Tschüss!", "Danke schön."], answerIndex: 0, explanation: "Introduce yourself back: Ich bin…" },
      { id: "hm-3", type: "mcq", prompt: "Beim Bäcker (formell!). Du gehst:", options: ["Tschüss!", "Hi!", "Auf Wiedersehen!"], answerIndex: 2, explanation: "Formal goodbye in a shop: Auf Wiedersehen." },
      { id: "hm-4", type: "mcq", prompt: "„Woher kommst du?\" — ", options: ["Ich wohne gern hier.", "Ich komme aus Brasilien.", "Ich bin 30."], answerIndex: 1, explanation: "woher → origin: Ich komme aus…" },
    ],
  },
  {
    slug: "a1-laender-gap", levelCode: "A1", title: "Länder & Sprachen", skill: "VOCABULARY", type: "GAP_FILL",
    instructions: "Ergänze das richtige Wort.",
    questions: [
      { id: "lg-1", type: "gap", prompt: "Ich komme ___ Marokko.", answers: ["aus"], explanation: "Origin: aus + Land." },
      { id: "lg-2", type: "gap", prompt: "In Frankreich spricht man ___.", answers: ["Französisch", "französisch"], explanation: "France → Französisch." },
      { id: "lg-3", type: "gap", prompt: "Sie kommt aus ___ Türkei.", answers: ["der"], explanation: "die Türkei takes an article: aus DER Türkei." },
      { id: "lg-4", type: "gap", prompt: "Du ___ sehr gut Deutsch! (sprechen)", answers: ["sprichst"], explanation: "sprechen changes: du sprichst." },
    ],
  },
  {
    slug: "a1-zahlen-match", levelCode: "A1", title: "Zahlen verstehen", skill: "VOCABULARY", type: "MATCHING",
    instructions: "Ordne die Zahlen zu — Vorsicht, Deutsch zählt rückwärts!",
    questions: [
      { id: "zm-1", type: "match", prompt: "Zahl → Wort", pairs: [
        { left: "21", right: "einundzwanzig" },
        { left: "12", right: "zwölf" },
        { left: "45", right: "fünfundvierzig" },
        { left: "54", right: "vierundfünfzig" },
      ], explanation: "Units first! 45 = fünf-und-vierzig, 54 = vier-und-fünfzig." },
      { id: "zm-2", type: "match", prompt: "Und diese?", pairs: [
        { left: "17", right: "siebzehn" },
        { left: "70", right: "siebzig" },
        { left: "16", right: "sechzehn" },
        { left: "66", right: "sechsundsechzig" },
      ], explanation: "siebzehn/siebzig lose the -en of sieben; sechzehn loses the s." },
    ],
  },
  {
    slug: "a1-familie-match", levelCode: "A1", title: "Familien-Wörter", skill: "VOCABULARY", type: "MATCHING",
    instructions: "Ordne zu.",
    questions: [
      { id: "fm-1", type: "match", prompt: "Deutsch → Englisch", pairs: [
        { left: "die Geschwister", right: "siblings" },
        { left: "die Eltern", right: "parents" },
        { left: "die Tochter", right: "daughter" },
        { left: "der Neffe", right: "nephew" },
      ] },
      { id: "fm-2", type: "match", prompt: "Wer ist das? ", pairs: [
        { left: "der Bruder von meiner Mutter", right: "mein Onkel" },
        { left: "die Mutter von meinem Vater", right: "meine Großmutter" },
        { left: "die Tochter von meiner Schwester", right: "meine Nichte" },
        { left: "der Sohn von meinen Eltern", right: "mein Bruder" },
      ], explanation: "Family logic puzzles — great article practice too." },
    ],
  },
  {
    slug: "a1-cafe-ordnen", levelCode: "A1", title: "Im Café bestellen", skill: "VOCABULARY", type: "ORDERING",
    instructions: "Baue die Sätze aus dem Café-Dialog.",
    questions: [
      { id: "co-1", type: "order", prompt: "Höflich bestellen:", fragments: ["Ich", "hätte", "gern", "einen", "Cappuccino."], explanation: "The polite ordering formula." },
      { id: "co-2", type: "order", prompt: "Nach der Rechnung fragen:", fragments: ["Wir", "möchten", "bitte", "zahlen."], explanation: "möchten + Infinitiv am Ende." },
      { id: "co-3", type: "order", prompt: "Der Kellner sagt:", fragments: ["Das", "macht", "sieben", "Euro", "achtzig."], explanation: "Prices: Das macht … Euro …" },
    ],
  },
  {
    slug: "a1-uhrzeit-mcq", levelCode: "A1", title: "Wie spät ist es?", skill: "VOCABULARY", type: "MCQ",
    instructions: "Wähle die richtige Uhrzeit.",
    questions: [
      { id: "uz-1", type: "mcq", prompt: "„halb sieben\" = ?", options: ["7:30", "6:30", "7:15"], answerIndex: 1, explanation: "halb looks FORWARD: halfway to seven = 6:30." },
      { id: "uz-2", type: "mcq", prompt: "„Viertel nach drei\" = ?", options: ["3:15", "2:45", "3:45"], answerIndex: 0, explanation: "Viertel nach = quarter past." },
      { id: "uz-3", type: "mcq", prompt: "„Viertel vor acht\" = ?", options: ["8:15", "7:45", "8:45"], answerIndex: 1, explanation: "Viertel vor = quarter to." },
      { id: "uz-4", type: "mcq", prompt: "Der Zug fährt um 19 Uhr. Das ist …", options: ["7 Uhr morgens", "9 Uhr abends", "7 Uhr abends"], answerIndex: 2, explanation: "19:00 = 7 pm — official time uses the 24h clock." },
    ],
  },
  {
    slug: "a1-wohnung-match", levelCode: "A1", title: "Wohnung & Möbel", skill: "VOCABULARY", type: "MATCHING",
    instructions: "Was gehört wohin?",
    questions: [
      { id: "wm-1", type: "match", prompt: "Möbel → Zimmer (typisch)", pairs: [
        { left: "das Bett", right: "das Schlafzimmer" },
        { left: "der Kühlschrank", right: "die Küche" },
        { left: "das Sofa", right: "das Wohnzimmer" },
        { left: "die Dusche", right: "das Badezimmer" },
      ] },
      { id: "wm-2", type: "match", prompt: "Anzeigen-Deutsch → Bedeutung", pairs: [
        { left: "2 ZKB", right: "2 Zimmer, Küche, Bad" },
        { left: "WG", right: "Wohngemeinschaft" },
        { left: "KM", right: "Kaltmiete" },
        { left: "EG", right: "Erdgeschoss" },
      ], explanation: "Housing-ad abbreviations — essential for apartment hunting." },
    ],
  },
  {
    slug: "a1-test-grammatik", levelCode: "A1", title: "A1-Test: Grammatik-Mix", skill: "GRAMMAR", type: "MCQ",
    instructions: "Alles aus A1 — ohne Notizen!", xpReward: 20,
    questions: [
      { id: "tg-1", type: "mcq", prompt: "___ ihr heute Abend Zeit?", options: ["Habt", "Hat", "Haben"], answerIndex: 0, explanation: "ihr → habt." },
      { id: "tg-2", type: "mcq", prompt: "Er kauft ___ Apfel und eine Banane.", options: ["ein", "einen", "der"], answerIndex: 1, explanation: "der Apfel as object → einen." },
      { id: "tg-3", type: "mcq", prompt: "Morgen ___ ich nicht.", options: ["arbeite", "arbeitest", "arbeiten"], answerIndex: 0, explanation: "Verb position 2, ich-form: arbeite." },
      { id: "tg-4", type: "mcq", prompt: "Ich trinke ___ Alkohol.", options: ["nicht", "kein", "keinen"], answerIndex: 2, explanation: "der Alkohol, Akkusativ → keinen." },
      { id: "tg-5", type: "mcq", prompt: "___ wohnen Sie? — In Hamburg.", options: ["Woher", "Wo", "Wohin"], answerIndex: 1, explanation: "Location → wo. (woher = origin, wohin = direction)" },
      { id: "tg-6", type: "mcq", prompt: "Das ist ___ Schwester.", options: ["mein", "meine", "meinen"], answerIndex: 1, explanation: "die Schwester → meine." },
    ],
  },
  {
    slug: "a1-test-alltag", levelCode: "A1", title: "A1-Test: Alltagssituationen", skill: "VOCABULARY", type: "GAP_FILL",
    instructions: "Ergänze das passende Wort.", xpReward: 20,
    questions: [
      { id: "ta-1", type: "gap", prompt: "Im Café: „Ich hätte ___ einen Tee, bitte.\"", answers: ["gern", "gerne"], explanation: "Ich hätte gern … — the polite order." },
      { id: "ta-2", type: "gap", prompt: "„Zusammen oder ___?\" — „Getrennt, bitte.\"", answers: ["getrennt"], explanation: "The classic bill question." },
      { id: "ta-3", type: "gap", prompt: "Ich stehe um halb sieben ___. (aufstehen)", answers: ["auf"], explanation: "Separable verb: the prefix goes to the end." },
      { id: "ta-4", type: "gap", prompt: "„Was ___ das?\" — „Drei Euro fünfzig.\"", answers: ["kostet"], explanation: "Asking the price: Was kostet das?" },
      { id: "ta-5", type: "gap", prompt: "Entschuldigung, wo ___ ich die Milch?", answers: ["finde"], explanation: "Wo finde ich …? — the supermarket question." },
    ],
  },
  // ── A2 grammar ──
  {
    slug: "a2-perfekt-gap", levelCode: "A2", title: "Perfekt bilden", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Setze das Hilfsverb oder Partizip II ein.", grammarTopicSlug: "perfekt",
    questions: [
      { id: "pf-1", type: "gap", prompt: "Ich ___ gestern Pizza gegessen.", answers: ["habe"], explanation: "essen takes haben (Akkusativ object)." },
      { id: "pf-2", type: "gap", prompt: "Wir ___ nach Hamburg gefahren.", answers: ["sind"], explanation: "Movement A→B → sein." },
      { id: "pf-3", type: "gap", prompt: "Er hat den Film schon ___. (sehen)", answers: ["gesehen"], explanation: "Irregular: sehen → gesehen." },
      { id: "pf-4", type: "gap", prompt: "Sie ist um sechs Uhr ___. (aufstehen)", answers: ["aufgestanden"], explanation: "Separable + state change: auf-ge-standen, with sein." },
      { id: "pf-5", type: "gap", prompt: "Hast du schon ___? (bezahlen)", answers: ["bezahlt"], explanation: "be- prefix: no ge- → bezahlt." },
    ],
  },
  {
    slug: "a2-dativ-gap", levelCode: "A2", title: "Dativ nach Präpositionen", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Setze den richtigen Dativ-Artikel ein.", grammarTopicSlug: "dativ",
    questions: [
      { id: "dt-1", type: "gap", prompt: "Ich fahre mit ___ Bus. (der)", answers: ["dem"], explanation: "mit + Dativ: der → dem." },
      { id: "dt-2", type: "gap", prompt: "Sie wohnt bei ___ Freundin. (eine)", answers: ["einer"], explanation: "bei + Dativ: eine → einer." },
      { id: "dt-3", type: "gap", prompt: "Nach ___ Arbeit gehe ich einkaufen. (die)", answers: ["der"], explanation: "nach + Dativ: die → der." },
      { id: "dt-4", type: "gap", prompt: "Kannst du ___ helfen? (ich)", answers: ["mir"], explanation: "helfen + Dativ: mir." },
      { id: "dt-5", type: "gap", prompt: "Wir spielen mit ___ Kindern. (die, Plural)", answers: ["den"], explanation: "Plural Dativ: den Kindern (+n on the noun!)." },
    ],
  },
  {
    slug: "a2-modalverben-mcq", levelCode: "A2", title: "Modalverben wählen", skill: "GRAMMAR", type: "MCQ",
    instructions: "Welches Modalverb passt?", grammarTopicSlug: "modalverben",
    questions: [
      { id: "mv-1", type: "mcq", prompt: "Hier ___ man nicht rauchen. (Verbot)", options: ["muss", "darf", "will"], answerIndex: 1, explanation: "Prohibition = nicht dürfen." },
      { id: "mv-2", type: "mcq", prompt: "Ich ___ sehr gut schwimmen. (Fähigkeit)", options: ["kann", "soll", "darf"], answerIndex: 0, explanation: "Ability = können." },
      { id: "mv-3", type: "mcq", prompt: "Der Arzt sagt, ich ___ mehr schlafen. (Rat)", options: ["will", "kann", "soll"], answerIndex: 2, explanation: "Advice from someone else = sollen." },
      { id: "mv-4", type: "mcq", prompt: "___ du mir bitte helfen? (höflich)", options: ["Kannst", "Musst", "Willst"], answerIndex: 0, explanation: "Polite request: Kannst du…? (even better: Könntest du…?)" },
      { id: "mv-5", type: "mcq", prompt: "Morgen ___ ich früh aufstehen — der Zug fährt um 6! (Notwendigkeit)", options: ["darf", "muss", "möchte"], answerIndex: 1, explanation: "Necessity = müssen." },
    ],
  },
  {
    slug: "a2-trennbare-ordnen", levelCode: "A2", title: "Trennbare Verben im Satz", skill: "GRAMMAR", type: "ORDERING",
    instructions: "Baue korrekte Sätze — wohin geht das Präfix?", grammarTopicSlug: "trennbare-verben",
    questions: [
      { id: "tv-1", type: "order", prompt: "aufstehen:", fragments: ["Ich", "stehe", "um", "sieben", "Uhr", "auf."], explanation: "Prefix at the end: … auf." },
      { id: "tv-2", type: "order", prompt: "anrufen:", fragments: ["Er", "ruft", "seine", "Mutter", "an."], explanation: "ruft … an." },
      { id: "tv-3", type: "order", prompt: "Mit Modalverb (einkaufen):", fragments: ["Wir", "müssen", "heute", "noch", "einkaufen."], explanation: "With a modal, the infinitive stays whole at the end." },
      { id: "tv-4", type: "order", prompt: "Frage (mitkommen):", fragments: ["Kommst", "du", "heute", "Abend", "mit?"], explanation: "Question: verb first, prefix last." },
    ],
  },
  {
    slug: "a2-komparativ-gap", levelCode: "A2", title: "Vergleiche bilden", skill: "GRAMMAR", type: "GAP_FILL",
    instructions: "Setze die richtige Form ein.", grammarTopicSlug: "komparativ-superlativ",
    questions: [
      { id: "ko-1", type: "gap", prompt: "Der Zug ist ___ als der Bus. (schnell)", answers: ["schneller"], explanation: "Komparativ: schnell + er." },
      { id: "ko-2", type: "gap", prompt: "Ich trinke ___ Tee als Kaffee. (gern)", answers: ["lieber"], explanation: "gern → lieber (irregular)." },
      { id: "ko-3", type: "gap", prompt: "Mein Bruder ist ___ als ich. (alt)", answers: ["älter"], explanation: "alt → älter (umlaut!)." },
      { id: "ko-4", type: "gap", prompt: "Dieses Hotel ist am ___. (billig)", answers: ["billigsten"], explanation: "Superlativ: am billigsten." },
      { id: "ko-5", type: "gap", prompt: "Deutsch ist nicht so schwer ___ viele denken.", answers: ["wie"], explanation: "so … wie for equality." },
    ],
  },
  // ── A2 lesson exercises ──
  {
    slug: "a2-arzt-mcq", levelCode: "A2", title: "Beim Arzt: verstehen", skill: "VOCABULARY", type: "MCQ",
    instructions: "Was ist richtig?",
    questions: [
      { id: "az-1", type: "mcq", prompt: "„Was fehlt Ihnen denn?\" bedeutet:", options: ["What are you missing at home?", "What seems to be the problem?", "What did you forget?"], answerIndex: 1, explanation: "The standard doctor opening — 'what's wrong?'" },
      { id: "az-2", type: "mcq", prompt: "Du bist krank und kannst nicht arbeiten. Du brauchst:", options: ["ein Rezept", "eine Krankschreibung", "eine Versichertenkarte"], answerIndex: 1, explanation: "Krankschreibung (AU) = the sick note for your employer." },
      { id: "az-3", type: "mcq", prompt: "„Ich habe seit drei Tagen Husten\" — seit + ?", options: ["Akkusativ", "Dativ", "Nominativ"], answerIndex: 1, explanation: "seit always takes Dativ: seit drei Tagen." },
      { id: "az-4", type: "mcq", prompt: "Nicht lebensgefährlich krank am Sonntag. Du rufst an:", options: ["112", "110", "116 117"], answerIndex: 2, explanation: "116 117 = medical on-call service. 112 only for emergencies." },
    ],
  },
  {
    slug: "a2-termine-gap", levelCode: "A2", title: "Termin-Sätze", skill: "VOCABULARY", type: "GAP_FILL",
    instructions: "Ergänze die Termin-Redemittel.",
    questions: [
      { id: "tm-1", type: "gap", prompt: "Ich hätte gern einen ___ zum Haareschneiden.", answers: ["Termin"], explanation: "THE German word." },
      { id: "tm-2", type: "gap", prompt: "Passt es Ihnen ___ Donnerstag?", answers: ["am"], explanation: "Days take am: am Donnerstag." },
      { id: "tm-3", type: "gap", prompt: "Der Termin ist ___ 15 Uhr.", answers: ["um"], explanation: "Clock times take um." },
      { id: "tm-4", type: "gap", prompt: "Da kann ich leider ___. Geht es auch am Freitag?", answers: ["nicht"], explanation: "Da kann ich leider nicht — the polite decline." },
      { id: "tm-5", type: "gap", prompt: "Ich muss den Termin leider ___. Können wir einen neuen finden? (verschieben/absagen)", answers: ["verschieben", "absagen"], explanation: "verschieben = move, absagen = cancel. Both fit here." },
    ],
  },
  {
    slug: "a2-kleidung-match", levelCode: "A2", title: "Kleidung & Passen", skill: "VOCABULARY", type: "MATCHING",
    instructions: "Ordne zu.",
    questions: [
      { id: "kl-1", type: "match", prompt: "Kleidungsstück → Englisch", pairs: [
        { left: "die Hose", right: "trousers" },
        { left: "das Hemd", right: "shirt" },
        { left: "der Rock", right: "skirt" },
        { left: "die Jacke", right: "jacket" },
      ] },
      { id: "kl-2", type: "match", prompt: "Situation → Satz", pairs: [
        { left: "Es ist zu klein.", right: "Haben Sie es eine Nummer größer?" },
        { left: "Du willst es testen.", right: "Kann ich das anprobieren?" },
        { left: "Es steht dir gut.", right: "Die Jacke gefällt mir!" },
        { left: "Du kaufst es.", right: "Die nehme ich." },
      ], explanation: "The four key shopping moments." },
    ],
  },
  {
    slug: "a2-test-mix", levelCode: "A2", title: "A2-Test: Mix", skill: "GRAMMAR", type: "MCQ",
    instructions: "Der A2-Querschnitt — ohne Hilfe!", xpReward: 20,
    questions: [
      { id: "a2t-1", type: "mcq", prompt: "Gestern ___ wir ins Kino gegangen.", options: ["haben", "sind", "waren"], answerIndex: 1, explanation: "gehen → sein: wir sind gegangen." },
      { id: "a2t-2", type: "mcq", prompt: "Ich fahre immer ___ dem Fahrrad zur Arbeit.", options: ["mit", "bei", "zu"], answerIndex: 0, explanation: "Transport: mit + Dativ." },
      { id: "a2t-3", type: "mcq", prompt: "Der Film hat mir gut ___.", options: ["gefallen", "gefällt", "gefiel"], answerIndex: 0, explanation: "Perfekt: hat gefallen (Partizip II)." },
      { id: "a2t-4", type: "mcq", prompt: "Wann ___ der Zug ___? (abfahren)", options: ["fährt … ab", "abfährt …", "fährt … zu"], answerIndex: 0, explanation: "Separable: Wann fährt der Zug ab?" },
      { id: "a2t-5", type: "mcq", prompt: "Berlin ist ___ als München.", options: ["mehr groß", "größer", "am größten"], answerIndex: 1, explanation: "Comparative: größer als." },
      { id: "a2t-6", type: "mcq", prompt: "Kinder ___ hier nicht schwimmen. (Verbot)", options: ["dürfen", "müssen", "können"], answerIndex: 0, explanation: "nicht dürfen = not allowed." },
    ],
  },
];
