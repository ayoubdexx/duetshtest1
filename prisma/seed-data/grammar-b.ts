import type { GrammarSeed } from "./types";

export const GRAMMAR_B: GrammarSeed[] = [
  {
    slug: "praeteritum",
    levelCode: "B1",
    title: "Das Präteritum",
    category: "Verben & Zeiten",
    summary: "The written past tense — essential for reading, and for haben, sein and the modals even in speech.",
    blocks: [
      { type: "text", md: "The **Präteritum** is the past of books, news and reports. In conversation you mostly use Perfekt — **except** for *sein, haben* and the modal verbs, where everyone uses Präteritum: *Ich **war** müde und **hatte** keine Lust.*" },
      { type: "table", title: "Die Formen, die jeder spricht", headers: ["", "sein", "haben", "können", "müssen", "wollen"], rows: [["ich/er", "war", "hatte", "konnte", "musste", "wollte"], ["du", "warst", "hattest", "konntest", "musstest", "wolltest"], ["wir/sie", "waren", "hatten", "konnten", "mussten", "wollten"], ["ihr", "wart", "hattet", "konntet", "musstet", "wolltet"]] },
      { type: "table", title: "Regelmäßig vs. unregelmäßig", headers: ["Typ", "Muster", "Beispiel"], rows: [["regelmäßig", "Stamm + te", "machen → machte, lernen → lernte"], ["unregelmäßig", "neuer Stamm", "gehen → ging, kommen → kam, geben → gab"], ["Mischverben", "neuer Stamm + te", "bringen → brachte, denken → dachte, wissen → wusste"]] },
      { type: "examples", items: [
        { de: "Es war einmal eine Prinzessin …", en: "Once upon a time there was a princess…", note: "Fairy tales = pure Präteritum" },
        { de: "Ich hatte gestern keine Zeit.", en: "I had no time yesterday." },
        { de: "Er ging nach Hause und dachte an sie.", en: "He went home and thought about her." },
        { de: "Wir konnten leider nicht kommen.", en: "Unfortunately we couldn't come." },
      ] },
      { type: "mistakes", items: [
        { wrong: "Ich bin müde gewesen und habe keine Lust gehabt. (spoken)", right: "Ich war müde und hatte keine Lust.", why: "Correct but clumsy — sein/haben are always Präteritum in speech." },
        { wrong: "Er gehte nach Hause.", right: "Er ging nach Hause.", why: "gehen is irregular: ging. Strong verbs must be memorized." },
      ] },
      { type: "exercise", slug: "b1-praeteritum-gap" },
    ],
    cheatSheet: {
      title: "Präteritum-Strategie",
      points: ["Speech: Perfekt — ABER war/hatte/konnte/musste/wollte/durfte/sollte", "Writing & reading: Präteritum everywhere", "Regular: -te · Irregular: vowel change (ging, kam, gab)", "1st and 3rd person singular are identical: ich ging = er ging"],
    },
  },
  {
    slug: "nebensaetze-weil-dass-wenn",
    levelCode: "B1",
    title: "Nebensätze: weil, dass, wenn",
    category: "Satzbau",
    summary: "Subordinate clauses kick the verb to the end — the single most important B1 structure.",
    blocks: [
      { type: "text", md: "Conjunctions like **weil** (because), **dass** (that), **wenn** (when/if), **obwohl** (although) start a **Nebensatz** — and in a Nebensatz the conjugated verb moves to the **very end**:\n\n*Ich lerne Deutsch, **weil** ich in Deutschland arbeiten **will**.*" },
      { type: "table", title: "Die wichtigsten Subjunktionen", headers: ["Konjunktion", "Bedeutung", "Beispiel"], rows: [["weil", "because", "…, weil ich müde bin."], ["dass", "that", "Ich glaube, dass es regnet."], ["wenn", "if / when", "Wenn ich Zeit habe, koche ich."], ["obwohl", "although", "…, obwohl es teuer ist."], ["als", "when (single past event)", "Als ich Kind war, …"], ["ob", "whether", "Ich weiß nicht, ob er kommt."]] },
      { type: "callout", variant: "grammar", title: "Nebensatz zuerst? Verb-Verb-Kreuzung!", md: "If the Nebensatz comes first, the main clause starts directly with its verb — the two verbs meet at the comma:\n*Wenn ich Zeit **habe**, **koche** ich.*" },
      { type: "examples", items: [
        { de: "Ich bleibe zu Hause, weil ich krank bin.", en: "I'm staying home because I'm sick." },
        { de: "Er sagt, dass er morgen keine Zeit hat.", en: "He says that he has no time tomorrow." },
        { de: "Obwohl es regnet, fahren wir mit dem Rad.", en: "Although it's raining, we're going by bike." },
        { de: "Als ich in Berlin war, habe ich viel gesehen.", en: "When I was in Berlin, I saw a lot.", note: "single past event → als" },
      ] },
      { type: "mistakes", items: [
        { wrong: "…, weil ich bin krank.", right: "…, weil ich krank bin.", why: "In a weil-clause the verb goes to the END. (Spoken German sometimes breaks this — exams never forgive it.)" },
        { wrong: "Wenn ich war jung, …", right: "Als ich jung war, …", why: "Single period in the past → als, not wenn. And verb at the end!" },
      ] },
      { type: "exercise", slug: "b1-nebensaetze-ordnen" },
    ],
    cheatSheet: {
      title: "Nebensatz-Regeln",
      points: ["weil/dass/wenn/obwohl/als/ob → Verb ans Ende", "Comma before every Nebensatz — no exceptions", "Nebensatz first → main clause starts with the verb", "als = once in the past · wenn = whenever / if"],
    },
  },
  {
    slug: "wechselpraepositionen",
    levelCode: "B1",
    title: "Wechselpräpositionen",
    category: "Kasus",
    summary: "in, auf, an, über … — Akkusativ for movement (wohin?), Dativ for location (wo?).",
    blocks: [
      { type: "text", md: "Nine prepositions can take **Akkusativ OR Dativ**: *an, auf, hinter, in, neben, über, unter, vor, zwischen*. The question decides:\n\n- **Wohin?** (direction, movement to) → **Akkusativ**\n- **Wo?** (fixed location) → **Dativ**" },
      { type: "examples", title: "Das berühmte Paar", items: [
        { de: "Ich gehe in die Küche.", en: "I go into the kitchen.", note: "Wohin? → Akkusativ" },
        { de: "Ich bin in der Küche.", en: "I am in the kitchen.", note: "Wo? → Dativ" },
        { de: "Er hängt das Bild an die Wand.", en: "He hangs the picture on the wall.", note: "Wohin? → Akk." },
        { de: "Das Bild hängt an der Wand.", en: "The picture hangs on the wall.", note: "Wo? → Dativ" },
      ] },
      { type: "table", title: "Typische Verb-Paare", headers: ["Bewegung (Akk.)", "Position (Dativ)"], rows: [["legen (to lay)", "liegen (to lie)"], ["stellen (to place upright)", "stehen (to stand)"], ["setzen (to set)", "sitzen (to sit)"], ["hängen (to hang up)", "hängen (to be hanging)"]] },
      { type: "callout", variant: "tip", title: "Kurzformen", md: "in das = **ins**, in dem = **im**, an das = **ans**, an dem = **am**, auf das = **aufs** — *Ich gehe **ins** Kino. Ich bin **im** Kino.*" },
      { type: "mistakes", items: [
        { wrong: "Ich gehe im Kino.", right: "Ich gehe ins Kino.", why: "Movement (wohin?) needs Akkusativ: in das → ins." },
        { wrong: "Das Buch liegt auf den Tisch.", right: "Das Buch liegt auf dem Tisch.", why: "liegen = position (wo?) → Dativ." },
      ] },
      { type: "exercise", slug: "b1-wechselpraep-mcq" },
    ],
    cheatSheet: {
      title: "Wohin? Wo?",
      points: ["an, auf, hinter, in, neben, über, unter, vor, zwischen", "Wohin? (movement) → Akkusativ", "Wo? (location) → Dativ", "legen/stellen/setzen → Akk · liegen/stehen/sitzen → Dativ"],
    },
  },
  {
    slug: "adjektivdeklination",
    levelCode: "B1",
    title: "Adjektivdeklination",
    category: "Adjektive",
    summary: "Adjective endings before nouns — the system behind 'der große Mann' and 'ein großer Mann'.",
    blocks: [
      { type: "text", md: "An adjective **before a noun** needs an ending. The logic: someone has to show the gender signal (der/die/das). If the article shows it, the adjective relaxes (-e/-en); if not, the adjective does the job." },
      { type: "table", title: "Nach bestimmtem Artikel (der/die/das)", headers: ["", "maskulin", "feminin", "neutral", "Plural"], rows: [["Nominativ", "der gute Mann", "die gute Frau", "das gute Kind", "die guten Leute"], ["Akkusativ", "den guten Mann", "die gute Frau", "das gute Kind", "die guten Leute"], ["Dativ", "dem guten Mann", "der guten Frau", "dem guten Kind", "den guten Leuten"]], caption: "Merke: only 5 forms are '-e', ALL the rest are '-en'." },
      { type: "table", title: "Nach ein/kein/mein", headers: ["", "maskulin", "feminin", "neutral"], rows: [["Nominativ", "ein guter Mann", "eine gute Frau", "ein gutes Kind"], ["Akkusativ", "einen guten Mann", "eine gute Frau", "ein gutes Kind"], ["Dativ", "einem guten Mann", "einer guten Frau", "einem guten Kind"]], caption: "ein shows no gender in Nom. mask./neut. — so the adjective shows it: gutER, gutES." },
      { type: "callout", variant: "tip", title: "Die 80%-Regel", md: "When unsure: **-en** is right most of the time (all Dativ, all Plural after Artikel, all Akkusativ maskulin). Master the few -e/-er/-es cases, default to -en elsewhere." },
      { type: "examples", items: [
        { de: "Ich trinke einen heißen Kaffee.", en: "I'm drinking a hot coffee." },
        { de: "Das ist eine sehr gute Idee!", en: "That's a very good idea!" },
        { de: "Bei schlechtem Wetter bleiben wir zu Hause.", en: "In bad weather we stay home.", note: "no article → adjective carries the Dativ -em" },
      ] },
      { type: "mistakes", items: [
        { wrong: "ein interessante Buch", right: "ein interessantes Buch", why: "das-signal missing after ein → adjective takes -es." },
        { wrong: "mit meinem alte Auto", right: "mit meinem alten Auto", why: "Dativ → always -en." },
      ] },
      { type: "exercise", slug: "b1-adjektive-gap" },
    ],
    cheatSheet: {
      title: "Endungen-Spickzettel",
      points: ["Someone must show gender: article OR adjective", "After der/die/das: only -e or -en", "After ein (Nom.): guter Mann, gute Frau, gutes Kind", "Dativ & Plural (with article): always -en"],
    },
  },
  {
    slug: "reflexive-verben",
    levelCode: "B1",
    title: "Reflexive Verben",
    category: "Verben & Konjugation",
    summary: "sich freuen, sich interessieren, sich anmelden — verbs that point back at yourself.",
    blocks: [
      { type: "text", md: "Reflexive verbs act on the subject itself: *Ich wasche **mich**.* Many everyday verbs are reflexive in German even when English isn't: *sich freuen* (to be happy), *sich erinnern* (to remember), *sich anmelden* (to register)." },
      { type: "table", title: "Reflexivpronomen", headers: ["Person", "Akkusativ", "Dativ"], rows: [["ich", "mich", "mir"], ["du", "dich", "dir"], ["er/sie/es", "sich", "sich"], ["wir", "uns", "uns"], ["ihr", "euch", "euch"], ["sie/Sie", "sich", "sich"]], caption: "Only ich and du differ between Akkusativ and Dativ!" },
      { type: "callout", variant: "grammar", title: "Akkusativ oder Dativ?", md: "Default: **Akkusativ** (*Ich freue mich.*). But if there's ANOTHER object, the reflexive switches to **Dativ**: *Ich wasche **mir** die Hände.* (die Hände = Akkusativ object)" },
      { type: "examples", items: [
        { de: "Ich freue mich auf das Wochenende.", en: "I'm looking forward to the weekend.", note: "sich freuen AUF + Akk = look forward to" },
        { de: "Er interessiert sich für Geschichte.", en: "He's interested in history." },
        { de: "Wir treffen uns um acht.", en: "We're meeting at eight." },
        { de: "Ich putze mir die Zähne.", en: "I brush my teeth.", note: "second object → mir" },
      ] },
      { type: "mistakes", items: [
        { wrong: "Ich erinnere das.", right: "Ich erinnere mich daran.", why: "erinnern is reflexive: sich erinnern an + Akk." },
        { wrong: "Ich wasche mich die Hände.", right: "Ich wasche mir die Hände.", why: "With a direct object (die Hände), the reflexive becomes Dativ." },
      ] },
      { type: "exercise", slug: "b1-reflexiv-mcq" },
    ],
    cheatSheet: {
      title: "Reflexiv-Regeln",
      points: ["mich/dich/sich/uns/euch/sich (Akk.)", "Extra object? → mir/dir (Dativ): Ich wasche mir die Hände", "sich freuen auf = future · sich freuen über = now", "Learn verb + preposition + case as ONE unit"],
    },
  },
  {
    slug: "passiv",
    levelCode: "B2",
    title: "Das Passiv",
    category: "Verben & Zeiten",
    summary: "werden + Partizip II — when the action matters more than who does it.",
    blocks: [
      { type: "text", md: "The passive shifts focus from the doer to the action: *Das Haus **wird renoviert**.* (The house is being renovated.) Formula: **werden** (conjugated) + **Partizip II** (end). The doer, if mentioned at all, appears with **von** + Dativ." },
      { type: "table", title: "Passiv durch die Zeiten", headers: ["Zeit", "Form", "Beispiel"], rows: [["Präsens", "wird + P2", "Der Brief wird geschrieben."], ["Präteritum", "wurde + P2", "Der Brief wurde geschrieben."], ["Perfekt", "ist + P2 + worden", "Der Brief ist geschrieben worden."], ["mit Modalverb", "muss + P2 + werden", "Der Brief muss geschrieben werden."]] },
      { type: "callout", variant: "grammar", title: "Vorgang vs. Zustand", md: "- **Vorgangspassiv** (werden): the process — *Die Tür **wird** geschlossen.* (someone is closing it)\n- **Zustandspassiv** (sein): the result — *Die Tür **ist** geschlossen.* (it's simply closed)" },
      { type: "examples", items: [
        { de: "In Deutschland wird viel Brot gegessen.", en: "A lot of bread is eaten in Germany." },
        { de: "Das Formular muss ausgefüllt werden.", en: "The form must be filled out." },
        { de: "Die Rechnung wurde gestern bezahlt.", en: "The bill was paid yesterday." },
        { de: "Er wurde von einem Kollegen informiert.", en: "He was informed by a colleague.", note: "doer → von + Dativ" },
      ] },
      { type: "mistakes", items: [
        { wrong: "Das Haus ist 1990 gebaut. (process meant)", right: "Das Haus wurde 1990 gebaut.", why: "The building process in the past → wurde. 'ist gebaut' describes only the state." },
        { wrong: "Der Brief ist geschrieben geworden.", right: "Der Brief ist geschrieben worden.", why: "In the passive Perfekt, geworden loses its ge-: worden." },
      ] },
      { type: "exercise", slug: "b2-passiv-gap" },
    ],
    cheatSheet: {
      title: "Passiv-Formeln",
      points: ["Präsens: wird + Partizip II", "Präteritum: wurde + Partizip II", "Perfekt: ist + Partizip II + worden", "Modal: muss/kann + Partizip II + werden", "Doer: von + Dativ (often omitted)"],
    },
  },
  {
    slug: "konjunktiv-2",
    levelCode: "B2",
    title: "Konjunktiv II",
    category: "Verben & Zeiten",
    summary: "würde, hätte, wäre, könnte — polite requests, wishes and what-if worlds.",
    blocks: [
      { type: "text", md: "The Konjunktiv II expresses the unreal: wishes (*Ich **hätte** gern…*), politeness (*Könnten Sie…?*) and hypotheticals (*Wenn ich reich **wäre**…*). For most verbs use **würde + Infinitiv**; a handful have beautiful short forms everyone uses." },
      { type: "table", title: "Die wichtigen Kurzformen", headers: ["Verb", "Konjunktiv II", "Beispiel"], rows: [["sein", "wäre", "Das wäre schön!"], ["haben", "hätte", "Ich hätte gern einen Kaffee."], ["können", "könnte", "Könntest du mir helfen?"], ["müssen", "müsste", "Ich müsste mehr lernen."], ["dürfen", "dürfte", "Dürfte ich kurz stören?"], ["werden", "würde", "Ich würde das machen."]] },
      { type: "callout", variant: "tip", title: "Der Höflichkeits-Turbo", md: "Same request, three politeness levels:\n- *Hilf mir!* (command)\n- *Kannst du mir helfen?* (neutral)\n- ***Könntest** du mir vielleicht helfen?* (silky smooth) ✨" },
      { type: "examples", items: [
        { de: "Wenn ich mehr Zeit hätte, würde ich reisen.", en: "If I had more time, I would travel." },
        { de: "Ich hätte gern ein Wasser, bitte.", en: "I'd like a water, please.", note: "THE polite ordering formula" },
        { de: "An deiner Stelle würde ich den Job nehmen.", en: "In your place, I would take the job." },
        { de: "Wärst du morgen dabei?", en: "Would you join tomorrow?" },
      ] },
      { type: "mistakes", items: [
        { wrong: "Wenn ich würde reich sein, …", right: "Wenn ich reich wäre, …", why: "In wenn-clauses avoid würde with sein/haben/modals — use wäre/hätte/könnte." },
        { wrong: "Ich will einen Kaffee. (ordering)", right: "Ich hätte gern einen Kaffee.", why: "hätte gern is the standard polite way to order anything." },
      ] },
      { type: "exercise", slug: "b2-konjunktiv-gap" },
    ],
    cheatSheet: {
      title: "Konjunktiv II kompakt",
      points: ["Standard: würde + Infinitiv", "Short forms to master: wäre, hätte, könnte, müsste, dürfte, sollte, wüsste", "Politeness: Könnten Sie…? / Ich hätte gern…", "Irreale Bedingung: Wenn … hätte/wäre, würde …"],
    },
  },
  {
    slug: "relativsaetze",
    levelCode: "B2",
    title: "Relativsätze",
    category: "Satzbau",
    summary: "der, die, das as connectors — describing things elegantly instead of chopping sentences.",
    blocks: [
      { type: "text", md: "Relative clauses glue extra information onto a noun: *Der Mann, **der** dort steht, ist mein Chef.* The relative pronoun matches the noun's **gender/number**, but its **case comes from its role in the relative clause**." },
      { type: "table", title: "Relativpronomen", headers: ["", "maskulin", "feminin", "neutral", "Plural"], rows: [["Nominativ", "der", "die", "das", "die"], ["Akkusativ", "den", "die", "das", "die"], ["Dativ", "dem", "der", "dem", "denen ⚠️"], ["Genitiv", "dessen", "deren", "dessen", "deren"]] },
      { type: "examples", items: [
        { de: "Das ist der Kollege, der mir geholfen hat.", en: "That's the colleague who helped me.", note: "der = subject of the clause" },
        { de: "Der Film, den wir gesehen haben, war super.", en: "The film we saw was great.", note: "den = Akk. object" },
        { de: "Die Frau, mit der ich arbeite, kommt aus Wien.", en: "The woman I work with is from Vienna.", note: "preposition pulls its case" },
        { de: "Die Leute, denen ich schreibe, antworten schnell.", en: "The people I write to answer quickly.", note: "Dativ Plural: denen" },
      ] },
      { type: "callout", variant: "grammar", title: "Präposition? Sie zieht mit um!", md: "If the verb needs a preposition, it moves in front of the pronoun: *das Thema, **über das** wir sprechen* — never leave the preposition at the end like English does!" },
      { type: "mistakes", items: [
        { wrong: "Der Mann, wo dort steht, …", right: "Der Mann, der dort steht, …", why: "'wo' as relative pronoun is dialect — use der/die/das (wo only for places: die Stadt, wo…)." },
        { wrong: "die Freunde, den ich vertraue", right: "die Freunde, denen ich vertraue", why: "vertrauen takes Dativ; plural Dativ = denen." },
      ] },
      { type: "exercise", slug: "b2-relativ-mcq" },
    ],
    cheatSheet: {
      title: "Relativsatz-Rezept",
      points: ["Gender & number: from the noun before", "Case: from the role INSIDE the relative clause", "Verb → end of the relative clause", "Special forms: denen (Dat. Pl.), dessen/deren (Genitiv)"],
    },
  },
  {
    slug: "nomen-verb-verbindungen",
    levelCode: "B2",
    title: "Nomen-Verb-Verbindungen",
    category: "Wortschatz & Stil",
    summary: "eine Entscheidung treffen, zur Verfügung stehen — the fixed pairings that make your German sound professional.",
    blocks: [
      { type: "text", md: "Formal German loves noun-verb teams: instead of *entscheiden* you'll read *eine **Entscheidung treffen*** (to make a decision). Mastering the common ones instantly upgrades your writing — they're B2/C1 exam gold." },
      { type: "table", title: "Die nützlichsten Verbindungen", headers: ["Verbindung", "= einfaches Verb", "Bedeutung"], rows: [["eine Entscheidung treffen", "entscheiden", "to make a decision"], ["eine Frage stellen", "fragen", "to ask a question"], ["Kritik üben an", "kritisieren", "to criticize"], ["zur Verfügung stehen", "verfügbar sein", "to be available"], ["in Anspruch nehmen", "nutzen", "to make use of"], ["eine Rolle spielen", "wichtig sein", "to play a role"], ["Rücksicht nehmen auf", "berücksichtigen", "to be considerate of"], ["Maßnahmen ergreifen", "handeln", "to take measures"]] },
      { type: "examples", items: [
        { de: "Wir müssen heute eine Entscheidung treffen.", en: "We have to make a decision today." },
        { de: "Der Preis spielt dabei eine große Rolle.", en: "The price plays a big role in this." },
        { de: "Ich stehe Ihnen gern zur Verfügung.", en: "I'm happy to be at your disposal.", note: "Standard closing in business mails" },
        { de: "Die Regierung ergreift neue Maßnahmen.", en: "The government is taking new measures." },
      ] },
      { type: "callout", variant: "tip", title: "Lern-Strategie", md: "Learn each combination as **one chunk with its preposition and case**: *Kritik üben **an + Dativ***. Flashcard the whole phrase, never the words separately." },
      { type: "mistakes", items: [
        { wrong: "eine Entscheidung machen", right: "eine Entscheidung treffen", why: "Fixed pairing — decisions are 'met' (getroffen) in German, not made." },
        { wrong: "eine Frage machen", right: "eine Frage stellen", why: "Questions are 'placed' (gestellt)." },
      ] },
      { type: "exercise", slug: "b2-nvv-match" },
    ],
    cheatSheet: {
      title: "Top 8 für Prüfungen",
      points: ["eine Entscheidung treffen · eine Frage stellen", "eine Rolle spielen · zur Verfügung stehen", "Maßnahmen ergreifen · Rücksicht nehmen auf + Akk", "Kritik üben an + Dat · in Anspruch nehmen", "Always learn: chunk + preposition + case"],
    },
  },
];
