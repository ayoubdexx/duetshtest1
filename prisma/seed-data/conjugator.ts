/**
 * German verb conjugation engine.
 * Generates complete VerbForms (Präsens, Präteritum, Perfekt, Futur I,
 * Konjunktiv II, Imperativ, Passiv) from a compact irregularity spec —
 * including separable verbs.
 */

import type { VerbForms, SixForms } from "../../src/types/content";
import type { VerbSeedInput } from "./types";

const REGULAR_ENDINGS = { ich: "e", du: "st", er: "t", wir: "en", ihr: "t", sie: "en" } as const;
const PRAET_REGULAR = { ich: "te", du: "test", er: "te", wir: "ten", ihr: "tet", sie: "ten" } as const;
const PRAET_IRREG = { ich: "", du: "st", er: "", wir: "en", ihr: "t", sie: "en" } as const;

const WERDEN: SixForms = { ich: "werde", du: "wirst", er: "wird", wir: "werden", ihr: "werdet", sie: "werden" };
const HABEN: SixForms = { ich: "habe", du: "hast", er: "hat", wir: "haben", ihr: "habt", sie: "haben" };
const SEIN: SixForms = { ich: "bin", du: "bist", er: "ist", wir: "sind", ihr: "seid", sie: "sind" };
const WUERDEN: SixForms = { ich: "würde", du: "würdest", er: "würde", wir: "würden", ihr: "würdet", sie: "würden" };

function stemOf(infinitive: string): string {
  if (infinitive.endsWith("eln") || infinitive.endsWith("ern")) return infinitive.slice(0, -1);
  return infinitive.replace(/e?n$/, "");
}

/** Insert an "e" before -st/-t endings after d/t/consonant+m/n stems (arbeiten → arbeitest) */
function needsE(stem: string): boolean {
  if (/[dt]$/.test(stem)) return true;
  if (/[^aeiouäöülr][mn]$/.test(stem)) return true;
  return false;
}

function endsInSibilant(stem: string): boolean {
  return /(s|ß|x|z)$/.test(stem);
}

function attach(prefix: string | undefined, form: string): string {
  return prefix ? `${form} ${prefix}` : form;
}

function mapForms(fn: (p: keyof SixForms) => string): SixForms {
  return { ich: fn("ich"), du: fn("du"), er: fn("er"), wir: fn("wir"), ihr: fn("ihr"), sie: fn("sie") };
}

