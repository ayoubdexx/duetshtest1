import type { ReadingSeed, ListeningSeed } from "./types";

export const READINGS: ReadingSeed[] = [
  {
    slug: "mein-name-ist-aylin", levelCode: "A1", title: "Mein Name ist Aylin", topic: "Menschen",
    intro: "A simple self-introduction — your first complete German text.",
    body: `Hallo! Mein Name ist Aylin und ich bin 24 Jahre alt. Ich komme aus der Türkei, aus Izmir, aber ich wohne jetzt in Hamburg. Hamburg ist groß und sehr schön, aber das Wetter ist oft schlecht!

Ich bin Studentin und lerne Informatik. Von Montag bis Freitag bin ich an der Universität. Am Wochenende arbeite ich in einem Café. Die Arbeit macht Spaß, und mein Deutsch wird besser.

Meine Familie wohnt in der Türkei. Ich habe eine Schwester und einen Bruder. Meine Schwester heißt Elif, sie ist 28 und verheiratet. Mein Bruder Emre ist noch klein — er ist erst zwölf. Ich telefoniere jeden Sonntag mit meiner Familie.

Mein Hobby ist Fotografie. Ich fotografiere gern den Hafen und die alten Häuser. Und ich trinke sehr gern Tee — das ist typisch türkisch!`,
    glossary: [
      { de: "das Wetter", en: "weather" }, { de: "die Studentin", en: "student (f)" },
      { de: "die Informatik", en: "computer science" }, { de: "Spaß machen", en: "to be fun" },
      { de: "verheiratet", en: "married" }, { de: "erst", en: "only (age)" }, { de: "der Hafen", en: "harbor" },
    ],
    grammarNotes: [
      { quote: "Ich komme aus der Türkei", topic: "Länder mit Artikel", note: "die Türkei takes an article — aus DER Türkei (Dativ)." },
      { quote: "mein Deutsch wird besser", topic: "werden", note: "werden + Komparativ = getting better/bigger/etc." },
    ],
    questions: [
      { id: "ay-1", type: "mcq", prompt: "Wo wohnt Aylin jetzt?", options: ["in Izmir", "in Hamburg", "in Berlin"], answerIndex: 1 },
      { id: "ay-2", type: "mcq", prompt: "Was macht Aylin am Wochenende?", options: ["Sie lernt an der Uni.", "Sie arbeitet in einem Café.", "Sie fliegt in die Türkei."], answerIndex: 1 },
      { id: "ay-3", type: "mcq", prompt: "Wie alt ist ihr Bruder Emre?", options: ["28", "24", "12"], answerIndex: 2 },
      { id: "ay-4", type: "mcq", prompt: "Was fotografiert sie gern?", options: ["den Hafen", "ihre Familie", "das Café"], answerIndex: 0 },
    ],
  },
  {
    slug: "ein-tag-in-berlin", levelCode: "A1", title: "Ein Tag in Berlin", topic: "Reisen",
    intro: "Tom visits Berlin for the first time.",
    body: `Tom ist heute in Berlin. Er kommt aus Wien und besucht seine Freundin Marie. Um neun Uhr frühstücken sie zusammen — Brötchen mit Marmelade und zwei große Kaffee.

Dann fahren sie mit der U-Bahn zum Brandenburger Tor. Dort machen sie viele Fotos. Das Wetter ist super: Die Sonne scheint und es ist warm.

Um ein Uhr haben sie Hunger. Sie essen Currywurst mit Pommes — das ist typisch Berlin! Tom findet die Currywurst sehr lecker. Sie kostet nur vier Euro.

Am Nachmittag gehen sie ins Museum und danach in einen Park. Viele Menschen sitzen im Gras, spielen Musik oder lesen. Am Abend sind Tom und Marie müde, aber glücklich. „Berlin ist fantastisch\", sagt Tom. „Ich komme bald wieder!\"`,
    glossary: [
      { de: "besuchen", en: "to visit" }, { de: "die U-Bahn", en: "subway" },
      { de: "Die Sonne scheint", en: "the sun is shining" }, { de: "typisch", en: "typical" },
      { de: "das Gras", en: "grass" }, { de: "müde", en: "tired" }, { de: "glücklich", en: "happy" },
    ],
    grammarNotes: [
      { quote: "fahren sie mit der U-Bahn", topic: "mit + Dativ", note: "Transport always: mit + Dativ — mit der U-Bahn, mit dem Bus." },
      { quote: "Ich komme bald wieder!", topic: "Verb Position 2", note: "wiederkommen splits: komme … wieder." },
    ],
    questions: [
      { id: "tb-1", type: "mcq", prompt: "Woher kommt Tom?", options: ["aus Berlin", "aus Wien", "aus Hamburg"], answerIndex: 1 },
      { id: "tb-2", type: "mcq", prompt: "Wie ist das Wetter?", options: ["Es regnet.", "Es ist kalt.", "Die Sonne scheint."], answerIndex: 2 },
      { id: "tb-3", type: "mcq", prompt: "Was kostet die Currywurst?", options: ["vier Euro", "vierzehn Euro", "vierzig Euro"], answerIndex: 0 },
      { id: "tb-4", type: "mcq", prompt: "Wie findet Tom Berlin?", options: ["langweilig", "fantastisch", "zu groß"], answerIndex: 1 },
    ],
  },
  {
    slug: "der-flohmarkt", levelCode: "A2", title: "Sonntag auf dem Flohmarkt", topic: "Alltag",
    intro: "Second-hand treasures and the art of haggling.",
    body: `Letzten Sonntag bin ich zum ersten Mal auf einen Flohmarkt gegangen. Meine Nachbarin Frau Krause hat mich mitgenommen. „Auf dem Flohmarkt findet man alles\", hat sie gesagt — und sie hatte recht!

Es gab Bücher, alte Lampen, Kleidung, Spielzeug und sogar Fahrräder. Ich habe eine schöne Jacke gesehen. Der Verkäufer wollte 25 Euro haben. Das war mir zu teuer. „15 Euro?\", habe ich gefragt. Am Ende haben wir uns auf 18 Euro geeinigt. Frau Krause hat gelacht: „Sie handeln ja wie ein Profi!\"

Danach haben wir Kaffee getrunken und Waffeln gegessen. Frau Krause hat mir Geschichten von früher erzählt. Sie geht seit dreißig Jahren jeden Sonntag auf diesen Markt.

Nächste Woche gehe ich wieder hin. Diesmal suche ich eine Lampe für mein Wohnzimmer — und ich fange bei der Hälfte des Preises an!`,
    glossary: [
      { de: "der Flohmarkt", en: "flea market" }, { de: "mitnehmen", en: "to take along" },
      { de: "recht haben", en: "to be right" }, { de: "sogar", en: "even" },
      { de: "handeln", en: "to haggle" }, { de: "sich einigen auf", en: "to agree on" }, { de: "die Hälfte", en: "half" },
    ],
    grammarNotes: [
      { quote: "bin ich … gegangen", topic: "Perfekt mit sein", note: "gehen = movement → sein + gegangen." },
      { quote: "Der Verkäufer wollte 25 Euro haben", topic: "Modalverb im Präteritum", note: "wollen → wollte: spoken past for modals." },
    ],
    questions: [
      { id: "fl-1", type: "mcq", prompt: "Mit wem war die Person auf dem Flohmarkt?", options: ["mit einer Kollegin", "mit der Nachbarin", "allein"], answerIndex: 1 },
      { id: "fl-2", type: "mcq", prompt: "Wie viel hat die Jacke am Ende gekostet?", options: ["25 Euro", "15 Euro", "18 Euro"], answerIndex: 2 },
      { id: "fl-3", type: "mcq", prompt: "Seit wann geht Frau Krause auf den Markt?", options: ["seit 13 Jahren", "seit 30 Jahren", "seit 3 Jahren"], answerIndex: 1 },
      { id: "fl-4", type: "mcq", prompt: "Was sucht die Person nächste Woche?", options: ["eine Lampe", "ein Fahrrad", "eine Jacke"], answerIndex: 0 },
    ],
  },
  {
    slug: "endlich-urlaub", levelCode: "A2", title: "Endlich Urlaub!", topic: "Reisen",
    intro: "A family's holiday at the Baltic Sea — with a small catastrophe.",
    body: `Familie Weber hat diesen Sommer Urlaub an der Ostsee gemacht. Zwei Wochen Strand, Meer und keine Arbeit — darauf haben sich alle gefreut.

Die Reise hat allerdings schlecht angefangen. Auf der Autobahn gab es einen langen Stau, und dann hat Sohn Finn gemerkt: Er hat seine Badehose vergessen! „Kein Problem\", hat Mama Weber gesagt, „wir kaufen eine neue.\" Aber am Sonntag waren natürlich alle Geschäfte geschlossen.

Am Montag hat die Familie dann endlich alles gehabt: Badehose, Sonnencreme und gute Laune. Das Wetter war fast jeden Tag sonnig. Finn und seine Schwester Emma haben Sandburgen gebaut und sind stundenlang geschwommen. Papa Weber hat drei Bücher gelesen — zu Hause hat er dafür nie Zeit.

Das Beste war der letzte Abend: Die Familie hat am Strand gegrillt und den Sonnenuntergang gesehen. „Nächstes Jahr kommen wir wieder\", haben alle gesagt. Und Finn packt dann zuerst die Badehose ein!`,
    glossary: [
      { de: "die Ostsee", en: "Baltic Sea" }, { de: "sich freuen auf", en: "to look forward to" },
      { de: "der Stau", en: "traffic jam" }, { de: "die Badehose", en: "swimming trunks" },
      { de: "die gute Laune", en: "good mood" }, { de: "die Sandburg", en: "sandcastle" }, { de: "der Sonnenuntergang", en: "sunset" },
    ],
    grammarNotes: [
      { quote: "darauf haben sich alle gefreut", topic: "sich freuen auf", note: "Reflexive verb with preposition — darauf = auf + das (referring back)." },
      { quote: "waren natürlich alle Geschäfte geschlossen", topic: "Zustandspassiv", note: "sein + Partizip II describes a state: the shops WERE closed." },
    ],
    questions: [
      { id: "ur-1", type: "mcq", prompt: "Wo hat die Familie Urlaub gemacht?", options: ["an der Nordsee", "an der Ostsee", "in den Bergen"], answerIndex: 1 },
      { id: "ur-2", type: "mcq", prompt: "Was hat Finn vergessen?", options: ["die Sonnencreme", "sein Buch", "die Badehose"], answerIndex: 2 },
      { id: "ur-3", type: "mcq", prompt: "Warum konnte die Familie am Sonntag nichts kaufen?", options: ["Die Geschäfte waren geschlossen.", "Sie hatten kein Geld.", "Es gab keinen Supermarkt."], answerIndex: 0 },
      { id: "ur-4", type: "mcq", prompt: "Was war das Highlight?", options: ["der Stau", "das Grillen am Strand", "die drei Bücher"], answerIndex: 1 },
    ],
  },
  {
    slug: "leben-in-der-wg", levelCode: "B1", title: "Leben in der WG", topic: "Wohnen",
    intro: "Shared flats — a German student institution between friendship and dirty dishes.",
    body: `Für viele junge Menschen in Deutschland ist die Wohngemeinschaft — kurz WG — die erste eigene Wohnform. Kein Wunder: Die Mieten in Städten wie München oder Hamburg sind so hoch, dass sich Studierende eine eigene Wohnung kaum leisten können.

Eine WG bedeutet aber mehr als geteilte Miete. Wer einzieht, teilt auch Küche, Bad und Alltag. Damit das funktioniert, gibt es in den meisten WGs feste Regeln: einen Putzplan, gemeinsame Kassen für Milch und Toilettenpapier und manchmal sogar einen wöchentlichen WG-Abend, an dem zusammen gekocht wird.

Trotzdem gibt es natürlich Konflikte. Die Klassiker: schmutziges Geschirr, das tagelang in der Spüle steht, laute Musik um Mitternacht und Mitbewohner, die nie einkaufen, aber immer mitessen. Experten empfehlen, Probleme direkt anzusprechen, statt wochenlang zu schweigen — ein Tipp, der übrigens nicht nur in WGs funktioniert.

Wer eine WG sucht, muss sich heute oft bei einem „WG-Casting\" vorstellen. Dort entscheiden die Bewohner, wer am besten passt. Gefragt sind ehrliche Antworten: Wer behauptet, dass er gern putzt, obwohl es nicht stimmt, fliegt beim ersten Putzplan auf.`,
    glossary: [
      { de: "die Wohngemeinschaft (WG)", en: "shared flat" }, { de: "sich etwas leisten", en: "to afford something" },
      { de: "einziehen", en: "to move in" }, { de: "der Putzplan", en: "cleaning schedule" },
      { de: "das Geschirr", en: "dishes" }, { de: "ansprechen", en: "to address (a problem)" },
      { de: "auffliegen", en: "to be exposed" },
    ],
    grammarNotes: [
      { quote: "so hoch, dass sich Studierende … kaum leisten können", topic: "so … dass", note: "Consecutive clause: so + adjective + dass-Nebensatz." },
      { quote: "an dem zusammen gekocht wird", topic: "Passiv im Relativsatz", note: "wird gekocht — passive inside a relative clause, typical B1+ style." },
    ],
    questions: [
      { id: "wg-1", type: "mcq", prompt: "Warum wohnen viele Studierende in WGs?", options: ["Sie mögen keine eigenen Wohnungen.", "Die Mieten sind zu hoch.", "Die Unis verlangen es."], answerIndex: 1 },
      { id: "wg-2", type: "mcq", prompt: "Was ist KEIN typischer WG-Konflikt im Text?", options: ["schmutziges Geschirr", "laute Musik", "zu viel Putzen"], answerIndex: 2 },
      { id: "wg-3", type: "mcq", prompt: "Was empfehlen Experten bei Problemen?", options: ["direkt ansprechen", "ausziehen", "schweigen"], answerIndex: 0 },
      { id: "wg-4", type: "mcq", prompt: "Was passiert bei einem „WG-Casting\"?", options: ["Man putzt zur Probe.", "Die Bewohner wählen den neuen Mitbewohner.", "Man unterschreibt den Mietvertrag."], answerIndex: 1 },
    ],
  },
  {
    slug: "fahrrad-boom", levelCode: "B1", title: "Deutschland entdeckt das Fahrrad neu", topic: "Umwelt",
    intro: "Cargo bikes, bike highways and the mobility shift.",
    body: `Das Fahrrad erlebt in Deutschland einen Boom. Über 80 Millionen Räder gibt es im Land — mehr als Einwohner. Besonders beliebt sind E-Bikes: Inzwischen wird fast jedes zweite neue Fahrrad mit Elektromotor verkauft.

Die Gründe für den Boom sind vielfältig. Viele Menschen wollen etwas für die Umwelt tun, denn wer mit dem Rad zur Arbeit fährt, spart CO2. Andere wollen einfach dem Stau entkommen oder etwas für ihre Gesundheit tun. Und seit immer mehr Städte Radwege ausbauen, fühlen sich auch Anfänger sicherer.

Familien setzen zunehmend auf Lastenräder. Mit ihnen kann man Kinder zur Kita bringen und danach den Wocheneinkauf transportieren — ganz ohne Auto. In manchen Städten kann man Lastenräder sogar kostenlos ausleihen.

Kritiker sagen allerdings, dass die Infrastruktur nicht schnell genug wächst. Radwege enden oft plötzlich, und an vielen Kreuzungen ist es gefährlich. Verkehrsexperten fordern deshalb mehr Investitionen: „Wenn wir wollen, dass die Menschen umsteigen, müssen wir ihnen sichere Wege anbieten.\"`,
    glossary: [
      { de: "der Einwohner", en: "inhabitant" }, { de: "vielfältig", en: "diverse, varied" },
      { de: "entkommen", en: "to escape" }, { de: "ausbauen", en: "to expand" },
      { de: "das Lastenrad", en: "cargo bike" }, { de: "ausleihen", en: "to borrow/rent" },
      { de: "fordern", en: "to demand" }, { de: "umsteigen", en: "to switch (transport)" },
    ],
    grammarNotes: [
      { quote: "wird fast jedes zweite neue Fahrrad … verkauft", topic: "Passiv", note: "Vorgangspassiv: wird + verkauft." },
      { quote: "Wenn wir wollen, dass die Menschen umsteigen", topic: "wenn + dass", note: "Two subordinate clauses stacked — verbs at both ends." },
    ],
    questions: [
      { id: "fb-1", type: "mcq", prompt: "Wie viele Fahrräder gibt es laut Text in Deutschland?", options: ["über 80 Millionen", "über 8 Millionen", "über 18 Millionen"], answerIndex: 0 },
      { id: "fb-2", type: "mcq", prompt: "Welcher Grund für den Boom wird NICHT genannt?", options: ["die Umwelt", "die Gesundheit", "günstige Preise"], answerIndex: 2 },
      { id: "fb-3", type: "mcq", prompt: "Wofür nutzen Familien Lastenräder?", options: ["für Radrennen", "für Kita und Einkauf", "für Urlaubsreisen"], answerIndex: 1 },
      { id: "fb-4", type: "mcq", prompt: "Was kritisieren Experten?", options: ["Die Räder sind zu teuer.", "Die Infrastruktur wächst zu langsam.", "E-Bikes sind ungesund."], answerIndex: 1 },
    ],
  },
  {
    slug: "homeoffice-fluch-segen", levelCode: "B2", title: "Homeoffice: Fluch oder Segen?", topic: "Arbeitswelt",
    intro: "The remote-work debate — productivity paradise or isolation trap?",
    body: `Kaum eine Entwicklung hat die Arbeitswelt so schnell verändert wie das Homeoffice. Was vor wenigen Jahren noch als Privileg weniger Branchen galt, ist heute für Millionen Beschäftigte Normalität. Doch während die einen das Arbeiten von zu Hause als Befreiung feiern, warnen andere vor langfristigen Folgen — für Unternehmen wie für Beschäftigte.

Die Vorteile liegen auf der Hand: Wer nicht pendelt, gewinnt Zeit — im Durchschnitt fast eine Stunde pro Tag. Eltern können Beruf und Familie flexibler vereinbaren, und viele Beschäftigte berichten, dass sie zu Hause konzentrierter arbeiten als im Großraumbüro. Auch die Unternehmen profitieren: Sie sparen Büroflächen und können Fachkräfte einstellen, die hunderte Kilometer entfernt wohnen.

Dennoch mehren sich kritische Stimmen. Psychologen beobachten, dass die Grenze zwischen Arbeit und Privatleben zunehmend verschwimmt. Wer den Laptop ständig in Reichweite hat, schaltet schlechter ab — Überstunden werden im Homeoffice häufig gar nicht mehr erfasst. Hinzu kommt die soziale Dimension: Der spontane Austausch in der Kaffeeküche, aus dem oft die besten Ideen entstehen, lässt sich durch Videokonferenzen kaum ersetzen. Gerade Berufseinsteiger leiden darunter, dass ihnen erfahrene Kollegen als direkte Ansprechpartner fehlen.

Die Zukunft dürfte deshalb den hybriden Modellen gehören: zwei bis drei Tage im Büro für Zusammenarbeit und Teamgefühl, der Rest flexibel. Entscheidend wird sein, ob Unternehmen diese Freiheit als Vertrauensbeweis gestalten — oder als Kontrollproblem behandeln.`,
    glossary: [
      { de: "gelten als", en: "to be considered as" }, { de: "die Beschäftigten", en: "employees" },
      { de: "pendeln", en: "to commute" }, { de: "vereinbaren", en: "to reconcile/arrange" },
      { de: "verschwimmen", en: "to blur" }, { de: "abschalten", en: "to switch off (mentally)" },
      { de: "erfassen", en: "to record/register" }, { de: "der Berufseinsteiger", en: "career starter" },
      { de: "der Vertrauensbeweis", en: "proof of trust" },
    ],
    grammarNotes: [
      { quote: "Was vor wenigen Jahren noch als Privileg galt, ist heute … Normalität", topic: "Relativsatz mit was", note: "was-clause as subject — elegant B2 structure." },
      { quote: "lässt sich durch Videokonferenzen kaum ersetzen", topic: "sich lassen + Infinitiv", note: "Passive alternative: lässt sich ersetzen = kann ersetzt werden." },
    ],
    questions: [
      { id: "ho-1", type: "mcq", prompt: "Wie viel Zeit gewinnen Pendler laut Text im Schnitt?", options: ["fast eine Stunde täglich", "zwei Stunden täglich", "eine Stunde pro Woche"], answerIndex: 0 },
      { id: "ho-2", type: "mcq", prompt: "Welches Problem beobachten Psychologen?", options: ["zu wenig Arbeit", "verschwimmende Grenzen zwischen Arbeit und Privatleben", "zu viele Pausen"], answerIndex: 1 },
      { id: "ho-3", type: "mcq", prompt: "Warum leiden besonders Berufseinsteiger?", options: ["Sie verdienen weniger.", "Ihnen fehlen erfahrene Ansprechpartner.", "Sie müssen mehr pendeln."], answerIndex: 1 },
      { id: "ho-4", type: "mcq", prompt: "Welches Modell sieht der Text als Zukunft?", options: ["nur Büro", "nur Homeoffice", "hybride Modelle"], answerIndex: 2 },
    ],
  },
  {
    slug: "ki-im-alltag", levelCode: "B2", title: "Künstliche Intelligenz im Alltag", topic: "Technik",
    intro: "Between fascination and skepticism — how AI quietly runs your day.",
    body: `Künstliche Intelligenz klingt für viele noch immer nach Science-Fiction — dabei nutzen die meisten Menschen sie längst täglich, oft ohne es zu merken. Wer morgens die schnellste Route zur Arbeit sucht, dessen Navigations-App wertet in Sekunden Millionen von Verkehrsdaten aus. Wer abends eine Serie startet, bekommt Empfehlungen, die ein Algorithmus aus dem bisherigen Sehverhalten berechnet hat.

Besonders sichtbar wurde die Technologie durch Sprachmodelle, die Texte schreiben, übersetzen und zusammenfassen können. Studierende lassen sich komplizierte Themen erklären, Berufstätige formulieren E-Mails in Sekunden, und wer eine Fremdsprache lernt, bekommt rund um die Uhr einen geduldigen Gesprächspartner. Befürworter sprechen von einer Demokratisierung des Wissens: Fähigkeiten, die früher teuer oder exklusiv waren, stehen plötzlich allen zur Verfügung.

Gleichzeitig wachsen die Bedenken. Wenn Maschinen Texte schreiben, die von menschlichen kaum zu unterscheiden sind — wie erkennen wir dann noch, was wahr ist? Datenschützer warnen davor, sensible Informationen in Chatbots einzugeben, und Pädagogen diskutieren, ob Hausaufgaben in ihrer klassischen Form überhaupt noch sinnvoll sind.

Entscheidend dürfte sein, einen souveränen Umgang zu lernen: die Technologie als Werkzeug zu begreifen, dessen Ergebnisse man prüft, statt ihnen blind zu vertrauen. Denn eines kann keine KI ersetzen — das eigene Urteilsvermögen.`,
    glossary: [
      { de: "auswerten", en: "to analyze/evaluate" }, { de: "das Sehverhalten", en: "viewing behavior" },
      { de: "der Befürworter", en: "advocate, supporter" }, { de: "die Bedenken (Pl.)", en: "concerns" },
      { de: "unterscheiden", en: "to distinguish" }, { de: "der Datenschützer", en: "data protection advocate" },
      { de: "souverän", en: "confident, self-assured" }, { de: "das Urteilsvermögen", en: "judgment (ability)" },
    ],
    grammarNotes: [
      { quote: "wessen Navigations-App … / dessen Ergebnisse man prüft", topic: "Genitiv-Relativpronomen", note: "dessen/deren — possessive relative pronouns, classic B2." },
      { quote: "warnen davor, sensible Informationen … einzugeben", topic: "Verb + Präposition + zu-Infinitiv", note: "warnen vor → davor + zu-infinitive clause." },
    ],
    questions: [
      { id: "ki-1", type: "mcq", prompt: "Was ist die Kernaussage des ersten Absatzes?", options: ["KI ist Zukunftsmusik.", "Die meisten nutzen KI täglich, oft unbemerkt.", "Navigation funktioniert ohne KI."], answerIndex: 1 },
      { id: "ki-2", type: "mcq", prompt: "Was meinen Befürworter mit „Demokratisierung des Wissens\"?", options: ["Alle dürfen über KI abstimmen.", "Exklusive Fähigkeiten stehen jetzt allen zur Verfügung.", "Wissen wird billiger verkauft."], answerIndex: 1 },
      { id: "ki-3", type: "mcq", prompt: "Wovor warnen Datenschützer?", options: ["vor teuren Abos", "vor der Eingabe sensibler Daten", "vor langsamen Antworten"], answerIndex: 1 },
      { id: "ki-4", type: "mcq", prompt: "Was kann laut Text keine KI ersetzen?", options: ["das eigene Urteilsvermögen", "Übersetzungen", "E-Mails"], answerIndex: 0 },
    ],
  },
];

