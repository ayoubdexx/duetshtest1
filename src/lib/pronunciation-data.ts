/** Static pronunciation curriculum — alphabet, umlauts, difficult sounds, minimal pairs, common mistakes. */

export interface SoundItem {
  symbol: string;
  ipa: string;
  hint: string;
  examples: { word: string; meaning: string }[];
}

export const ALPHABET: { letter: string; name: string; example: string }[] = [
  { letter: "A", name: "ah", example: "der Apfel" },
  { letter: "B", name: "beh", example: "das Buch" },
  { letter: "C", name: "tseh", example: "der Computer" },
  { letter: "D", name: "deh", example: "danke" },
  { letter: "E", name: "eh", example: "die Ente" },
  { letter: "F", name: "eff", example: "der Fisch" },
  { letter: "G", name: "geh", example: "gut" },
  { letter: "H", name: "hah", example: "das Haus" },
  { letter: "I", name: "ih", example: "die Insel" },
  { letter: "J", name: "jott", example: "ja" },
  { letter: "K", name: "kah", example: "der Kaffee" },
  { letter: "L", name: "ell", example: "lernen" },
  { letter: "M", name: "emm", example: "die Mutter" },
  { letter: "N", name: "enn", example: "nein" },
  { letter: "O", name: "oh", example: "der Ofen" },
  { letter: "P", name: "peh", example: "das Papier" },
  { letter: "Q", name: "kuh", example: "die Quelle" },
  { letter: "R", name: "err", example: "rot" },
  { letter: "S", name: "ess", example: "die Sonne" },
  { letter: "T", name: "teh", example: "der Tag" },
  { letter: "U", name: "uh", example: "die Uhr" },
  { letter: "V", name: "fau", example: "der Vogel" },
  { letter: "W", name: "weh", example: "das Wasser" },
  { letter: "X", name: "iks", example: "das Taxi" },
  { letter: "Y", name: "ypsilon", example: "der Typ" },
  { letter: "Z", name: "tsett", example: "die Zeit" },
];

export const UMLAUTS: SoundItem[] = [
  {
    symbol: "ä",
    ipa: "ɛ / ɛː",
    hint: "Like the 'e' in English 'bed', but longer when stressed. Say 'a' while thinking 'e'.",
    examples: [
      { word: "das Mädchen", meaning: "girl" },
      { word: "spät", meaning: "late" },
      { word: "die Äpfel", meaning: "apples" },
    ],
  },
  {
    symbol: "ö",
    ipa: "ø / œ",
    hint: "Say 'ay' (as in 'say') and round your lips into an 'o' shape without moving your tongue.",
    examples: [
      { word: "schön", meaning: "beautiful" },
      { word: "hören", meaning: "to hear" },
      { word: "möchten", meaning: "would like" },
    ],
  },
  {
    symbol: "ü",
    ipa: "y / ʏ",
    hint: "Say 'ee' and round your lips into a tight 'oo' shape — tongue stays forward.",
    examples: [
      { word: "über", meaning: "over, about" },
      { word: "die Tür", meaning: "door" },
      { word: "früh", meaning: "early" },
    ],
  },
  {
    symbol: "ß",
    ipa: "s",
    hint: "The 'Eszett' is simply a sharp 's' — it follows long vowels and diphthongs.",
    examples: [
      { word: "die Straße", meaning: "street" },
      { word: "heißen", meaning: "to be called" },
      { word: "groß", meaning: "big" },
    ],
  },
];

