import type { SpeakingSeed, WritingSeed } from "./types";

export const SPEAKINGS: SpeakingSeed[] = [
  {
    slug: "sich-vorstellen", levelCode: "A1", title: "Sich vorstellen", type: "CONVERSATION",
    description: "Your 60-second self-introduction — the foundation of every exam and every new contact.",
    prompt: "Stell dich vor! Sprich **60 Sekunden** über dich:\n\n- Wie heißt du? Woher kommst du?\n- Wo wohnst du?\n- Was machst du beruflich / Was studierst du?\n- Welche Sprachen sprichst du?\n- Was ist dein Hobby?\n\nSprich laut, nimm dich auf und hör es dir an. Dann noch einmal — flüssiger!",
    phrases: [
      { label: "Starter", items: ["Ich heiße … / Mein Name ist …", "Ich komme aus … und wohne jetzt in …", "Ich bin … Jahre alt.", "Von Beruf bin ich … / Ich studiere …"] },
      { label: "Hobbys & Sprachen", items: ["In meiner Freizeit … ich gern …", "Ich spreche … und ein bisschen …", "Mein Hobby ist …"] },
    ],
    tips: ["Learn your introduction as ONE flowing text — it's the first question in every exam and interview.", "Speak slower than feels natural. Clarity beats speed.", "Record yourself weekly — you'll hear your own progress."],
  },
  {
    slug: "im-cafe-rollenspiel", levelCode: "A1", title: "Rollenspiel: Im Café", type: "ROLEPLAY",
    description: "Order drinks and food, ask for the bill — play both roles.",
    prompt: "Spiele die Szene im Café. Übe **beide Rollen**: einmal als Gast, einmal als Kellner. Ziel: bestellen, nach der Rechnung fragen, bezahlen — alles auf Deutsch, ohne Pause.",
    dialogue: [
      { speaker: "Kellner", de: "Guten Tag! Was darf es sein?", en: "Hello! What can I get you?" },
      { speaker: "Gast", de: "Ich hätte gern einen Cappuccino und ein Stück Apfelkuchen, bitte.", en: "I'd like a cappuccino and a piece of apple cake, please." },
      { speaker: "Kellner", de: "Gern. Kommt sofort!", en: "Gladly. Coming right up!" },
      { speaker: "Gast", de: "Entschuldigung, ich möchte bitte zahlen.", en: "Excuse me, I'd like to pay, please." },
      { speaker: "Kellner", de: "Natürlich. Das macht sechs Euro neunzig.", en: "Of course. That's 6.90 euros." },
      { speaker: "Gast", de: "Hier sind acht Euro — stimmt so!", en: "Here's eight euros — keep the change!" },
    ],
    phrases: [
      { label: "Bestellen", items: ["Ich hätte gern …", "Für mich bitte …", "Was können Sie empfehlen?"] },
      { label: "Bezahlen", items: ["Die Rechnung, bitte!", "Zusammen oder getrennt? — Zusammen, bitte.", "Stimmt so! (keep the change)"] },
    ],
    tips: ["'Stimmt so' while handing over money = classic German tipping.", "Practice with different items until the structure is automatic."],
  },
  {
    slug: "wegbeschreibung-ueben", levelCode: "A2", title: "Rollenspiel: Nach dem Weg fragen", type: "ROLEPLAY",
    description: "Ask for directions and give them — both sides of the tourist conversation.",
    prompt: "Du bist neu in der Stadt und suchst: 1) den Bahnhof, 2) eine Apotheke, 3) einen Geldautomaten. Spiele beide Rollen — und beschreibe danach den echten Weg von deiner Haustür zum nächsten Supermarkt.",
    dialogue: [
      { speaker: "Tourist", de: "Entschuldigung, wie komme ich zum Bahnhof?", en: "Excuse me, how do I get to the station?" },
      { speaker: "Passant", de: "Das ist ganz einfach: Gehen Sie geradeaus bis zur Ampel und dann rechts.", en: "That's easy: go straight to the traffic light and then right." },
      { speaker: "Tourist", de: "Also geradeaus und an der Ampel rechts?", en: "So straight ahead and right at the light?" },
      { speaker: "Passant", de: "Genau. Nach zweihundert Metern sind Sie da. Sie können es nicht verfehlen!", en: "Exactly. After 200 meters you're there. You can't miss it!" },
      { speaker: "Tourist", de: "Super, vielen Dank für Ihre Hilfe!", en: "Great, thanks a lot for your help!" },
    ],
    phrases: [
      { label: "Fragen", items: ["Wie komme ich zum/zur …?", "Ist es weit von hier?", "Kann ich zu Fuß gehen?"] },
      { label: "Beschreiben", items: ["Gehen Sie geradeaus / links / rechts.", "an der Ampel / Kreuzung", "auf der linken/rechten Seite", "Sie können es nicht verfehlen!"] },
    ],
    tips: ["Always repeat the directions back — verification + speaking practice in one.", "zum (der/das) vs. zur (die): zum Bahnhof, zur Apotheke."],
  },
  {
    slug: "telefon-termin", levelCode: "A2", title: "Challenge: Der Telefon-Termin", type: "CHALLENGE",
    description: "The phone call challenge — no hands, no notes, just your voice.",
    prompt: "**Die Challenge:** Simuliere einen Anruf beim Zahnarzt. Ohne Notizen musst du:\n\n1. Dich mit Namen melden\n2. Einen Termin für nächste Woche machen\n3. Den ersten Vorschlag ablehnen (du kannst nicht!)\n4. Einen neuen Termin akzeptieren und wiederholen\n5. Dich höflich verabschieden\n\nSprich BEIDE Rollen laut. Profi-Level: Nimm dich auf und zähl deine Pausen — Ziel: unter fünf.",
    phrases: [
      { label: "Am Telefon", items: ["Guten Tag, mein Name ist … Ich hätte gern einen Termin.", "Passt es Ihnen am … um …?", "Da kann ich leider nicht. Geht es auch am …?", "Also am Donnerstag um 14 Uhr — vielen Dank!", "Auf Wiederhören!"] },
    ],
    tips: ["Phone German is harder — no faces, no hands. That's exactly why it levels you up.", "'Auf Wiederhören' (not Wiedersehen) on the phone!", "Write the appointment down as you say it — like in real life."],
  },
  {
    slug: "meinung-verteidigen", levelCode: "B1", title: "Deine Meinung verteidigen", type: "CONVERSATION",
    description: "State an opinion, give two reasons, handle one counter-argument.",
    prompt: "Wähle ein Thema und sprich **90 Sekunden**:\n\n- *Stadt oder Land — wo lebt man besser?*\n- *Sind soziale Medien gut oder schlecht für Freundschaften?*\n- *Sollte man mit 16 wählen dürfen?*\n\nStruktur: Meinung → 2 Gründe (weil!) → 1 Beispiel → Gegenargument nennen und entkräften → Fazit.",
    phrases: [
      { label: "Struktur-Bausteine", items: ["Meiner Meinung nach …", "Der wichtigste Grund ist, dass …", "Ein Beispiel dafür: …", "Natürlich sagen manche, dass … Aber ich denke, …", "Deshalb bin ich überzeugt, dass …"] },
    ],
    tips: ["This exact structure carries the B1 oral exam presentation.", "Force yourself to use at least three weil/dass clauses.", "90 seconds feels long — a timer makes it real."],
  },
  {
    slug: "b1-praesentation", levelCode: "B1", title: "Challenge: Die 3-Minuten-Präsentation", type: "CHALLENGE",
    description: "The full B1 exam presentation format — topic, structure, opinion.",
    prompt: "**Prüfungssimulation:** Halte eine 3-Minuten-Präsentation zum Thema *„Mein Traumberuf\"* (oder ein eigenes Thema).\n\nPflicht-Struktur wie in der Prüfung:\n1. Einleitung: Thema vorstellen\n2. Persönliche Erfahrungen\n3. Situation in deinem Heimatland\n4. Vor- und Nachteile\n5. Deine Meinung + Schluss\n\nNimm dich auf. Höre dir die Aufnahme an. Wiederhole die schwächste Stelle.",
    phrases: [
      { label: "Präsentations-Gerüst", items: ["Ich möchte heute über … sprechen.", "Aus eigener Erfahrung kann ich sagen, dass …", "In meinem Heimatland ist es so, dass …", "Einerseits …, andererseits …", "Zusammenfassend kann ich sagen, dass …", "Vielen Dank fürs Zuhören!"] },
    ],
    tips: ["The 5-part structure IS the official Goethe B1 format — examiners tick boxes for each part.", "3 minutes ≈ 300 words ≈ 20 sentences. That's just 4 sentences per part!", "Do it three days in a row with different topics — by day three it's automatic."],
  },
  {
    slug: "interview-simulation", levelCode: "B2", title: "Interview-Simulation: Vorstellungsgespräch", type: "INTERVIEW",
    description: "The eight standard interview questions — answer them under realistic pressure.",
    prompt: "Simuliere ein Vorstellungsgespräch für deinen Wunschjob. Beantworte diese Fragen **laut und ohne Notizen** (max. 90 Sekunden pro Antwort):\n\n1. Erzählen Sie etwas über sich.\n2. Warum haben Sie sich bei uns beworben?\n3. Was sind Ihre Stärken — mit Beispiel?\n4. Nennen Sie eine Schwäche.\n5. Wo sehen Sie sich in fünf Jahren?\n\nDie kompletten Musterantworten findest du im Ausbildung-Bereich.",
    dialogue: [
      { speaker: "Personalerin", de: "Erzählen Sie doch zuerst ein bisschen über sich.", en: "First tell us a bit about yourself." },
      { speaker: "Du", de: "Gern! Mein Name ist …, ich bin … Jahre alt und komme aus … Seit … lerne ich Deutsch, weil …", en: "Gladly! My name is…, I'm … years old and from… I've been learning German since…, because…" },
      { speaker: "Personalerin", de: "Und warum möchten Sie genau bei uns arbeiten?", en: "And why do you want to work with us specifically?" },
      { speaker: "Du", de: "Ihr Unternehmen überzeugt mich, weil … Außerdem passt die Stelle zu meinen Stärken: …", en: "Your company convinces me because… Besides, the position fits my strengths:…" },
    ],
    phrases: [
      { label: "Power-Phrasen", items: ["Eine meiner Stärken ist … — zum Beispiel habe ich …", "Daran arbeite ich, indem ich …", "Ich kann mir gut vorstellen, langfristig …", "Ich hätte noch zwei Fragen an Sie."] },
    ],
    tips: ["Answer with STAR: Situation → Task → Action → Result.", "Prepare 2 questions to ask back — it signals real interest.", "Dress rehearsal: do the whole thing standing up, in interview clothes. It changes your voice."],
  },
  {
    slug: "debatte-pro-contra", levelCode: "B2", title: "Challenge: Die Blitz-Debatte", type: "CHALLENGE",
    description: "Argue BOTH sides of a controversial topic — 2 minutes each.",
    prompt: "**Die härteste Übung im Programm:** Wähle ein Thema und argumentiere **2 Minuten PRO, dann 2 Minuten CONTRA** — mit voller Überzeugung auf beiden Seiten:\n\n- *Sollten Innenstädte autofrei werden?*\n- *Homeoffice für alle — Pflicht oder Wahlfreiheit?*\n- *Sollte künstliche Intelligenz in Schulen erlaubt sein?*\n\nWer beide Seiten überzeugend vertreten kann, gewinnt jede B2-Prüfungsdiskussion.",
    phrases: [
      { label: "Pro-Werkzeuge", items: ["Dafür spricht vor allem, dass …", "Ein entscheidender Vorteil ist …", "Studien zeigen, dass …"] },
      { label: "Contra-Werkzeuge", items: ["Dagegen lässt sich einwenden, dass …", "Man darf nicht vergessen, dass …", "Die Risiken überwiegen, weil …"] },
      { label: "Konzedieren", items: ["Es stimmt zwar, dass …, aber …", "Zugegeben, … — dennoch …"] },
    ],
    tips: ["Arguing against your own opinion builds the deepest fluency — you can't rely on passion, only on language.", "Record both halves. Which side sounded more convincing? Why?"],
  },
];