export const LISTENINGS: ListeningSeed[] = [
  {
    slug: "im-supermarkt", levelCode: "A1", title: "Im Supermarkt",
    description: "A short conversation at the checkout.",
    dialogue: [
      { speaker: "Kassiererin", text: "Guten Tag! Das macht zusammen zwölf Euro sechzig." },
      { speaker: "Kunde", text: "Einen Moment, bitte... Hier sind fünfzehn Euro." },
      { speaker: "Kassiererin", text: "Danke schön. Und zwei Euro vierzig zurück. Brauchen Sie eine Tüte?" },
      { speaker: "Kunde", text: "Nein, danke. Ich habe eine Tasche dabei." },
      { speaker: "Kassiererin", text: "Sehr gut! Schönen Tag noch!" },
      { speaker: "Kunde", text: "Danke, gleichfalls! Auf Wiedersehen!" },
    ],
    transcript: `Kassiererin: Guten Tag! Das macht zusammen zwölf Euro sechzig.
Kunde: Einen Moment, bitte … Hier sind fünfzehn Euro.
Kassiererin: Danke schön. Und zwei Euro vierzig zurück. Brauchen Sie eine Tüte?
Kunde: Nein, danke. Ich habe eine Tasche dabei.
Kassiererin: Sehr gut! Schönen Tag noch!
Kunde: Danke, gleichfalls! Auf Wiedersehen!`,
    vocabulary: [
      { de: "Das macht zusammen …", en: "That comes to … (total)" },
      { de: "zurück", en: "back (change)" },
      { de: "die Tüte", en: "bag" },
      { de: "gleichfalls", en: "likewise / same to you" },
    ],
    questions: [
      { id: "sm-1", type: "mcq", prompt: "Wie viel kostet der Einkauf?", options: ["12,60 €", "15,00 €", "12,16 €"], answerIndex: 0 },
      { id: "sm-2", type: "mcq", prompt: "Wie viel Geld bekommt der Kunde zurück?", options: ["2,60 €", "2,40 €", "3,40 €"], answerIndex: 1 },
      { id: "sm-3", type: "mcq", prompt: "Braucht der Kunde eine Tüte?", options: ["Ja.", "Nein, er hat eine Tasche.", "Er kauft zwei Tüten."], answerIndex: 1 },
    ],
  },
  {
    slug: "am-bahnhof", levelCode: "A1", title: "Am Bahnhof",
    description: "An announcement and a quick question on the platform.",
    dialogue: [
      { speaker: "Ansage", text: "Achtung an Gleis sieben! Der ICE 573 nach München über Frankfurt fährt heute zwanzig Minuten später ab. Wir bitten um Entschuldigung." },
      { speaker: "Reisende", text: "Entschuldigung, habe ich das richtig verstanden? Der Zug nach München hat Verspätung?" },
      { speaker: "Bahnmitarbeiter", text: "Ja, genau. Zwanzig Minuten. Er fährt jetzt um vierzehn Uhr fünfzig." },
      { speaker: "Reisende", text: "Und von welchem Gleis?" },
      { speaker: "Bahnmitarbeiter", text: "Weiter von Gleis sieben. Da ändert sich nichts." },
      { speaker: "Reisende", text: "Super, vielen Dank!" },
    ],
    transcript: `Ansage: Achtung an Gleis sieben! Der ICE 573 nach München über Frankfurt fährt heute zwanzig Minuten später ab. Wir bitten um Entschuldigung.
Reisende: Entschuldigung, habe ich das richtig verstanden? Der Zug nach München hat Verspätung?
Bahnmitarbeiter: Ja, genau. Zwanzig Minuten. Er fährt jetzt um vierzehn Uhr fünfzig.
Reisende: Und von welchem Gleis?
Bahnmitarbeiter: Weiter von Gleis sieben. Da ändert sich nichts.
Reisende: Super, vielen Dank!`,
    vocabulary: [
      { de: "das Gleis", en: "platform/track" },
      { de: "die Verspätung", en: "delay" },
      { de: "abfahren", en: "to depart" },
      { de: "sich ändern", en: "to change" },
    ],
    questions: [
      { id: "bh-1", type: "mcq", prompt: "Wohin fährt der ICE 573?", options: ["nach Frankfurt", "nach München", "nach Hamburg"], answerIndex: 1 },
      { id: "bh-2", type: "mcq", prompt: "Wie viel Verspätung hat der Zug?", options: ["12 Minuten", "20 Minuten", "50 Minuten"], answerIndex: 1 },
      { id: "bh-3", type: "mcq", prompt: "Von welchem Gleis fährt der Zug?", options: ["Gleis 7", "Gleis 17", "Das ist noch unklar."], answerIndex: 0 },
    ],
  },
  {
    slug: "anruf-beim-arzt", levelCode: "A2", title: "Anruf in der Arztpraxis",
    description: "Making a doctor's appointment on the phone.",
    dialogue: [
      { speaker: "Sprechstundenhilfe", text: "Praxis Doktor Winter, guten Morgen. Was kann ich für Sie tun?" },
      { speaker: "Patient", text: "Guten Morgen, hier ist Ali Demir. Ich habe seit gestern starke Halsschmerzen und Fieber. Kann ich heute noch vorbeikommen?" },
      { speaker: "Sprechstundenhilfe", text: "Moment, ich schaue mal... Heute ist es sehr voll. Können Sie um elf Uhr dreißig kommen?" },
      { speaker: "Patient", text: "Ja, das passt. Muss ich etwas mitbringen?" },
      { speaker: "Sprechstundenhilfe", text: "Nur Ihre Versichertenkarte, bitte. Und kommen Sie mit Maske, wenn Sie Fieber haben." },
      { speaker: "Patient", text: "Mache ich. Vielen Dank, bis später!" },
    ],
    transcript: `Sprechstundenhilfe: Praxis Doktor Winter, guten Morgen. Was kann ich für Sie tun?
Patient: Guten Morgen, hier ist Ali Demir. Ich habe seit gestern starke Halsschmerzen und Fieber. Kann ich heute noch vorbeikommen?
Sprechstundenhilfe: Moment, ich schaue mal … Heute ist es sehr voll. Können Sie um 11:30 Uhr kommen?
Patient: Ja, das passt. Muss ich etwas mitbringen?
Sprechstundenhilfe: Nur Ihre Versichertenkarte, bitte. Und kommen Sie mit Maske, wenn Sie Fieber haben.
Patient: Mache ich. Vielen Dank, bis später!`,
    vocabulary: [
      { de: "die Sprechstundenhilfe", en: "receptionist (doctor's office)" },
      { de: "vorbeikommen", en: "to come by" },
      { de: "Das passt.", en: "That works." },
      { de: "die Versichertenkarte", en: "health insurance card" },
    ],
    questions: [
      { id: "ar-1", type: "mcq", prompt: "Welche Beschwerden hat Herr Demir?", options: ["Kopfschmerzen und Husten", "Halsschmerzen und Fieber", "Bauchschmerzen"], answerIndex: 1 },
      { id: "ar-2", type: "mcq", prompt: "Wann soll er kommen?", options: ["um 11:30 Uhr", "um 11:13 Uhr", "morgen früh"], answerIndex: 0 },
      { id: "ar-3", type: "mcq", prompt: "Was soll er mitbringen?", options: ["sein Rezept", "seine Versichertenkarte", "seinen Ausweis"], answerIndex: 1 },
    ],
  },
  {
    slug: "die-einladung", levelCode: "A2", title: "Die Einladung",
    description: "Two friends plan a birthday party.",
    dialogue: [
      { speaker: "Nina", text: "Hey Jonas! Du, ich mache am Samstag eine kleine Party. Ich werde dreißig!" },
      { speaker: "Jonas", text: "Oh, herzlichen Glückwunsch schon mal! Wann geht es denn los?" },
      { speaker: "Nina", text: "So ab sieben. Wir grillen im Garten, jeder bringt etwas mit. Kannst du vielleicht deinen berühmten Kartoffelsalat machen?" },
      { speaker: "Jonas", text: "Klar, sehr gern! Soll ich sonst noch etwas mitbringen? Getränke vielleicht?" },
      { speaker: "Nina", text: "Getränke habe ich schon. Aber wenn du Musik machen willst - deine Playlists sind immer super." },
      { speaker: "Jonas", text: "Deal! Kartoffelsalat und Musik. Ich freue mich riesig. Bis Samstag!" },
    ],
    transcript: `Nina: Hey Jonas! Du, ich mache am Samstag eine kleine Party. Ich werde dreißig!
Jonas: Oh, herzlichen Glückwunsch schon mal! Wann geht es denn los?
Nina: So ab sieben. Wir grillen im Garten, jeder bringt etwas mit. Kannst du vielleicht deinen berühmten Kartoffelsalat machen?
Jonas: Klar, sehr gern! Soll ich sonst noch etwas mitbringen? Getränke vielleicht?
Nina: Getränke habe ich schon. Aber wenn du Musik machen willst — deine Playlists sind immer super.
Jonas: Deal! Kartoffelsalat und Musik. Ich freue mich riesig. Bis Samstag!`,
    vocabulary: [
      { de: "Herzlichen Glückwunsch!", en: "congratulations / happy birthday" },
      { de: "losgehen", en: "to start" },
      { de: "mitbringen", en: "to bring along" },
      { de: "sich riesig freuen", en: "to be really excited" },
    ],
    questions: [
      { id: "ei-1", type: "mcq", prompt: "Warum macht Nina eine Party?", options: ["Sie zieht um.", "Sie wird 30.", "Sie hat einen neuen Job."], answerIndex: 1 },
      { id: "ei-2", type: "mcq", prompt: "Was soll Jonas mitbringen?", options: ["Getränke", "einen Kuchen", "Kartoffelsalat"], answerIndex: 2 },
      { id: "ei-3", type: "mcq", prompt: "Um wie viel Uhr beginnt die Party?", options: ["ab sieben", "ab sechs", "ab acht"], answerIndex: 0 },
    ],
  },
  {
    slug: "wg-besichtigung", levelCode: "B1", title: "Die WG-Besichtigung",
    description: "A room viewing turns into a WG casting.",
    dialogue: [
      { speaker: "Paul", text: "Hi, du bist bestimmt Sofia? Komm rein! Das Zimmer ist gleich hier links, achtzehn Quadratmeter mit Balkon." },
      { speaker: "Sofia", text: "Wow, schön hell! Und wie hoch ist die Miete genau?" },
      { speaker: "Paul", text: "Vierhundertzwanzig warm, plus einmal im Monat gemeinsame WG-Kasse für Putzmittel und so." },
      { speaker: "Sofia", text: "Klingt fair. Wie läuft das bei euch mit dem Putzen? Gibt es einen Plan?" },
      { speaker: "Paul", text: "Ja, wir wechseln wöchentlich: Küche, Bad, Flur. Und einmal im Monat kochen wir zusammen. Kein Muss, aber eigentlich das Beste an der WG." },
      { speaker: "Sofia", text: "Das klingt richtig gut. Ich arbeite im Schichtdienst als Krankenpflegerin - stört euch das, wenn ich manchmal früh raus muss?" },
      { speaker: "Paul", text: "Überhaupt nicht, ich habe auch früh Vorlesungen. Also, wir melden uns bis Freitag, okay?" },
    ],
    transcript: `Paul: Hi, du bist bestimmt Sofia? Komm rein! Das Zimmer ist gleich hier links, 18 Quadratmeter mit Balkon.
Sofia: Wow, schön hell! Und wie hoch ist die Miete genau?
Paul: 420 warm, plus einmal im Monat gemeinsame WG-Kasse für Putzmittel und so.
Sofia: Klingt fair. Wie läuft das bei euch mit dem Putzen? Gibt es einen Plan?
Paul: Ja, wir wechseln wöchentlich: Küche, Bad, Flur. Und einmal im Monat kochen wir zusammen. Kein Muss, aber eigentlich das Beste an der WG.
Sofia: Das klingt richtig gut. Ich arbeite im Schichtdienst als Krankenpflegerin — stört euch das, wenn ich manchmal früh raus muss?
Paul: Überhaupt nicht, ich habe auch früh Vorlesungen. Also, wir melden uns bis Freitag, okay?`,
    vocabulary: [
      { de: "die Besichtigung", en: "viewing" },
      { de: "warm (Miete)", en: "rent incl. utilities" },
      { de: "der Schichtdienst", en: "shift work" },
      { de: "sich melden", en: "to get in touch" },
    ],
    questions: [
      { id: "wgb-1", type: "mcq", prompt: "Wie groß ist das Zimmer?", options: ["8 m²", "18 m²", "80 m²"], answerIndex: 1 },
      { id: "wgb-2", type: "mcq", prompt: "Was kostet das Zimmer warm?", options: ["420 €", "402 €", "240 €"], answerIndex: 0 },
      { id: "wgb-3", type: "mcq", prompt: "Wie oft wechselt der Putzplan?", options: ["täglich", "wöchentlich", "monatlich"], answerIndex: 1 },
      { id: "wgb-4", type: "mcq", prompt: "Als was arbeitet Sofia?", options: ["als Studentin", "als Krankenpflegerin", "als Köchin"], answerIndex: 1 },
    ],
  },
  {
    slug: "radio-umfrage-handy", levelCode: "B1", title: "Radio-Umfrage: Handyfasten",
    description: "A street survey about giving up the smartphone for a week.",
    dialogue: [
      { speaker: "Reporterin", text: "Guten Tag! Wir fragen heute Passanten: Könnten Sie eine Woche ohne Smartphone leben? Sie zum Beispiel?" },
      { speaker: "Mann", text: "Eine Woche? Niemals! Ich brauche das Handy für die Arbeit, für Termine, fürs Navi. Ohne wäre ich komplett aufgeschmissen." },
      { speaker: "Reporterin", text: "Und Sie? Wie sehen Sie das?" },
      { speaker: "Frau", text: "Ich habe das tatsächlich letztes Jahr ausprobiert. Die ersten zwei Tage waren schrecklich, ehrlich gesagt. Aber danach habe ich wieder mehr gelesen und besser geschlafen." },
      { speaker: "Reporterin", text: "Würden Sie es wieder machen?" },
      { speaker: "Frau", text: "Auf jeden Fall. Einmal im Jahr eine Woche - das ist wie Urlaub für den Kopf." },
    ],
    transcript: `Reporterin: Guten Tag! Wir fragen heute Passanten: Könnten Sie eine Woche ohne Smartphone leben? Sie zum Beispiel?
Mann: Eine Woche? Niemals! Ich brauche das Handy für die Arbeit, für Termine, fürs Navi. Ohne wäre ich komplett aufgeschmissen.
Reporterin: Und Sie? Wie sehen Sie das?
Frau: Ich habe das tatsächlich letztes Jahr ausprobiert. Die ersten zwei Tage waren schrecklich, ehrlich gesagt. Aber danach habe ich wieder mehr gelesen und besser geschlafen.
Reporterin: Würden Sie es wieder machen?
Frau: Auf jeden Fall. Einmal im Jahr eine Woche — das ist wie Urlaub für den Kopf.`,
    vocabulary: [
      { de: "die Umfrage", en: "survey" },
      { de: "aufgeschmissen sein", en: "to be lost/helpless (colloquial)" },
      { de: "ausprobieren", en: "to try out" },
      { de: "ehrlich gesagt", en: "honestly speaking" },
    ],
    questions: [
      { id: "ru-1", type: "mcq", prompt: "Was ist die Frage der Reporterin?", options: ["Welches Handy haben Sie?", "Könnten Sie eine Woche ohne Smartphone leben?", "Wie teuer ist Ihr Handyvertrag?"], answerIndex: 1 },
      { id: "ru-2", type: "mcq", prompt: "Warum kann der Mann nicht verzichten?", options: ["Er spielt gern.", "Er braucht es für Arbeit, Termine und Navigation.", "Er hat kein Festnetz."], answerIndex: 1 },
      { id: "ru-3", type: "mcq", prompt: "Wie waren die ersten zwei Tage für die Frau?", options: ["schrecklich", "entspannt", "langweilig"], answerIndex: 0 },
      { id: "ru-4", type: "mcq", prompt: "Was hat sich bei der Frau verbessert?", options: ["ihre Arbeit", "Lesen und Schlaf", "ihr Deutsch"], answerIndex: 1 },
    ],
  },
  {
    slug: "vorstellungsgespraech", levelCode: "B2", title: "Das Vorstellungsgespräch",
    description: "Excerpt from a job interview for a nursing apprenticeship.",
    dialogue: [
      { speaker: "Frau Weber", text: "Frau El Amrani, schön, dass Sie da sind. Erzählen Sie doch zuerst ein bisschen über sich." },
      { speaker: "Sara", text: "Gern. Ich bin sechsundzwanzig, komme aus Casablanca und lebe seit zwei Jahren in Deutschland. Ich habe in Marokko drei Jahre im Einzelhandel gearbeitet, aber während eines Praktikums im Seniorenheim habe ich gemerkt: Die Pflege ist genau mein Bereich." },
      { speaker: "Frau Weber", text: "Was genau hat Sie an der Pflege überzeugt?" },
      { speaker: "Sara", text: "Der direkte Kontakt mit Menschen. Im Praktikum habe ich eine Bewohnerin betreut, die anfangs kaum gesprochen hat. Nach ein paar Wochen hat sie mich jeden Morgen mit Namen begrüßt. Solche Momente kann kein anderer Beruf bieten." },
      { speaker: "Frau Weber", text: "Die Ausbildung ist anspruchsvoll, auch sprachlich. Wie schätzen Sie Ihr Deutsch ein?" },
      { speaker: "Sara", text: "Ich habe das B-eins-Zertifikat und lerne jeden Tag weiter. Wenn ich etwas nicht verstehe, frage ich sofort nach - in der Pflege kann ein Missverständnis ja ernste Folgen haben. Ehrlichkeit ist mir da wichtiger als Perfektion." },
      { speaker: "Frau Weber", text: "Eine sehr gute Einstellung. Haben Sie noch Fragen an uns?" },
      { speaker: "Sara", text: "Ja, zwei: Wie werden die Auszubildenden hier begleitet? Und gibt es Unterstützung bei der Vorbereitung auf die Abschlussprüfung?" },
    ],
    transcript: `Frau Weber: Frau El Amrani, schön, dass Sie da sind. Erzählen Sie doch zuerst ein bisschen über sich.
Sara: Gern. Ich bin 26, komme aus Casablanca und lebe seit zwei Jahren in Deutschland. Ich habe in Marokko drei Jahre im Einzelhandel gearbeitet, aber während eines Praktikums im Seniorenheim habe ich gemerkt: Die Pflege ist genau mein Bereich.
Frau Weber: Was genau hat Sie an der Pflege überzeugt?
Sara: Der direkte Kontakt mit Menschen. Im Praktikum habe ich eine Bewohnerin betreut, die anfangs kaum gesprochen hat. Nach ein paar Wochen hat sie mich jeden Morgen mit Namen begrüßt. Solche Momente kann kein anderer Beruf bieten.
Frau Weber: Die Ausbildung ist anspruchsvoll, auch sprachlich. Wie schätzen Sie Ihr Deutsch ein?
Sara: Ich habe das B1-Zertifikat und lerne jeden Tag weiter. Wenn ich etwas nicht verstehe, frage ich sofort nach — in der Pflege kann ein Missverständnis ja ernste Folgen haben. Ehrlichkeit ist mir da wichtiger als Perfektion.
Frau Weber: Eine sehr gute Einstellung. Haben Sie noch Fragen an uns?
Sara: Ja, zwei: Wie werden die Auszubildenden hier begleitet? Und gibt es Unterstützung bei der Vorbereitung auf die Abschlussprüfung?`,
    vocabulary: [
      { de: "der Einzelhandel", en: "retail" },
      { de: "betreuen", en: "to care for" },
      { de: "einschätzen", en: "to assess" },
      { de: "das Missverständnis", en: "misunderstanding" },
      { de: "die Einstellung", en: "attitude" },
    ],
    questions: [
      { id: "vg-1", type: "mcq", prompt: "Wo hat Sara vorher gearbeitet?", options: ["in einem Krankenhaus", "im Einzelhandel", "in einer Schule"], answerIndex: 1 },
      { id: "vg-2", type: "mcq", prompt: "Was hat sie von der Pflege überzeugt?", options: ["das Gehalt", "der Kontakt mit Menschen", "die Arbeitszeiten"], answerIndex: 1 },
      { id: "vg-3", type: "mcq", prompt: "Wie geht Sara mit Verständnisproblemen um?", options: ["Sie fragt sofort nach.", "Sie tut so, als ob sie versteht.", "Sie benutzt eine App."], answerIndex: 0 },
      { id: "vg-4", type: "mcq", prompt: "Wie viele Fragen stellt Sara am Ende?", options: ["keine", "eine", "zwei"], answerIndex: 2 },
    ],
  },
  {
    slug: "podcast-nachhaltigkeit", levelCode: "B2", title: "Podcast: Nachhaltig leben — aber wie?",
    description: "Two podcast hosts debate individual vs. political climate responsibility.",
    dialogue: [
      { speaker: "Max", text: "Willkommen zurück beim Zukunftspodcast! Heute streiten wir über eine Frage, die viele beschäftigt: Bringt es überhaupt etwas, wenn ich als Einzelner auf Plastik verzichte und weniger fliege?" },
      { speaker: "Julia", text: "Ich sage klar: Ja! Natürlich rettet mein Jutebeutel nicht allein das Klima. Aber Konsum ist ein Signal. Wenn Millionen Menschen weniger Fleisch kaufen, verändert das ganze Märkte - das haben wir bei den Milchalternativen doch gesehen." },
      { speaker: "Max", text: "Da widerspreche ich dir. Diese Fokussierung auf den Einzelnen lenkt doch nur ab! Ein Großteil der Emissionen stammt von wenigen Konzernen. Solange Politik keine klaren Regeln setzt, ist mein Verzicht ein Tropfen auf den heißen Stein." },
      { speaker: "Julia", text: "Einverstanden, ohne politische Rahmenbedingungen geht es nicht. Aber wer wählt denn die Politik? Und wer akzeptiert neue Gesetze eher - Menschen, die selbst schon nachhaltig leben, oder Menschen, denen alles egal ist?" },
      { speaker: "Max", text: "Hm, das ist tatsächlich ein Punkt. Vielleicht ist es kein Entweder-oder, sondern ein Sowohl-als-auch: privat anfangen, politisch weiterdenken." },
      { speaker: "Julia", text: "Schön gesagt! Und genau darüber sprechen wir nach der Pause weiter." },
    ],
    transcript: `Max: Willkommen zurück beim Zukunftspodcast! Heute streiten wir über eine Frage, die viele beschäftigt: Bringt es überhaupt etwas, wenn ich als Einzelner auf Plastik verzichte und weniger fliege?
Julia: Ich sage klar: Ja! Natürlich rettet mein Jutebeutel nicht allein das Klima. Aber Konsum ist ein Signal. Wenn Millionen Menschen weniger Fleisch kaufen, verändert das ganze Märkte — das haben wir bei den Milchalternativen doch gesehen.
Max: Da widerspreche ich dir. Diese Fokussierung auf den Einzelnen lenkt doch nur ab! Ein Großteil der Emissionen stammt von wenigen Konzernen. Solange Politik keine klaren Regeln setzt, ist mein Verzicht ein Tropfen auf den heißen Stein.
Julia: Einverstanden, ohne politische Rahmenbedingungen geht es nicht. Aber wer wählt denn die Politik? Und wer akzeptiert neue Gesetze eher — Menschen, die selbst schon nachhaltig leben, oder Menschen, denen alles egal ist?
Max: Hm, das ist tatsächlich ein Punkt. Vielleicht ist es kein Entweder-oder, sondern ein Sowohl-als-auch: privat anfangen, politisch weiterdenken.
Julia: Schön gesagt! Und genau darüber sprechen wir nach der Pause weiter.`,
    vocabulary: [
      { de: "verzichten auf", en: "to do without" },
      { de: "ablenken von", en: "to distract from" },
      { de: "der Konzern", en: "corporation" },
      { de: "ein Tropfen auf den heißen Stein", en: "a drop in the ocean (idiom)" },
      { de: "die Rahmenbedingungen", en: "framework conditions" },
    ],
    questions: [
      { id: "pn-1", type: "mcq", prompt: "Worüber diskutieren Max und Julia?", options: ["über Podcasts", "ob individueller Verzicht etwas bringt", "über Flugpreise"], answerIndex: 1 },
      { id: "pn-2", type: "mcq", prompt: "Welches Beispiel nennt Julia für Marktveränderung?", options: ["Elektroautos", "Milchalternativen", "Solaranlagen"], answerIndex: 1 },
      { id: "pn-3", type: "mcq", prompt: "Was kritisiert Max an der Fokussierung auf Einzelne?", options: ["Sie lenkt von den Konzernen ab.", "Sie ist zu teuer.", "Sie ist zu politisch."], answerIndex: 0 },
      { id: "pn-4", type: "mcq", prompt: "Worauf einigen sich beide am Ende?", options: ["Nur Politik hilft.", "Nur Konsum hilft.", "Beides zusammen: privat UND politisch."], answerIndex: 2 },
    ],
  },
];