export const DIFFICULT_SOUNDS: SoundItem[] = [
  {
    symbol: "ch (ich-Laut)",
    ipa: "ç",
    hint: "After e, i, ä, ö, ü, ei and consonants: a soft hiss. Whisper 'yes' and hold the first sound.",
    examples: [
      { word: "ich", meaning: "I" },
      { word: "das Mädchen", meaning: "girl" },
      { word: "die Milch", meaning: "milk" },
    ],
  },
  {
    symbol: "ch (ach-Laut)",
    ipa: "x",
    hint: "After a, o, u, au: a rough sound from the back of the throat, like clearing your throat gently.",
    examples: [
      { word: "das Buch", meaning: "book" },
      { word: "die Nacht", meaning: "night" },
      { word: "auch", meaning: "also" },
    ],
  },
  {
    symbol: "r (uvular)",
    ipa: "ʁ",
    hint: "Gargled at the back of the throat — never rolled at the tip of the tongue in standard German.",
    examples: [
      { word: "rot", meaning: "red" },
      { word: "die Reise", meaning: "journey" },
      { word: "braun", meaning: "brown" },
    ],
  },
  {
    symbol: "r (vocalic ending)",
    ipa: "ɐ",
    hint: "At the end of words, -er sounds almost like a relaxed 'ah': Lehrer → 'LEH-rah'.",
    examples: [
      { word: "der Lehrer", meaning: "teacher" },
      { word: "das Wasser", meaning: "water" },
      { word: "immer", meaning: "always" },
    ],
  },
  {
    symbol: "z",
    ipa: "ts",
    hint: "Always 'ts' as in 'cats' — even at the beginning of a word.",
    examples: [
      { word: "die Zeit", meaning: "time" },
      { word: "zahlen", meaning: "to pay" },
      { word: "der Zug", meaning: "train" },
    ],
  },
  {
    symbol: "sch",
    ipa: "ʃ",
    hint: "Like English 'sh', with slightly more rounded lips. Also in 'st-' and 'sp-' at word start: 'scht', 'schp'.",
    examples: [
      { word: "die Schule", meaning: "school" },
      { word: "sprechen", meaning: "to speak" },
      { word: "die Stadt", meaning: "city" },
    ],
  },
  {
    symbol: "pf",
    ipa: "pf",
    hint: "Both sounds together — start a 'p' and release it into an 'f' in one motion.",
    examples: [
      { word: "das Pferd", meaning: "horse" },
      { word: "der Apfel", meaning: "apple" },
      { word: "der Kopf", meaning: "head" },
    ],
  },
  {
    symbol: "ei vs. ie",
    ipa: "aɪ vs. iː",
    hint: "ei sounds like English 'eye'; ie is a long 'ee'. Trick: pronounce the SECOND letter's English name.",
    examples: [
      { word: "die Zeit (ei)", meaning: "time" },
      { word: "die Liebe (ie)", meaning: "love" },
      { word: "bleiben", meaning: "to stay" },
    ],
  },
  {
    symbol: "-ig ending",
    ipa: "ɪç",
    hint: "In standard German, word-final -ig is pronounced like -ich: 'zwanzig' → 'tsvan-tsich'.",
    examples: [
      { word: "zwanzig", meaning: "twenty" },
      { word: "wichtig", meaning: "important" },
      { word: "billig", meaning: "cheap" },
    ],
  },
  {
    symbol: "v & w",
    ipa: "f & v",
    hint: "German v usually sounds like English 'f'; German w sounds like English 'v'. 'Vater' → 'FAH-ter'.",
    examples: [
      { word: "der Vater", meaning: "father" },
      { word: "das Wasser", meaning: "water" },
      { word: "wie viel", meaning: "how much" },
    ],
  },
];

export const MINIMAL_PAIRS: { a: string; b: string; note: string }[] = [
  { a: "schon", b: "schön", note: "already vs. beautiful — the ö changes everything" },
  { a: "Mutter", b: "Mütter", note: "mother vs. mothers — plural lives in the umlaut" },
  { a: "Zeit", b: "zieht", note: "ei = 'eye', ie = 'ee'" },
  { a: "Kirche", b: "Kirsche", note: "church vs. cherry — ch vs. sch" },
  { a: "Wein", b: "Wien", note: "wine vs. Vienna" },
  { a: "fühlen", b: "füllen", note: "to feel (long ü) vs. to fill (short ü)" },
  { a: "Ofen", b: "offen", note: "oven (long o) vs. open (short o)" },
  { a: "Hüte", b: "Hütte", note: "hats (long ü) vs. hut (short ü)" },
];

export const PRONUNCIATION_MISTAKES: { mistake: string; fix: string; example: string }[] = [
  {
    mistake: "Rolling the 'r' like in Spanish or English",
    fix: "Standard German uses a soft gargle at the back of the throat — or a vowel-like 'ah' at word endings.",
    example: "richtig, der Lehrer",
  },
  {
    mistake: "Pronouncing 'w' like English 'w'",
    fix: "German w = English v. 'Wasser' starts like 'vase', never like 'water'.",
    example: "wann, wo, warum",
  },
  {
    mistake: "Ignoring the final devoicing",
    fix: "b, d, g at the end of a word become p, t, k: 'Tag' sounds like 'Tahk'.",
    example: "der Tag, das Kind, halb",
  },
  {
    mistake: "Skipping the glottal stop",
    fix: "German words that begin with a vowel start crisply — don't link them like in English or French.",
    example: "am | Abend, ich | esse",
  },
  {
    mistake: "Making 'ei' and 'ie' the same",
    fix: "Say the English name of the second letter: ei → 'I', ie → 'E'.",
    example: "nein vs. nie",
  },
  {
    mistake: "Stressing the wrong syllable",
    fix: "Most German words stress the first syllable — but separable prefixes take the stress: AUFstehen.",
    example: "ARbeiten, but verSTEHen",
  },
];

export const PRACTICE_SENTENCES: string[] = [
  "Ich möchte einen Tisch für zwei Personen reservieren.",
  "Zwischen zwei Zwetschgenzweigen sitzen zwei zwitschernde Schwalben.",
  "Fischers Fritz fischt frische Fische.",
  "Ich brauche dringend eine richtige Richtung.",
  "Die Küche ist schön, aber die Kirche ist schöner.",
  "Am Abend esse ich immer etwas Obst.",
];