export function conjugate(v: VerbSeedInput): VerbForms {
  const prefix = v.separablePrefix;
  const base = prefix ? v.infinitive.slice(prefix.length) : v.infinitive;
  const stem = stemOf(base);
  const e = needsE(stem) ? "e" : "";

  // ── Präsens ──
  const praesens = mapForms((p) => {
    if (p === "du" && v.praesens) return attach(prefix, v.praesens.du);
    if (p === "er" && v.praesens) return attach(prefix, v.praesens.er);
    if (p === "du" && endsInSibilant(stem)) return attach(prefix, `${stem}t`);
    if (p === "wir" || p === "sie") return attach(prefix, base);
    const ending = REGULAR_ENDINGS[p];
    const withE = (p === "du" || p === "er" || p === "ihr") && e ? "e" : "";
    return attach(prefix, `${stem}${withE}${ending}`);
  });

  // ── Präteritum ──
  let praeteritum: SixForms;
  if (v.praeteritum) {
    const pStem = v.praeteritum;
    const pe = needsE(pStem) ? "e" : "";
    praeteritum = mapForms((p) => {
      const ending = PRAET_IRREG[p];
      const withE = (p === "du" || p === "ihr") && pe ? "e" : "";
      return attach(prefix, `${pStem}${withE}${ending}`);
    });
  } else {
    praeteritum = mapForms((p) => attach(prefix, `${stem}${e}${PRAET_REGULAR[p]}`));
  }

  // ── Partizip II & Perfekt ──
  const partizip2 =
    v.partizip2 ?? (prefix ? `${prefix}ge${stem}${e}t` : `ge${stem}${e}t`);
  const auxForms = (v.aux ?? "haben") === "sein" ? SEIN : HABEN;
  const perfekt = mapForms((p) => `${auxForms[p]} ${partizip2}`);

  // ── Futur I ──
  const futur1 = mapForms((p) => `${WERDEN[p]} ${v.infinitive}`);

  // ── Konjunktiv II ──
  let konjunktiv2: SixForms;
  if (v.konjunktiv2) {
    const kStem = v.konjunktiv2.replace(/e$/, "");
    konjunktiv2 = {
      ich: `${kStem}e`,
      du: `${kStem}est`,
      er: `${kStem}e`,
      wir: `${kStem}en`,
      ihr: `${kStem}et`,
      sie: `${kStem}en`,
    };
  } else {
    konjunktiv2 = mapForms((p) => `${WUERDEN[p]} ${v.infinitive}`);
  }

  // ── Imperativ ──
  const MODALS = new Set(["können", "müssen", "wollen", "dürfen", "sollen", "mögen"]);
  const IMP_EXCEPTIONS: Record<string, { du: string; ihr: string; Sie: string }> = {
    sein: { du: "sei!", ihr: "seid!", Sie: "seien Sie!" },
    haben: { du: "hab!", ihr: "habt!", Sie: "haben Sie!" },
    werden: { du: "werde!", ihr: "werdet!", Sie: "werden Sie!" },
    wissen: { du: "wisse!", ihr: "wisst!", Sie: "wissen Sie!" },
  };

  let imperativ: { du: string; ihr: string; Sie: string };
  if (MODALS.has(v.infinitive)) {
    imperativ = { du: "—", ihr: "—", Sie: "—" };
  } else if (IMP_EXCEPTIONS[v.infinitive]) {
    imperativ = IMP_EXCEPTIONS[v.infinitive];
  } else {
    // du-imperative: er/sie/es form minus -t; a-umlauts revert (fährt → fahr!), e→i stays (spricht → sprich!)
    let duCore: string;
    if (v.praesens) {
      duCore = v.praesens.er.replace(/t$/, "").replace(/ä/g, "a");
    } else {
      duCore = `${stem}${e ? "e" : ""}`;
    }
    const suffix = prefix ? ` ${prefix}` : "";
    imperativ = {
      du: `${duCore}${suffix}!`,
      ihr: `${stem}${e}t${suffix}!`,
      Sie: `${base} Sie${suffix}!`,
    };
  }

  // ── Passiv (3rd person) ──
  const passiv = {
    praesens: `wird ${partizip2}`,
    praeteritum: `wurde ${partizip2}`,
  };

  return { praesens, praeteritum, perfekt, futur1, konjunktiv2, imperativ, passiv };
}

