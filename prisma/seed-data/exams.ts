import type { ExamSeed } from "./types";

export const EXAMS: ExamSeed[] = [
  {
    slug: "goethe-a1-simulation", provider: "GOETHE", levelCode: "A1",
    title: "Goethe A1 — Mock Exam (Start Deutsch 1)",
    description: "Compact simulation in the authentic Start Deutsch 1 format: Lesen, Hören, Schreiben and Sprechen with original task types.",
    durationMin: 65, passScore: 60,
    sections: [
      {
        id: "a1-lesen", title: "Lesen", skill: "READING", durationMin: 20,
        intro: "Lies die Texte und löse die Aufgaben. Wörterbücher sind nicht erlaubt.",
        parts: [
          {
            id: "a1-lesen-1", title: "Teil 1: Kurztext", instructions: "Lies den Text und beantworte die Fragen.",
            passage: `Hallo Meline,

am Samstag machen wir ein Picknick im Stadtpark — hoffentlich ist das Wetter gut! Wir treffen uns um 12 Uhr am Eingang Nord. Jeder bringt etwas mit: Ich mache Salat, Tom kauft Brot und Getränke. Kannst du vielleicht einen Kuchen backen? Dein Apfelkuchen ist der beste!

Bis Samstag!
Anna`,
            questions: [
              { id: "ga1-l1", type: "mcq", prompt: "Was machen die Freunde am Samstag?", options: ["ein Picknick", "eine Party zu Hause", "einen Ausflug ans Meer"], answerIndex: 0 },
              { id: "ga1-l2", type: "mcq", prompt: "Wann treffen sie sich?", options: ["um 2 Uhr", "um 12 Uhr", "um 10 Uhr"], answerIndex: 1 },
              { id: "ga1-l3", type: "mcq", prompt: "Was soll Meline mitbringen?", options: ["Salat", "Getränke", "einen Kuchen"], answerIndex: 2 },
            ],
          },
          {
            id: "a1-lesen-2", title: "Teil 2: Anzeigen", instructions: "Richtig oder falsch? Wähle die passende Antwort.",
            passage: `ANZEIGE A — Supermarkt FrischMarkt: Montag bis Samstag 7–21 Uhr geöffnet. Sonntags geschlossen.

ANZEIGE B — Deutschkurs A1 am Abend: dienstags und donnerstags, 18:30–20:00 Uhr. Start: 1. März. Anmeldung online.

ANZEIGE C — Fahrrad zu verkaufen: fast neu, nur 120 €. Telefon: 0176 445566 (ab 17 Uhr).`,
            questions: [
              { id: "ga1-l4", type: "mcq", prompt: "Der Supermarkt ist am Sonntag geöffnet.", options: ["richtig", "falsch"], answerIndex: 1 },
              { id: "ga1-l5", type: "mcq", prompt: "Der Deutschkurs ist am Vormittag.", options: ["richtig", "falsch"], answerIndex: 1 },
              { id: "ga1-l6", type: "mcq", prompt: "Man kann ab 17 Uhr wegen des Fahrrads anrufen.", options: ["richtig", "falsch"], answerIndex: 0 },
            ],
          },
        ],
      },
      {
        id: "a1-hoeren", title: "Hören", skill: "LISTENING", durationMin: 15,
        intro: "Höre die Aufnahme. Du kannst sie zweimal abspielen — wie in der echten Prüfung.",
        parts: [
          {
            id: "a1-hoeren-1", title: "Teil 1: Gespräch im Supermarkt", instructions: "Höre das Gespräch und beantworte die Fragen.",
            audioUrl: "/audio/im-supermarkt.mp3",
            transcript: "Kassiererin: Guten Tag! Das macht zusammen zwölf Euro sechzig. — Kunde: Einen Moment, bitte … Hier sind fünfzehn Euro. — Kassiererin: Danke schön. Und zwei Euro vierzig zurück. Brauchen Sie eine Tüte? — Kunde: Nein, danke. Ich habe eine Tasche dabei. — Kassiererin: Sehr gut! Schönen Tag noch! — Kunde: Danke, gleichfalls! Auf Wiedersehen!",
            questions: [
              { id: "ga1-h1", type: "mcq", prompt: "Wo ist das Gespräch?", options: ["im Restaurant", "an der Supermarktkasse", "am Bahnhof"], answerIndex: 1 },
              { id: "ga1-h2", type: "mcq", prompt: "Wie viel bezahlt der Kunde?", options: ["12,60 €", "15,60 €", "2,40 €"], answerIndex: 0 },
              { id: "ga1-h3", type: "mcq", prompt: "Was hat der Kunde dabei?", options: ["eine Tüte", "eine Tasche", "nichts"], answerIndex: 1 },
            ],
          },
        ],
      },
      {
        id: "a1-schreiben", title: "Schreiben", skill: "WRITING", durationMin: 20,
        parts: [
          {
            id: "a1-schreiben-1", title: "Teil 2: Kurze Mitteilung", instructions: "Schreib die Nachricht. Vergiss Anrede und Gruß nicht!",
            writing: {
              prompt: "Du kannst morgen nicht zum Deutschkurs kommen. Schreib eine Nachricht an deine Lehrerin Frau Berg (ca. 30 Wörter):\n- Entschuldige dich\n- Nenne den Grund\n- Frag nach den Hausaufgaben",
              minWords: 25, points: 10,
              sample: "Liebe Frau Berg,\n\nleider kann ich morgen nicht zum Kurs kommen, weil ich einen Arzttermin habe. Es tut mir leid! Können Sie mir bitte die Hausaufgaben schicken?\n\nViele Grüße\nOmar",
              criteria: ["Alle drei Inhaltspunkte", "Anrede und Gruß", "Verständliche Sätze"],
            },
          },
        ],
      },
      {
        id: "a1-sprechen", title: "Sprechen", skill: "SPEAKING", durationMin: 10,
        parts: [
          {
            id: "a1-sprechen-1", title: "Teil 1: Sich vorstellen", instructions: "Stell dich vor — sprich laut und nimm dich auf. Bewerte dich danach ehrlich selbst.",
            speaking: {
              prompt: "Stell dich vor mit: Name — Alter — Land — Wohnort — Sprachen — Beruf — Hobby.\n\nSprich mindestens 45 Sekunden.",
              prepMin: 1, talkMin: 2,
              sample: "Ich heiße Sara, ich bin 26 Jahre alt und komme aus Marokko. Jetzt wohne ich in Köln. Ich spreche Arabisch, Französisch und ein bisschen Deutsch. Von Beruf bin ich Verkäuferin, aber ich möchte eine Ausbildung machen. Mein Hobby ist Fotografie.",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "telc-a2-simulation", provider: "TELC", levelCode: "A2",
    title: "telc A2 — Mock Exam",
    description: "Compact simulation of telc Deutsch A2: reading, Sprachbausteine, listening, writing and speaking in the original task style.",
    durationMin: 70, passScore: 60,
    sections: [
      {
        id: "a2-lesen", title: "Lesen & Sprachbausteine", skill: "READING", durationMin: 25,
        parts: [
          {
            id: "a2-lesen-1", title: "Teil 1: Leseverstehen", instructions: "Lies den Text und löse die Aufgaben.",
            passage: `Neues Angebot der Stadtbibliothek

Die Stadtbibliothek hat jetzt auch sonntags geöffnet — von 10 bis 16 Uhr. „Viele Familien haben nur am Wochenende Zeit\", erklärt die Leiterin Petra Schulz. Neu ist auch das „Sprachcafé\": Jeden Samstag um 15 Uhr treffen sich Menschen aus verschiedenen Ländern und sprechen zusammen Deutsch. Die Teilnahme ist kostenlos, eine Anmeldung ist nicht nötig. Wer Bücher ausleihen möchte, braucht einen Bibliotheksausweis. Er kostet für Erwachsene 20 Euro pro Jahr, für Kinder und Studierende ist er gratis.`,
            questions: [
              { id: "ta2-l1", type: "mcq", prompt: "Was ist neu an den Öffnungszeiten?", options: ["Die Bibliothek öffnet jetzt auch sonntags.", "Die Bibliothek schließt früher.", "Die Bibliothek ist samstags zu."], answerIndex: 0 },
              { id: "ta2-l2", type: "mcq", prompt: "Was passiert im Sprachcafé?", options: ["Man lernt Englisch.", "Menschen sprechen zusammen Deutsch.", "Man kann Kaffee kaufen."], answerIndex: 1 },
              { id: "ta2-l3", type: "mcq", prompt: "Wer bekommt den Ausweis gratis?", options: ["alle Erwachsenen", "niemand", "Kinder und Studierende"], answerIndex: 2 },
            ],
          },
          {
            id: "a2-sprachbausteine", title: "Teil 2: Sprachbausteine", instructions: "Wähle das richtige Wort für jede Lücke.", pointsPerQuestion: 1,
            questions: [
              { id: "ta2-s1", type: "mcq", prompt: "Ich wohne ___ zwei Jahren in Bremen.", options: ["seit", "vor", "ab"], answerIndex: 0, explanation: "Duration until now: seit + Dativ." },
              { id: "ta2-s2", type: "mcq", prompt: "Gestern ___ wir im Kino.", options: ["sind", "waren", "haben"], answerIndex: 1, explanation: "sein im Präteritum: waren." },
              { id: "ta2-s3", type: "mcq", prompt: "Kannst du ___ bitte helfen?", options: ["mich", "mir", "ich"], answerIndex: 1, explanation: "helfen + Dativ." },
              { id: "ta2-s4", type: "mcq", prompt: "Er hat den Brief noch nicht ___.", options: ["gelesen", "lesen", "liest"], answerIndex: 0, explanation: "Perfekt: Partizip II." },
            ],
          },
        ],
      },
      {
        id: "a2-hoeren", title: "Hören", skill: "LISTENING", durationMin: 15,
        parts: [
          {
            id: "a2-hoeren-1", title: "Teil 1: Telefongespräch", instructions: "Höre den Anruf in der Arztpraxis und beantworte die Fragen.",
            audioUrl: "/audio/anruf-beim-arzt.mp3",
            transcript: "Sprechstundenhilfe: Praxis Doktor Winter, guten Morgen. Was kann ich für Sie tun? — Patient: Guten Morgen, hier ist Ali Demir. Ich habe seit gestern starke Halsschmerzen und Fieber. Kann ich heute noch vorbeikommen? — Sprechstundenhilfe: Moment, ich schaue mal … Heute ist es sehr voll. Können Sie um 11:30 Uhr kommen? — Patient: Ja, das passt. Muss ich etwas mitbringen? — Sprechstundenhilfe: Nur Ihre Versichertenkarte, bitte.",
            questions: [
              { id: "ta2-h1", type: "mcq", prompt: "Warum ruft Herr Demir an?", options: ["Er möchte ein Rezept.", "Er ist krank und braucht einen Termin.", "Er sagt einen Termin ab."], answerIndex: 1 },
              { id: "ta2-h2", type: "mcq", prompt: "Seit wann hat er die Beschwerden?", options: ["seit gestern", "seit einer Woche", "seit heute Morgen"], answerIndex: 0 },
              { id: "ta2-h3", type: "mcq", prompt: "Um wie viel Uhr ist der Termin?", options: ["11:00", "11:30", "13:30"], answerIndex: 1 },
            ],
          },
        ],
      },
      {
        id: "a2-schreiben", title: "Schreiben", skill: "WRITING", durationMin: 20,
        parts: [
          {
            id: "a2-schreiben-1", title: "Kurze Mitteilung", instructions: "Bearbeite alle Inhaltspunkte.",
            writing: {
              prompt: "Deine Freundin Klara hat dich zum Abendessen am Freitag eingeladen. Schreib eine Antwort (ca. 40–50 Wörter):\n- Bedanke dich\n- Sag zu\n- Frag, was du mitbringen sollst\n- Frag nach der Uhrzeit",
              minWords: 40, points: 15,
              sample: "Liebe Klara,\n\nvielen Dank für die Einladung — ich komme sehr gern! Ich freue mich schon auf deinen berühmten Auflauf.\n\nSoll ich etwas mitbringen? Vielleicht einen Nachtisch oder Getränke?\n\nUnd um wie viel Uhr soll ich da sein?\n\nLiebe Grüße\nSara",
              criteria: ["Alle vier Inhaltspunkte", "Passende Anrede/Gruß", "A2-Strukturen (Perfekt, Modalverben)"],
            },
          },
        ],
      },
      {
        id: "a2-sprechen", title: "Sprechen", skill: "SPEAKING", durationMin: 10,
        parts: [
          {
            id: "a2-sprechen-1", title: "Teil 3: Etwas aushandeln", instructions: "Sprich beide Rollen laut — plane mit einem imaginären Partner.",
            speaking: {
              prompt: "Du planst mit einem Freund einen Ausflug am Samstag. Sprich über: Wohin? — Wann? — Wie fahrt ihr? — Was nehmt ihr mit?\n\nMache Vorschläge und reagiere auf (imaginäre) Gegenvorschläge.",
              prepMin: 2, talkMin: 3,
              sample: "Wollen wir am Samstag einen Ausflug machen? Ich schlage vor, wir fahren an den See. — Sollen wir um zehn Uhr fahren? — Wir können mit dem Zug fahren, das ist entspannter. — Ich bringe Brote und Wasser mit, kannst du Obst mitbringen?",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "goethe-b1-simulation", provider: "GOETHE", levelCode: "B1",
    title: "Goethe B1 — Mock Exam",
    description: "Compact simulation of the Goethe-Zertifikat B1 modules with authentic task formats — including the famous forum post.",
    durationMin: 90, passScore: 60,
    sections: [
      {
        id: "b1-lesen", title: "Lesen", skill: "READING", durationMin: 30,
        parts: [
          {
            id: "b1-lesen-1", title: "Teil 2: Zeitungstext", instructions: "Lies den Text und wähle die richtige Antwort.",
            passage: `Gemeinsam statt einsam: Mehrgenerationenhäuser boomen

In Deutschland leben immer mehr Menschen allein — fast die Hälfte aller Haushalte in Großstädten sind Single-Haushalte. Gleichzeitig wächst ein Gegentrend: das Mehrgenerationenhaus. Dort wohnen junge Familien, Studierende und Senioren unter einem Dach und unterstützen sich gegenseitig.

Die 72-jährige Helga Brandt lebt seit drei Jahren in einem solchen Projekt in Leipzig. „Ich passe zweimal pro Woche auf die Kinder meiner Nachbarn auf. Dafür hilft mir Familie Yilmaz beim Einkaufen und bei Problemen mit dem Computer\", erzählt sie. Für die Studentin Lea (23) ist vor allem die günstige Miete attraktiv: Wer sich im Haus engagiert, zahlt weniger.

Sozialforscher sehen in solchen Projekten eine Antwort auf zwei Probleme gleichzeitig: die Einsamkeit älterer Menschen und die Wohnungsnot der Jungen. Kritiker geben allerdings zu bedenken, dass das Zusammenleben Konflikte mit sich bringen kann — und dass solche Projekte bisher nur einen winzigen Teil des Wohnungsmarkts ausmachen.`,
            questions: [
              { id: "gb1-l1", type: "mcq", prompt: "Was ist ein Mehrgenerationenhaus?", options: ["ein Haus nur für Senioren", "ein Haus, in dem Jung und Alt zusammenleben", "ein Studentenwohnheim"], answerIndex: 1 },
              { id: "gb1-l2", type: "mcq", prompt: "Wie hilft Frau Brandt ihren Nachbarn?", options: ["Sie kauft für sie ein.", "Sie repariert Computer.", "Sie passt auf die Kinder auf."], answerIndex: 2 },
              { id: "gb1-l3", type: "mcq", prompt: "Warum findet Lea das Projekt attraktiv?", options: ["wegen der günstigen Miete", "wegen der großen Zimmer", "wegen der Lage"], answerIndex: 0 },
              { id: "gb1-l4", type: "mcq", prompt: "Was kritisieren Skeptiker?", options: ["Die Häuser sind zu teuer.", "Es kann Konflikte geben und es gibt zu wenige Projekte.", "Senioren helfen zu wenig."], answerIndex: 1 },
            ],
          },
          {
            id: "b1-lesen-2", title: "Teil 3: Sprachbausteine", instructions: "Welches Wort passt in die Lücke?", pointsPerQuestion: 1,
            questions: [
              { id: "gb1-s1", type: "mcq", prompt: "Ich lerne Deutsch, ___ ich in Deutschland studieren möchte.", options: ["denn", "weil", "deshalb"], answerIndex: 1 },
              { id: "gb1-s2", type: "mcq", prompt: "Das ist der Kollege, ___ mir geholfen hat.", options: ["der", "den", "dem"], answerIndex: 0 },
              { id: "gb1-s3", type: "mcq", prompt: "___ es regnete, sind wir spazieren gegangen.", options: ["Weil", "Obwohl", "Wenn"], answerIndex: 1 },
              { id: "gb1-s4", type: "mcq", prompt: "Er interessiert sich sehr ___ Geschichte.", options: ["für", "über", "an"], answerIndex: 0 },
            ],
          },
        ],
      },
      {
        id: "b1-hoeren", title: "Hören", skill: "LISTENING", durationMin: 20,
        parts: [
          {
            id: "b1-hoeren-1", title: "Teil 1: Gespräch", instructions: "Höre die WG-Besichtigung und beantworte die Fragen.",
            audioUrl: "/audio/wg-besichtigung.mp3",
            transcript: "Paul: Hi, du bist bestimmt Sofia? Komm rein! Das Zimmer ist gleich hier links, 18 Quadratmeter mit Balkon. — Sofia: Wow, schön hell! Und wie hoch ist die Miete genau? — Paul: 420 warm, plus einmal im Monat gemeinsame WG-Kasse für Putzmittel und so. — Sofia: Klingt fair. Wie läuft das bei euch mit dem Putzen? — Paul: Wir wechseln wöchentlich: Küche, Bad, Flur. Und einmal im Monat kochen wir zusammen. — Sofia: Ich arbeite im Schichtdienst als Krankenpflegerin — stört euch das? — Paul: Überhaupt nicht. Wir melden uns bis Freitag!",
            questions: [
              { id: "gb1-h1", type: "mcq", prompt: "Was besichtigt Sofia?", options: ["eine eigene Wohnung", "ein WG-Zimmer", "ein Büro"], answerIndex: 1 },
              { id: "gb1-h2", type: "mcq", prompt: "Was ist in der WG-Kasse enthalten?", options: ["die Miete", "Putzmittel und Gemeinsames", "das Internet"], answerIndex: 1 },
              { id: "gb1-h3", type: "mcq", prompt: "Was macht die WG einmal im Monat?", options: ["eine Party", "zusammen kochen", "einen Ausflug"], answerIndex: 1 },
              { id: "gb1-h4", type: "mcq", prompt: "Bis wann melden sich die Bewohner?", options: ["bis Montag", "bis Freitag", "noch heute"], answerIndex: 1 },
            ],
          },
        ],
      },
      {
        id: "b1-schreiben", title: "Schreiben", skill: "WRITING", durationMin: 25,
        parts: [
          {
            id: "b1-schreiben-1", title: "Teil 2: Forumsbeitrag", instructions: "Äußere deine Meinung strukturiert.",
            writing: {
              prompt: "In einem Online-Forum wird diskutiert: „Sollte es in Innenstädten mehr autofreie Zonen geben?\"\n\nSchreib deine Meinung (ca. 80–100 Wörter):\n- Deine Position mit Begründung\n- Ein Beispiel\n- Ein Gegenargument aufgreifen",
              minWords: 80, points: 20,
              sample: "Meiner Meinung nach sollte es in Innenstädten deutlich mehr autofreie Zonen geben. Der wichtigste Grund ist die Lebensqualität: weniger Lärm, bessere Luft und mehr Platz für Menschen.\n\nEin gutes Beispiel ist die Altstadt in meiner Stadt: Seit sie autofrei ist, sitzen dort viel mehr Menschen in Cafés, und die Geschäfte haben sogar mehr Kunden als früher.\n\nNatürlich argumentieren manche, dass Autofahrer dann keine Parkplätze finden. Das verstehe ich, aber dafür gibt es Parkhäuser am Rand der Innenstadt und gute Busverbindungen.\n\nDeshalb bin ich überzeugt: Autofreie Zonen machen Städte lebenswerter.",
              criteria: ["Klare Position + Begründung", "Beispiel", "Gegenargument aufgegriffen", "Konnektoren (weil, deshalb, aber)"],
            },
          },
        ],
      },
      {
        id: "b1-sprechen", title: "Sprechen", skill: "SPEAKING", durationMin: 15,
        parts: [
          {
            id: "b1-sprechen-1", title: "Teil 2: Präsentation", instructions: "Halte die Präsentation laut — nutze die 5-Punkte-Struktur.",
            speaking: {
              prompt: "Thema: „Einkaufen im Internet — Fluch oder Segen?\"\n\nPräsentiere (ca. 3 Minuten):\n1. Thema vorstellen\n2. Persönliche Erfahrungen\n3. Situation in deinem Heimatland\n4. Vor- und Nachteile\n5. Meinung + Schluss",
              prepMin: 3, talkMin: 3,
              sample: "Ich möchte heute über das Einkaufen im Internet sprechen. Ich selbst bestelle etwa zweimal im Monat online, vor allem Bücher und Technik. In meinem Heimatland ist Online-Shopping in den Städten sehr beliebt, auf dem Land weniger, weil die Lieferung lange dauert. Der größte Vorteil ist die Bequemlichkeit — man kann rund um die Uhr einkaufen und Preise vergleichen. Andererseits gehen viele kleine Geschäfte kaputt, und die vielen Pakete sind schlecht für die Umwelt. Zusammenfassend finde ich: Online-Shopping ist praktisch, aber wir sollten auch die Geschäfte in unserer Stadt unterstützen.",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "telc-b2-simulation", provider: "TELC", levelCode: "B2",
    title: "telc B2 — Mock Exam",
    description: "Compact simulation of telc Deutsch B2: demanding reading, detailed listening, formal complaint letter and presentation.",
    durationMin: 90, passScore: 60,
    sections: [
      {
        id: "b2-lesen", title: "Lesen & Sprachbausteine", skill: "READING", durationMin: 35,
        parts: [
          {
            id: "b2-lesen-1", title: "Teil 1: Detailverstehen", instructions: "Lies den Text genau und löse die Aufgaben.",
            passage: `Vier-Tage-Woche: Experiment mit Folgen

Immer mehr Unternehmen experimentieren mit der Vier-Tage-Woche — bei vollem Gehalt. Die bisher größte Studie dazu lieferte bemerkenswerte Ergebnisse: Der Umsatz der teilnehmenden Firmen blieb stabil oder stieg sogar leicht, während Krankheitstage um fast zwei Drittel zurückgingen. Neun von zehn Unternehmen wollten nach dem Testlauf nicht mehr zum alten Modell zurückkehren.

Befürworter sehen darin den Beweis, dass Produktivität nicht von der Anwesenheitszeit abhängt. „Wer weniger Stunden hat, verschwendet weniger Zeit in ineffizienten Meetings\", argumentiert die Ökonomin Dr. Petra Held. Zudem verbessere sich die Vereinbarkeit von Familie und Beruf erheblich — ein entscheidender Faktor im Wettbewerb um Fachkräfte.

Skeptiker halten dagegen, dass sich die Ergebnisse nicht auf alle Branchen übertragen lassen. In der Pflege, der Gastronomie oder auf dem Bau lasse sich Arbeit nicht einfach verdichten: Ein Patient benötige an fünf Tagen Betreuung, unabhängig vom Arbeitszeitmodell. Auch warnen Arbeitgeberverbände vor steigenden Kosten, falls zusätzliches Personal eingestellt werden müsse.

Einig sind sich beide Seiten nur in einem Punkt: Die starre Vierzig-Stunden-Woche, wie sie seit Jahrzehnten existiert, dürfte in ihrer heutigen Form kaum die Zukunft der Arbeit sein.`,
            questions: [
              { id: "tb2-l1", type: "mcq", prompt: "Welches Ergebnis lieferte die Studie?", options: ["Der Umsatz sank deutlich.", "Krankheitstage gingen stark zurück.", "Die Hälfte der Firmen brach ab."], answerIndex: 1 },
              { id: "tb2-l2", type: "mcq", prompt: "Was ist laut Dr. Held ein Effekt kürzerer Arbeitszeit?", options: ["mehr Meetings", "weniger Zeitverschwendung", "mehr Überstunden"], answerIndex: 1 },
              { id: "tb2-l3", type: "mcq", prompt: "Warum zweifeln Skeptiker an der Übertragbarkeit?", options: ["In manchen Branchen lässt sich Arbeit nicht verdichten.", "Die Studie war zu lang.", "Die Mitarbeiter waren dagegen."], answerIndex: 0 },
              { id: "tb2-l4", type: "mcq", prompt: "Worin sind sich beide Seiten einig?", options: ["Die 40-Stunden-Woche ist die Zukunft.", "Das heutige starre Modell ist wohl nicht die Zukunft.", "Die Vier-Tage-Woche kommt überall."], answerIndex: 1 },
            ],
          },
          {
            id: "b2-sprachbausteine", title: "Teil 2: Sprachbausteine", instructions: "Wähle die richtige Option.", pointsPerQuestion: 1,
            questions: [
              { id: "tb2-s1", type: "mcq", prompt: "Der Bericht muss bis Freitag fertiggestellt ___.", options: ["worden", "werden", "wurde"], answerIndex: 1 },
              { id: "tb2-s2", type: "mcq", prompt: "___ ich Ihnen kurz widersprechen dürfte: Die Zahlen zeigen etwas anderes.", options: ["Wenn", "Ob", "Falls"], answerIndex: 0 },
              { id: "tb2-s3", type: "mcq", prompt: "Das Projekt, ___ Erfolg niemand erwartet hatte, wurde ein Hit.", options: ["deren", "dessen", "das"], answerIndex: 1 },
              { id: "tb2-s4", type: "mcq", prompt: "Bei der Planung müssen alle Wünsche ___ werden.", options: ["berücksichtigt", "berücksichtigen", "Rücksicht"], answerIndex: 0 },
            ],
          },
        ],
      },
      {
        id: "b2-hoeren", title: "Hören", skill: "LISTENING", durationMin: 15,
        parts: [
          {
            id: "b2-hoeren-1", title: "Teil 2: Diskussion", instructions: "Höre den Podcast-Ausschnitt und beantworte die Fragen.",
            audioUrl: "/audio/podcast-nachhaltigkeit.mp3",
            transcript: "Max: Bringt es überhaupt etwas, wenn ich als Einzelner auf Plastik verzichte und weniger fliege? — Julia: Ich sage klar: Ja! Konsum ist ein Signal. Wenn Millionen Menschen weniger Fleisch kaufen, verändert das ganze Märkte. — Max: Da widerspreche ich dir. Ein Großteil der Emissionen stammt von wenigen Konzernen. Solange Politik keine klaren Regeln setzt, ist mein Verzicht ein Tropfen auf den heißen Stein. — Julia: Aber wer wählt denn die Politik? — Max: Vielleicht ist es kein Entweder-oder, sondern ein Sowohl-als-auch: privat anfangen, politisch weiterdenken.",
            questions: [
              { id: "tb2-h1", type: "mcq", prompt: "Welche Position vertritt Julia?", options: ["Individueller Konsum verändert Märkte.", "Nur Politik kann etwas ändern.", "Verzicht bringt nichts."], answerIndex: 0 },
              { id: "tb2-h2", type: "mcq", prompt: "Was ist Max' Hauptargument?", options: ["Konsum ist wichtiger als Politik.", "Die meisten Emissionen stammen von Konzernen.", "Fliegen ist umweltfreundlich."], answerIndex: 1 },
              { id: "tb2-h3", type: "mcq", prompt: "Zu welchem Schluss kommt Max am Ende?", options: ["Julia hat komplett unrecht.", "Privates Handeln UND Politik gehören zusammen.", "Er beendet die Diskussion."], answerIndex: 1 },
            ],
          },
        ],
      },
      {
        id: "b2-schreiben", title: "Schreiben", skill: "WRITING", durationMin: 30,
        parts: [
          {
            id: "b2-schreiben-1", title: "Formeller Brief: Beschwerde", instructions: "Achte auf Register, Struktur und Vollständigkeit.",
            writing: {
              prompt: "Du hast online einen Laptop bestellt (Bestellnummer 78-45-B). Er kam eine Woche zu spät UND das Display ist beschädigt. Der Kundenservice reagiert nicht auf E-Mails.\n\nSchreib eine formelle Beschwerde an die Geschäftsleitung (ca. 120–150 Wörter):\n- Sachverhalt schildern\n- Bisherige Kontaktversuche erwähnen\n- Konkrete Forderung mit Frist stellen\n- Konsequenzen andeuten",
              minWords: 120, points: 25,
              sample: "Sehr geehrte Damen und Herren,\n\nam 3. Mai bestellte ich in Ihrem Online-Shop einen Laptop (Bestellnummer 78-45-B). Leider muss ich mich nun in doppelter Hinsicht beschweren.\n\nErstens wurde das Gerät erst mit einer Woche Verspätung geliefert — zugesichert waren drei Werktage. Zweitens musste ich beim Auspacken feststellen, dass das Display in der oberen Ecke beschädigt ist. Meine beiden E-Mails an Ihren Kundenservice vom 12. und 16. Mai blieben bis heute unbeantwortet, was ich als äußerst unprofessionell empfinde.\n\nIch fordere Sie daher auf, mir bis zum 30. Mai ein einwandfreies Ersatzgerät zu liefern oder den vollen Kaufpreis zu erstatten. Sollte ich bis dahin nichts von Ihnen hören, sehe ich mich gezwungen, rechtliche Schritte einzuleiten und die Verbraucherzentrale einzuschalten.\n\nMit freundlichen Grüßen\nSara El Amrani",
              criteria: ["Formelles Register durchgehend", "Alle vier Inhaltspunkte", "Passiv/Konjunktiv angemessen", "Klare Frist + Konsequenz"],
            },
          },
        ],
      },
      {
        id: "b2-sprechen", title: "Sprechen", skill: "SPEAKING", durationMin: 10,
        parts: [
          {
            id: "b2-sprechen-1", title: "Teil 1: Präsentation", instructions: "Präsentiere strukturiert und nimm dich auf.",
            speaking: {
              prompt: "Thema: „Sollte künstliche Intelligenz im Klassenzimmer eingesetzt werden?\"\n\nPräsentiere 3 Minuten: These — zwei Argumente mit Beispielen — Gegenposition würdigen — Fazit.",
              prepMin: 3, talkMin: 3,
              sample: "Ich vertrete den Standpunkt, dass KI im Unterricht eingesetzt werden sollte — allerdings mit klaren Regeln. Dafür spricht erstens die individuelle Förderung: Ein KI-Tutor kann jedem Schüler Aufgaben auf seinem Niveau geben, was eine Lehrkraft bei dreißig Kindern kaum leisten kann. Zweitens bereitet der Umgang mit KI auf die Arbeitswelt vor, in der diese Werkzeuge längst Standard sind. Es stimmt zwar, dass die Gefahr besteht, dass Schüler nur noch abschreiben. Aber genau deshalb muss der kritische Umgang mit KI im Unterricht gelernt werden — Verbote verlagern das Problem nur nach Hause. Zusammenfassend bin ich überzeugt: Nicht das Ob, sondern das Wie entscheidet.",
            },
          },
        ],
      },
    ],
  },
];