export const WRITINGS: WritingSeed[] = [
  {
    slug: "erste-email", levelCode: "A1", title: "Deine erste E-Mail", type: "EMAIL",
    prompt: "Schreib eine kurze E-Mail an deine neue Tandempartnerin Julia (ca. **30–40 Wörter**):\n\n- Begrüße sie\n- Stell dich vor (Name, Land, Stadt)\n- Sag, welche Sprachen du sprichst\n- Verabschiede dich",
    minWords: 30,
    template: {
      sections: [
        { label: "Anrede", example: "Liebe Julia," },
        { label: "Vorstellung", example: "ich heiße … und komme aus … Ich wohne in …" },
        { label: "Sprachen", example: "Ich spreche … und lerne Deutsch." },
        { label: "Gruß", example: "Viele Grüße\n[Name]" },
      ],
    },
    sampleAnswer: "Liebe Julia,\n\nich heiße Omar und komme aus Marokko. Ich wohne jetzt in Köln. Ich spreche Arabisch, Französisch und ein bisschen Deutsch. Ich lerne jeden Tag!\n\nViele Grüße\nOmar",
    tips: ["Informal email: Liebe/Lieber + name, comma, then lowercase continuation.", "Keep sentences short — subject, verb, done.", "Count your words at the end."],
  },
  {
    slug: "steckbrief-nachbarschaft", levelCode: "A1", title: "Nachricht an die Nachbarn", type: "MESSAGE",
    prompt: "Du bist neu im Haus. Schreib eine kurze Nachricht für das schwarze Brett (ca. **30 Wörter**):\n\n- Wer bist du?\n- Seit wann wohnst du hier?\n- Eine freundliche Schlussformel",
    minWords: 25,
    template: {
      sections: [
        { label: "Überschrift", example: "Hallo, liebe Nachbarn!" },
        { label: "Info", example: "Ich heiße … und wohne seit … in der Wohnung Nr. …" },
        { label: "Schluss", example: "Ich freue mich, Sie kennenzulernen!" },
      ],
    },
    sampleAnswer: "Hallo, liebe Nachbarn!\n\nIch heiße Sara und wohne seit Montag in der Wohnung Nr. 12. Ich komme aus Marokko und lerne Deutsch. Ich freue mich, Sie alle kennenzulernen!\n\nHerzliche Grüße\nSara",
    tips: ["Neighbors = polite Sie form.", "seit + Dativ: seit Montag, seit einer Woche."],
  },
  {
    slug: "einladung-absagen", levelCode: "A2", title: "Eine Einladung absagen", type: "EMAIL",
    prompt: "Dein Freund Paul hat dich zu seiner Geburtstagsparty am Samstag eingeladen — aber du kannst nicht kommen. Schreib eine E-Mail (ca. **40–50 Wörter**):\n\n- Bedanke dich für die Einladung\n- Sag ab und nenne einen Grund (weil …)\n- Schlag ein alternatives Treffen vor\n- Gratuliere ihm",
    minWords: 40,
    template: {
      sections: [
        { label: "Dank", example: "vielen Dank für deine Einladung!" },
        { label: "Absage + Grund", example: "Leider kann ich nicht kommen, weil …" },
        { label: "Alternative", example: "Können wir nächste Woche …?" },
        { label: "Glückwunsch", example: "Ich wünsche dir eine tolle Party!" },
      ],
      phrases: [{ label: "Absage-Redemittel", items: ["Leider klappt es nicht, weil …", "Schade, aber …", "Es tut mir sehr leid."] }],
    },
    sampleAnswer: "Lieber Paul,\n\nvielen Dank für deine Einladung! Leider kann ich am Samstag nicht kommen, weil ich arbeiten muss. Das tut mir wirklich leid!\n\nKönnen wir nächste Woche zusammen essen gehen? Ich lade dich ein.\n\nIch wünsche dir eine tolle Party — feier schön!\n\nViele Grüße\nOmar",
    tips: ["The weil-clause with verb at the end is what the corrector looks for.", "Always soften a refusal: leider, es tut mir leid, schade.", "Proposing an alternative turns a 'no' into friendship maintenance."],
  },
  {
    slug: "urlaubsgruesse", levelCode: "A2", title: "Urlaubsgrüße", type: "MESSAGE",
    prompt: "Du bist im Urlaub. Schreib deiner Deutschlehrerin eine Postkarte (ca. **40–50 Wörter**):\n\n- Wo bist du und wie ist das Wetter?\n- Was hast du schon gemacht? (Perfekt!)\n- Was machst du morgen?\n- Grüße zum Schluss",
    minWords: 40,
    template: {
      sections: [
        { label: "Ort & Wetter", example: "viele Grüße aus …! Das Wetter ist …" },
        { label: "Erlebnisse (Perfekt)", example: "Gestern habe ich … / Wir sind … gefahren." },
        { label: "Plan", example: "Morgen möchte ich …" },
        { label: "Gruß", example: "Herzliche Grüße / Bis bald!" },
      ],
    },
    sampleAnswer: "Liebe Frau Müller,\n\nviele Grüße aus Lissabon! Das Wetter ist super — jeden Tag Sonne. Gestern habe ich die Altstadt besichtigt und am Abend sind wir ans Meer gefahren. Das Essen ist fantastisch!\n\nMorgen möchte ich mit der berühmten Tram 28 fahren.\n\nHerzliche Grüße\nIhre Aylin",
    tips: ["Perfect place to show off your Perfekt — mix haben and sein.", "Teacher = Sie form, 'Liebe Frau …' works well."],
  },
  {
    slug: "beschwerde-vermieter", levelCode: "B1", title: "Beschwerde an den Vermieter", type: "LETTER",
    prompt: "Seit zwei Wochen funktioniert die Heizung in deiner Wohnung nicht richtig. Du hast schon zweimal angerufen — nichts ist passiert. Schreib einen halbformellen Brief an deinen Vermieter Herrn Lange (ca. **80–100 Wörter**):\n\n- Beschreibe das Problem und seit wann es besteht\n- Erwähne deine bisherigen Anrufe\n- Fordere eine Reparatur mit Frist\n- Bleib höflich, aber bestimmt",
    minWords: 80,
    template: {
      sections: [
        { label: "Betreff", example: "Betreff: Defekte Heizung in der Wohnung Musterstraße 12" },
        { label: "Anrede", example: "Sehr geehrter Herr Lange," },
        { label: "Problem", example: "seit dem … funktioniert … nicht. Trotz zweier Anrufe …" },
        { label: "Forderung", example: "Ich bitte Sie, … bis zum … zu reparieren." },
        { label: "Gruß", example: "Mit freundlichen Grüßen" },
      ],
      phrases: [{ label: "Beschwerde-Redemittel", items: ["Leider muss ich Ihnen mitteilen, dass …", "Trotz mehrmaliger Anrufe …", "Ich bitte Sie dringend, …", "Sollte bis zum … nichts passieren, …"] }],
    },
    sampleAnswer: "Betreff: Defekte Heizung — Wohnung Musterstraße 12\n\nSehr geehrter Herr Lange,\n\nleider muss ich Ihnen mitteilen, dass die Heizung in meiner Wohnung seit dem 10. Januar nicht richtig funktioniert. Die Temperatur liegt abends nur bei 16 Grad.\n\nIch habe Sie deswegen bereits zweimal telefonisch kontaktiert, aber bisher ist leider nichts passiert. Da es draußen immer kälter wird, bitte ich Sie dringend, die Heizung bis spätestens 25. Januar reparieren zu lassen.\n\nFür Rückfragen erreichen Sie mich unter 0176 1234567.\n\nMit freundlichen Grüßen\nSara El Amrani",
    tips: ["Semi-formal complaint = the classic B1 exam writing task.", "Structure: problem → history → demand with deadline.", "'bitte ich Sie dringend' = firm but polite. Perfect register."],
  },
  {
    slug: "forumsbeitrag-medien", levelCode: "B1", title: "Forumsbeitrag: Kinder & Smartphones", type: "ESSAY",
    prompt: "In einem Online-Forum wird diskutiert: *„Sollten Kinder unter 12 ein eigenes Smartphone haben?\"* Schreib einen Beitrag (ca. **80–100 Wörter**):\n\n- Deine Meinung mit Begründung\n- Ein Beispiel aus deiner Erfahrung\n- Geh auf ein Gegenargument ein\n- Fazit",
    minWords: 80,
    template: {
      sections: [
        { label: "Einstieg + Meinung", example: "Meiner Meinung nach …" },
        { label: "Begründung + Beispiel", example: "…, weil … Zum Beispiel …" },
        { label: "Gegenargument", example: "Natürlich sagen viele, dass … Aber …" },
        { label: "Fazit", example: "Zusammenfassend denke ich, dass …" },
      ],
    },
    sampleAnswer: "Meiner Meinung nach brauchen Kinder unter 12 kein eigenes Smartphone. Der wichtigste Grund ist, dass sie die Risiken im Internet noch nicht einschätzen können.\n\nEin Beispiel aus meiner Familie: Mein Neffe ist zehn und wollte unbedingt ein Handy, weil „alle eins haben\". Meine Schwester hat ihm stattdessen ein einfaches Telefon ohne Internet gekauft — und er ist trotzdem glücklich.\n\nNatürlich argumentieren viele Eltern mit der Sicherheit: Sie wollen ihr Kind erreichen können. Das verstehe ich, aber dafür reicht ein einfaches Telefon völlig aus.\n\nZusammenfassend finde ich: Smartphone ja — aber erst ab der weiterführenden Schule.",
    tips: ["The forum post is a standard telc B1 task — this structure scores full points.", "One einerseits/andererseits or a concession ('Das verstehe ich, aber…') is mandatory for a top score."],
  },
  {
    slug: "anschreiben-ausbildung", levelCode: "B2", title: "Anschreiben für eine Ausbildung", type: "EXAM_TASK",
    prompt: "Bewirb dich um einen Ausbildungsplatz als Pflegefachkraft (oder einen Beruf deiner Wahl) bei der Klinik Sonnenberg. Schreib das Anschreiben (ca. **150–180 Wörter**):\n\n- Bezug zur Stellenanzeige\n- Deine Motivation für den Beruf\n- Relevante Erfahrungen und Stärken (mit Beleg!)\n- Sprachkenntnisse und Verfügbarkeit\n- Selbstbewusster Schluss",
    minWords: 150,
    template: {
      sections: [
        { label: "Betreff", example: "Bewerbung um einen Ausbildungsplatz als Pflegefachkraft ab 01.09.2026" },
        { label: "Einstieg", example: "mit großem Interesse habe ich Ihre Anzeige auf … gelesen, denn …" },
        { label: "Warum ich?", example: "Während meines Praktikums bei … habe ich gelernt, …" },
        { label: "Warum Sie?", example: "Ihre Klinik überzeugt mich durch …" },
        { label: "Schluss", example: "Über die Einladung zu einem persönlichen Gespräch freue ich mich sehr." },
      ],
      phrases: [{ label: "Profi-Vokabular", items: ["Verantwortung übernehmen", "Erfahrungen sammeln", "zur Verfügung stehen", "einen Beitrag leisten"] }],
    },
    sampleAnswer: "Betreff: Bewerbung um einen Ausbildungsplatz als Pflegefachkraft ab 01.09.2026\n\nSehr geehrte Damen und Herren,\n\nmit großem Interesse habe ich Ihre Stellenanzeige auf ausbildung.de gelesen, denn die Verbindung aus praktischer Ausbildung und persönlicher Betreuung in Ihrer Klinik entspricht genau meinen Vorstellungen.\n\nWährend eines sechsmonatigen Praktikums im Seniorenheim Atlas in Casablanca habe ich gelernt, verantwortungsvoll und geduldig mit pflegebedürftigen Menschen zu arbeiten. Besonders die Dankbarkeit der Bewohnerinnen und Bewohner hat mich überzeugt, dass die Pflege mein Beruf ist. Meine Kollegen beschreiben mich als zuverlässig und belastbar — Eigenschaften, die ich gern in Ihr Team einbringen möchte.\n\nDerzeit besitze ich das Goethe-Zertifikat B1 und besuche einen B2-Kurs, den ich im Juli abschließen werde. Ab September stehe ich Ihnen in Vollzeit zur Verfügung.\n\nÜber die Einladung zu einem persönlichen Gespräch freue ich mich sehr.\n\nMit freundlichen Grüßen\nSara El Amrani",
    tips: ["Every claim needs proof: not 'ich bin zuverlässig' but WHO says it or WHAT shows it.", "The four-paragraph structure is non-negotiable in German applications.", "This doubles as real-life prep — keep your best version!"],
  },
  {
    slug: "eroerterung-homeoffice", levelCode: "B2", title: "Erörterung: Homeoffice", type: "ESSAY",
    prompt: "Schreib eine Erörterung zum Thema *„Sollten Arbeitnehmer ein Recht auf Homeoffice haben?\"* (ca. **180–220 Wörter**):\n\n- Einleitung mit Hinführung zum Thema\n- Zwei Pro-Argumente mit Beispielen\n- Zwei Contra-Argumente mit Beispielen\n- Begründetes Fazit mit eigener Position",
    minWords: 180,
    template: {
      sections: [
        { label: "Einleitung", example: "Spätestens seit der Pandemie wird diskutiert, ob …" },
        { label: "Pro", example: "Dafür spricht zunächst, dass … Darüber hinaus …" },
        { label: "Contra", example: "Dagegen lässt sich einwenden, dass … Außerdem …" },
        { label: "Fazit", example: "Wägt man beide Seiten ab, so …" },
      ],
      phrases: [{ label: "Erörterungs-Konnektoren", items: ["zunächst / darüber hinaus / außerdem", "dagegen lässt sich einwenden", "es stimmt zwar, dass … aber", "wägt man beide Seiten ab"] }],
    },
    sampleAnswer: "Spätestens seit der Pandemie wird intensiv diskutiert, ob Arbeitnehmer einen gesetzlichen Anspruch auf Homeoffice haben sollten. Im Folgenden möchte ich die wichtigsten Argumente beider Seiten abwägen.\n\nFür ein solches Recht spricht zunächst die gewonnene Lebensqualität: Wer nicht pendelt, spart täglich wertvolle Zeit, die der Familie oder der Gesundheit zugutekommt. Darüber hinaus zeigen Studien, dass viele Beschäftigte zu Hause konzentrierter arbeiten, weil Störungen des Großraumbüros wegfallen.\n\nDagegen lässt sich einwenden, dass nicht jede Tätigkeit von zu Hause möglich ist — eine Pflegekraft oder ein Handwerker kann schlecht remote arbeiten, wodurch ein Recht nur für Büroberufe neue Ungerechtigkeiten schaffen würde. Außerdem warnen Unternehmen vor dem Verlust des Teamgefühls: Spontaner Austausch lässt sich durch Videokonferenzen kaum ersetzen.\n\nWägt man beide Seiten ab, überwiegen für mich die Vorteile eines flexiblen Anspruchs: kein starres Recht auf hundert Prozent Homeoffice, aber ein Anspruch darauf, dass Arbeitgeber Wünsche ernsthaft prüfen müssen. So bleiben Fairness und Flexibilität im Gleichgewicht.",
    tips: ["The Erörterung is the king discipline of B2/C1 writing — this structure works for any topic.", "Connectors are your skeleton: zunächst → darüber hinaus → dagegen → außerdem → abschließend.", "The nuanced Fazit (not 100% either side) reads most mature."],
  },
];