/** ~60 core verbs A1–B2 with irregularity specs and examples */
export const VERBS_SEED: VerbSeedInput[] = [
  { infinitive: "sein", english: "to be", level: "A1", aux: "sein", praesens: { du: "bist", er: "ist" }, praeteritum: "war", partizip2: "gewesen", konjunktiv2: "wäre", examples: [{ de: "Ich bin müde.", en: "I am tired.", tense: "Präsens" }, { de: "Wo warst du gestern?", en: "Where were you yesterday?", tense: "Präteritum" }] },
  { infinitive: "haben", english: "to have", level: "A1", praesens: { du: "hast", er: "hat" }, praeteritum: "hatte", partizip2: "gehabt", konjunktiv2: "hätte", examples: [{ de: "Hast du Zeit?", en: "Do you have time?", tense: "Präsens" }] },
  { infinitive: "werden", english: "to become", level: "A1", aux: "sein", praesens: { du: "wirst", er: "wird" }, praeteritum: "wurde", partizip2: "geworden", konjunktiv2: "würde", examples: [{ de: "Es wird kalt.", en: "It's getting cold.", tense: "Präsens" }] },
  { infinitive: "können", english: "can, to be able to", level: "A1", praesens: { du: "kannst", er: "kann" }, praeteritum: "konnte", partizip2: "gekonnt", konjunktiv2: "könnte", examples: [{ de: "Ich kann gut schwimmen.", en: "I can swim well.", tense: "Präsens" }] },
  { infinitive: "müssen", english: "must, to have to", level: "A1", praesens: { du: "musst", er: "muss" }, praeteritum: "musste", partizip2: "gemusst", konjunktiv2: "müsste", examples: [{ de: "Ich muss jetzt gehen.", en: "I have to go now.", tense: "Präsens" }] },
  { infinitive: "wollen", english: "to want", level: "A1", praesens: { du: "willst", er: "will" }, praeteritum: "wollte", partizip2: "gewollt", konjunktiv2: "wollte", examples: [{ de: "Was willst du trinken?", en: "What do you want to drink?", tense: "Präsens" }] },
  { infinitive: "dürfen", english: "may, to be allowed", level: "A2", praesens: { du: "darfst", er: "darf" }, praeteritum: "durfte", partizip2: "gedurft", konjunktiv2: "dürfte", examples: [{ de: "Hier darf man nicht rauchen.", en: "Smoking is not allowed here.", tense: "Präsens" }] },
  { infinitive: "sollen", english: "should, to be supposed to", level: "A2", praesens: { du: "sollst", er: "soll" }, praeteritum: "sollte", partizip2: "gesollt", konjunktiv2: "sollte", examples: [{ de: "Du sollst mehr schlafen.", en: "You should sleep more.", tense: "Präsens" }] },
  { infinitive: "mögen", english: "to like", level: "A1", praesens: { du: "magst", er: "mag" }, praeteritum: "mochte", partizip2: "gemocht", konjunktiv2: "möchte", examples: [{ de: "Ich mag Kaffee.", en: "I like coffee.", tense: "Präsens" }] },
  { infinitive: "gehen", english: "to go, to walk", level: "A1", aux: "sein", praeteritum: "ging", partizip2: "gegangen", examples: [{ de: "Wir gehen ins Kino.", en: "We're going to the cinema.", tense: "Präsens" }, { de: "Er ist nach Hause gegangen.", en: "He went home.", tense: "Perfekt" }] },
  { infinitive: "kommen", english: "to come", level: "A1", aux: "sein", praeteritum: "kam", partizip2: "gekommen", examples: [{ de: "Woher kommst du?", en: "Where do you come from?", tense: "Präsens" }] },
  { infinitive: "machen", english: "to do, to make", level: "A1", examples: [{ de: "Was machst du am Wochenende?", en: "What are you doing at the weekend?", tense: "Präsens" }] },
  { infinitive: "sagen", english: "to say", level: "A1", examples: [{ de: "Wie sagt man das auf Deutsch?", en: "How do you say that in German?", tense: "Präsens" }] },
  { infinitive: "sprechen", english: "to speak", level: "A1", praesens: { du: "sprichst", er: "spricht" }, praeteritum: "sprach", partizip2: "gesprochen", examples: [{ de: "Sprechen Sie Deutsch?", en: "Do you speak German?", tense: "Präsens" }] },
  { infinitive: "essen", english: "to eat", level: "A1", praesens: { du: "isst", er: "isst" }, praeteritum: "aß", partizip2: "gegessen", examples: [{ de: "Ich esse gern Pizza.", en: "I like eating pizza.", tense: "Präsens" }] },
  { infinitive: "trinken", english: "to drink", level: "A1", praeteritum: "trank", partizip2: "getrunken", examples: [{ de: "Was möchtest du trinken?", en: "What would you like to drink?", tense: "Präsens" }] },
  { infinitive: "sehen", english: "to see", level: "A1", praesens: { du: "siehst", er: "sieht" }, praeteritum: "sah", partizip2: "gesehen", examples: [{ de: "Ich sehe das Problem.", en: "I see the problem.", tense: "Präsens" }] },
  { infinitive: "lesen", english: "to read", level: "A1", praesens: { du: "liest", er: "liest" }, praeteritum: "las", partizip2: "gelesen", examples: [{ de: "Sie liest jeden Abend.", en: "She reads every evening.", tense: "Präsens" }] },
  { infinitive: "schreiben", english: "to write", level: "A1", praeteritum: "schrieb", partizip2: "geschrieben", examples: [{ de: "Ich schreibe dir eine E-Mail.", en: "I'll write you an email.", tense: "Präsens" }] },
  { infinitive: "hören", english: "to hear, to listen", level: "A1", examples: [{ de: "Ich höre gern Musik.", en: "I like listening to music.", tense: "Präsens" }] },
  { infinitive: "wohnen", english: "to live, to reside", level: "A1", examples: [{ de: "Wo wohnst du?", en: "Where do you live?", tense: "Präsens" }] },
  { infinitive: "arbeiten", english: "to work", level: "A1", examples: [{ de: "Sie arbeitet in einem Büro.", en: "She works in an office.", tense: "Präsens" }] },
  { infinitive: "lernen", english: "to learn", level: "A1", examples: [{ de: "Wir lernen Deutsch.", en: "We're learning German.", tense: "Präsens" }] },
  { infinitive: "spielen", english: "to play", level: "A1", examples: [{ de: "Die Kinder spielen im Park.", en: "The children are playing in the park.", tense: "Präsens" }] },
  { infinitive: "kaufen", english: "to buy", level: "A1", examples: [{ de: "Ich kaufe Brot und Käse.", en: "I'm buying bread and cheese.", tense: "Präsens" }] },
  { infinitive: "fahren", english: "to drive, to go (by vehicle)", level: "A1", aux: "sein", praesens: { du: "fährst", er: "fährt" }, praeteritum: "fuhr", partizip2: "gefahren", examples: [{ de: "Wir fahren morgen nach Berlin.", en: "We're going to Berlin tomorrow.", tense: "Präsens" }] },
  { infinitive: "schlafen", english: "to sleep", level: "A1", praesens: { du: "schläfst", er: "schläft" }, praeteritum: "schlief", partizip2: "geschlafen", examples: [{ de: "Das Baby schläft.", en: "The baby is sleeping.", tense: "Präsens" }] },
  { infinitive: "geben", english: "to give", level: "A1", praesens: { du: "gibst", er: "gibt" }, praeteritum: "gab", partizip2: "gegeben", examples: [{ de: "Es gibt ein Problem.", en: "There is a problem.", tense: "Präsens" }] },
  { infinitive: "nehmen", english: "to take", level: "A1", praesens: { du: "nimmst", er: "nimmt" }, praeteritum: "nahm", partizip2: "genommen", examples: [{ de: "Ich nehme den Bus.", en: "I take the bus.", tense: "Präsens" }] },
  { infinitive: "finden", english: "to find, to think (opinion)", level: "A1", praeteritum: "fand", partizip2: "gefunden", examples: [{ de: "Ich finde die Stadt schön.", en: "I think the city is beautiful.", tense: "Präsens" }] },
  { infinitive: "wissen", english: "to know (a fact)", level: "A2", praesens: { du: "weißt", er: "weiß" }, praeteritum: "wusste", partizip2: "gewusst", konjunktiv2: "wüsste", examples: [{ de: "Ich weiß es nicht.", en: "I don't know.", tense: "Präsens" }] },
  { infinitive: "kennen", english: "to know (a person/place)", level: "A2", praeteritum: "kannte", partizip2: "gekannt", examples: [{ de: "Kennst du diesen Film?", en: "Do you know this film?", tense: "Präsens" }] },
  { infinitive: "helfen", english: "to help", level: "A2", praesens: { du: "hilfst", er: "hilft" }, praeteritum: "half", partizip2: "geholfen", examples: [{ de: "Kannst du mir helfen?", en: "Can you help me?", tense: "Präsens" }] },
  { infinitive: "bleiben", english: "to stay", level: "A2", aux: "sein", praeteritum: "blieb", partizip2: "geblieben", examples: [{ de: "Wir bleiben zu Hause.", en: "We're staying at home.", tense: "Präsens" }] },
  { infinitive: "bringen", english: "to bring", level: "A2", praeteritum: "brachte", partizip2: "gebracht", examples: [{ de: "Ich bringe dir das Buch.", en: "I'll bring you the book.", tense: "Präsens" }] },
  { infinitive: "denken", english: "to think", level: "A2", praeteritum: "dachte", partizip2: "gedacht", examples: [{ de: "Ich denke oft an dich.", en: "I often think of you.", tense: "Präsens" }] },
  { infinitive: "laufen", english: "to run, to walk", level: "A2", aux: "sein", praesens: { du: "läufst", er: "läuft" }, praeteritum: "lief", partizip2: "gelaufen", examples: [{ de: "Er läuft jeden Morgen.", en: "He runs every morning.", tense: "Präsens" }] },
  { infinitive: "treffen", english: "to meet", level: "A2", praesens: { du: "triffst", er: "trifft" }, praeteritum: "traf", partizip2: "getroffen", examples: [{ de: "Wir treffen uns um acht.", en: "We're meeting at eight.", tense: "Präsens" }] },
  { infinitive: "verstehen", english: "to understand", level: "A2", praeteritum: "verstand", partizip2: "verstanden", examples: [{ de: "Ich verstehe die Frage nicht.", en: "I don't understand the question.", tense: "Präsens" }] },
  { infinitive: "bekommen", english: "to receive, to get", level: "A2", praeteritum: "bekam", partizip2: "bekommen", examples: [{ de: "Ich habe eine E-Mail bekommen.", en: "I received an email.", tense: "Perfekt" }] },
  { infinitive: "beginnen", english: "to begin", level: "A2", praeteritum: "begann", partizip2: "begonnen", examples: [{ de: "Der Kurs beginnt um neun.", en: "The course begins at nine.", tense: "Präsens" }] },
  { infinitive: "bezahlen", english: "to pay", level: "A2", partizip2: "bezahlt", examples: [{ de: "Ich möchte bitte bezahlen.", en: "I'd like to pay, please.", tense: "Präsens" }] },
  { infinitive: "brauchen", english: "to need", level: "A1", examples: [{ de: "Ich brauche einen neuen Stift.", en: "I need a new pen.", tense: "Präsens" }] },
  { infinitive: "fragen", english: "to ask", level: "A1", examples: [{ de: "Darf ich etwas fragen?", en: "May I ask something?", tense: "Präsens" }] },
  { infinitive: "antworten", english: "to answer", level: "A2", examples: [{ de: "Er antwortet nicht.", en: "He doesn't answer.", tense: "Präsens" }] },
  { infinitive: "aufstehen", english: "to get up", level: "A2", aux: "sein", separablePrefix: "auf", praeteritum: "stand", partizip2: "aufgestanden", examples: [{ de: "Ich stehe um sieben Uhr auf.", en: "I get up at seven o'clock.", tense: "Präsens" }] },
  { infinitive: "anfangen", english: "to start", level: "A2", separablePrefix: "an", praesens: { du: "fängst", er: "fängt" }, praeteritum: "fing", partizip2: "angefangen", examples: [{ de: "Der Film fängt gleich an.", en: "The film is starting soon.", tense: "Präsens" }] },
  { infinitive: "einkaufen", english: "to shop (groceries)", level: "A1", separablePrefix: "ein", examples: [{ de: "Samstags kaufe ich ein.", en: "On Saturdays I do the shopping.", tense: "Präsens" }] },
  { infinitive: "anrufen", english: "to call (phone)", level: "A2", separablePrefix: "an", praeteritum: "rief", partizip2: "angerufen", examples: [{ de: "Ich rufe dich morgen an.", en: "I'll call you tomorrow.", tense: "Präsens" }] },
  { infinitive: "mitkommen", english: "to come along", level: "A2", aux: "sein", separablePrefix: "mit", praeteritum: "kam", partizip2: "mitgekommen", examples: [{ de: "Kommst du mit?", en: "Are you coming along?", tense: "Präsens" }] },
  { infinitive: "aussehen", english: "to look, to appear", level: "A2", separablePrefix: "aus", praesens: { du: "siehst", er: "sieht" }, praeteritum: "sah", partizip2: "ausgesehen", examples: [{ de: "Du siehst müde aus.", en: "You look tired.", tense: "Präsens" }] },
  { infinitive: "erklären", english: "to explain", level: "B1", partizip2: "erklärt", examples: [{ de: "Können Sie das bitte erklären?", en: "Can you explain that, please?", tense: "Präsens" }] },
  { infinitive: "erzählen", english: "to tell (a story)", level: "B1", partizip2: "erzählt", examples: [{ de: "Erzähl mir von deiner Reise!", en: "Tell me about your trip!", tense: "Imperativ" }] },
  { infinitive: "entscheiden", english: "to decide", level: "B1", praeteritum: "entschied", partizip2: "entschieden", examples: [{ de: "Wir haben uns entschieden.", en: "We have decided.", tense: "Perfekt" }] },
  { infinitive: "empfehlen", english: "to recommend", level: "B1", praesens: { du: "empfiehlst", er: "empfiehlt" }, praeteritum: "empfahl", partizip2: "empfohlen", examples: [{ de: "Was empfehlen Sie?", en: "What do you recommend?", tense: "Präsens" }] },
  { infinitive: "vergessen", english: "to forget", level: "B1", praesens: { du: "vergisst", er: "vergisst" }, praeteritum: "vergaß", partizip2: "vergessen", examples: [{ de: "Ich habe den Termin vergessen.", en: "I forgot the appointment.", tense: "Perfekt" }] },
  { infinitive: "verlieren", english: "to lose", level: "B1", praeteritum: "verlor", partizip2: "verloren", examples: [{ de: "Er hat seinen Schlüssel verloren.", en: "He lost his key.", tense: "Perfekt" }] },
  { infinitive: "gewinnen", english: "to win", level: "B1", praeteritum: "gewann", partizip2: "gewonnen", examples: [{ de: "Unser Team hat gewonnen!", en: "Our team won!", tense: "Perfekt" }] },
  { infinitive: "vorschlagen", english: "to suggest", level: "B1", separablePrefix: "vor", praesens: { du: "schlägst", er: "schlägt" }, praeteritum: "schlug", partizip2: "vorgeschlagen", examples: [{ de: "Ich schlage vor, dass wir früher anfangen.", en: "I suggest we start earlier.", tense: "Präsens" }] },
  { infinitive: "teilnehmen", english: "to participate", level: "B2", separablePrefix: "teil", praesens: { du: "nimmst", er: "nimmt" }, praeteritum: "nahm", partizip2: "teilgenommen", examples: [{ de: "Sie nimmt an dem Kurs teil.", en: "She's taking part in the course.", tense: "Präsens" }] },
  { infinitive: "sich bewerben", english: "to apply (for a job)", level: "B2", praesens: { du: "bewirbst", er: "bewirbt" }, praeteritum: "bewarb", partizip2: "beworben", examples: [{ de: "Ich bewerbe mich um die Stelle.", en: "I'm applying for the position.", tense: "Präsens" }] },
  { infinitive: "berücksichtigen", english: "to take into account", level: "B2", partizip2: "berücksichtigt", examples: [{ de: "Wir müssen alle Faktoren berücksichtigen.", en: "We have to take all factors into account.", tense: "Präsens" }] },
  { infinitive: "voraussetzen", english: "to presuppose, to require", level: "B2", separablePrefix: "voraus", partizip2: "vorausgesetzt", examples: [{ de: "Die Stelle setzt gute Deutschkenntnisse voraus.", en: "The position requires good German skills.", tense: "Präsens" }] },
];
