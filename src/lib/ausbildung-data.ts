/** Ausbildung & working-in-Germany preparation content. */

export const LEBENSLAUF_SECTIONS: { label: string; example: string; note?: string }[] = [
  { label: "Persönliche Daten", example: "Sara El Amrani · geb. 12.03.1999 in Casablanca · Musterstraße 12, 10115 Berlin · sara.elamrani@mail.com · +49 176 12345678", note: "No photo is legally required, but most German applications still include a professional one." },
  { label: "Berufserfahrung", example: "03/2021 – 06/2024 · Verkäuferin, Modehaus Atlas, Casablanca — Kundenberatung, Kasse, Warenpräsentation", note: "Reverse-chronological, with bullet points of concrete responsibilities." },
  { label: "Ausbildung / Schulbildung", example: "09/2017 – 06/2020 · Abitur (Baccalauréat), Lycée Hassan II, Casablanca", note: "Include recognized equivalents (anabin) where relevant." },
  { label: "Sprachkenntnisse", example: "Arabisch (Muttersprache) · Französisch (C1) · Deutsch (B1, telc Zertifikat 05/2025) · Englisch (B2)", note: "Always state the CEFR level and the certificate." },
  { label: "Kenntnisse & Fähigkeiten", example: "MS Office, Kassensysteme, Führerschein Klasse B", note: "" },
  { label: "Hobbys & Engagement", example: "Ehrenamtliche Nachhilfe, Volleyball, Fotografie", note: "Optional — one line maximum." },
];

export const ANSCHREIBEN_SECTIONS: { label: string; example: string }[] = [
  { label: "Betreff", example: "Bewerbung um einen Ausbildungsplatz als Pflegefachfrau ab 01.09.2026" },
  { label: "Anrede", example: "Sehr geehrte Frau Weber," },
  { label: "Einleitung", example: "mit großem Interesse habe ich Ihre Stellenanzeige auf ausbildung.de gelesen. Als engagierte und zuverlässige Person mit ersten Erfahrungen in der Betreuung möchte ich mich bei Ihnen um einen Ausbildungsplatz bewerben." },
  { label: "Hauptteil — Warum ich?", example: "Während meines Praktikums im Seniorenheim Atlas habe ich gelernt, verantwortungsvoll und geduldig mit Menschen zu arbeiten. Meine Deutschkenntnisse auf B1-Niveau verbessere ich täglich, und ich lerne schnell." },
  { label: "Hauptteil — Warum Sie?", example: "Ihre Einrichtung überzeugt mich durch das strukturierte Ausbildungsprogramm und die persönliche Betreuung der Auszubildenden." },
  { label: "Schluss", example: "Über die Einladung zu einem persönlichen Gespräch freue ich mich sehr. Ich stehe ab September 2026 zur Verfügung." },
  { label: "Grußformel", example: "Mit freundlichen Grüßen\nSara El Amrani" },
];

export const INTERVIEW_QUESTIONS: { q: string; hint: string; sample: string }[] = [
  {
    q: "Erzählen Sie etwas über sich.",
    hint: "60–90 seconds: who you are, education, experience, why Germany, why this job. Practice until fluent.",
    sample: "Mein Name ist Sara, ich bin 26 Jahre alt und komme aus Marokko. Ich habe drei Jahre als Verkäuferin gearbeitet und dabei gelernt, gut mit Menschen umzugehen. Seit zwei Jahren lerne ich Deutsch, weil ich meine Zukunft in Deutschland sehe. Die Ausbildung bei Ihnen ist für mich die perfekte Chance, Beruf und Sprache zu verbinden.",
  },
  {
    q: "Warum möchten Sie diese Ausbildung machen?",
    hint: "Connect a personal motivation with concrete knowledge about the job.",
    sample: "Ich habe in meinem Praktikum gemerkt, dass mir die Arbeit mit Menschen viel Freude macht. Die Ausbildung zur Pflegefachfrau verbindet genau das mit einem sicheren Beruf mit Zukunft.",
  },
  {
    q: "Warum haben Sie sich für unser Unternehmen entschieden?",
    hint: "Research the company: size, values, training program, products. Name one or two concrete points.",
    sample: "Ihr Unternehmen hat einen sehr guten Ruf in der Ausbildung. Besonders gefällt mir, dass die Azubis feste Mentoren haben und viele nach der Ausbildung übernommen werden.",
  },
  {
    q: "Was sind Ihre Stärken?",
    hint: "2-3 strengths WITH a mini-example each. Avoid empty adjectives.",
    sample: "Ich bin sehr zuverlässig — in meinem alten Job war ich nie unpünktlich. Außerdem lerne ich schnell: Mein Deutsch habe ich in zwei Jahren von null auf B1 gebracht.",
  },
  {
    q: "Was sind Ihre Schwächen?",
    hint: "One honest, non-critical weakness + what you do about it.",
    sample: "Ich bin manchmal zu perfektionistisch und brauche für Aufgaben etwas länger. Ich arbeite daran, indem ich mir feste Zeitlimits setze.",
  },
  {
    q: "Wo sehen Sie sich in fünf Jahren?",
    hint: "Show commitment to the profession and to staying with the company.",
    sample: "Ich möchte meine Ausbildung erfolgreich abschließen und danach als Fachkraft in Ihrem Team arbeiten. Später kann ich mir eine Weiterbildung vorstellen.",
  },
  {
    q: "Wie gut ist Ihr Deutsch? Verstehen Sie alles?",
    hint: "Be honest and confident. Show your learning strategy.",
    sample: "Ich habe das B1-Zertifikat und verstehe den Alltag gut. Wenn ich etwas nicht verstehe, frage ich nach — das ist mir wichtiger, als Fehler zu machen. Ich lerne jeden Tag weiter.",
  },
  {
    q: "Haben Sie Fragen an uns?",
    hint: "ALWAYS have 2 questions ready. It shows real interest.",
    sample: "Ja, gerne: Wie sieht ein typischer Tag für Auszubildende bei Ihnen aus? Und gibt es Unterstützung bei der Prüfungsvorbereitung?",
  },
];

export const WORKPLACE_VOCAB: Record<string, { title: string; emoji: string; words: { de: string; en: string }[] }> = {
  general: {
    title: "Arbeit allgemein",
    emoji: "💼",
    words: [
      { de: "die Ausbildung, -en", en: "vocational training / apprenticeship" },
      { de: "der/die Auszubildende (Azubi)", en: "trainee, apprentice" },
      { de: "der Arbeitsvertrag, ¨-e", en: "employment contract" },
      { de: "das Gehalt, ¨-er", en: "salary" },
      { de: "die Probezeit", en: "probation period" },
      { de: "der Feierabend", en: "end of the working day" },
      { de: "die Schicht, -en", en: "shift" },
      { de: "der Urlaub", en: "vacation, leave" },
      { de: "die Krankmeldung, -en", en: "sick note / calling in sick" },
      { de: "die Berufsschule, -n", en: "vocational school" },
      { de: "die Überstunden (Pl.)", en: "overtime" },
      { de: "der Kollege / die Kollegin", en: "colleague" },
      { de: "der Vorgesetzte / die Vorgesetzte", en: "supervisor" },
      { de: "die Gehaltsabrechnung, -en", en: "payslip" },
      { de: "kündigen", en: "to quit / to terminate" },
    ],
  },
  office: {
    title: "Büro",
    emoji: "🖥",
    words: [
      { de: "die Besprechung, -en", en: "meeting" },
      { de: "der Termin, -e", en: "appointment" },
      { de: "die Unterlagen (Pl.)", en: "documents" },
      { de: "der Anhang, ¨-e", en: "attachment" },
      { de: "die Frist, -en", en: "deadline" },
      { de: "weiterleiten", en: "to forward" },
      { de: "ausdrucken", en: "to print out" },
      { de: "die Rückmeldung, -en", en: "feedback, reply" },
      { de: "zuständig für", en: "responsible for" },
      { de: "die Ablage", en: "filing" },
      { de: "erledigen", en: "to complete / take care of" },
      { de: "die Verwaltung", en: "administration" },
    ],
  },
  construction: {
    title: "Handwerk & Bau",
    emoji: "🔧",
    words: [
      { de: "die Baustelle, -n", en: "construction site" },
      { de: "das Werkzeug, -e", en: "tool" },
      { de: "die Schutzkleidung", en: "protective clothing" },
      { de: "der Helm, -e", en: "helmet" },
      { de: "die Anleitung, -en", en: "instructions, manual" },
      { de: "messen", en: "to measure" },
      { de: "bohren", en: "to drill" },
      { de: "schweißen", en: "to weld" },
      { de: "die Leiter, -n", en: "ladder" },
      { de: "der Strom", en: "electricity" },
      { de: "die Sicherheitsvorschrift, -en", en: "safety regulation" },
      { de: "das Material, -ien", en: "material" },
    ],
  },
  healthcare: {
    title: "Pflege & Gesundheit",
    emoji: "🩺",
    words: [
      { de: "die Pflegefachkraft, ¨-e", en: "nursing professional" },
      { de: "der Patient / die Patientin", en: "patient" },
      { de: "die Station, -en", en: "ward" },
      { de: "der Blutdruck", en: "blood pressure" },
      { de: "das Medikament, -e", en: "medication" },
      { de: "die Spritze, -n", en: "injection, syringe" },
      { de: "der Verband, ¨-e", en: "bandage" },
      { de: "die Visite, -n", en: "doctor's rounds" },
      { de: "dokumentieren", en: "to document" },
      { de: "die Hygiene", en: "hygiene" },
      { de: "der Notfall, ¨-e", en: "emergency" },
      { de: "die Schmerzen (Pl.)", en: "pain" },
    ],
  },
};

export const PHONE_PHRASES: { label: string; items: string[] }[] = [
  {
    label: "Anrufen & sich melden",
    items: [
      "Guten Tag, mein Name ist … Ich rufe an wegen …",
      "Könnte ich bitte mit Frau/Herrn … sprechen?",
      "Ich möchte gern einen Termin vereinbaren.",
    ],
  },
  {
    label: "Nachfragen & klären",
    items: [
      "Entschuldigung, das habe ich nicht verstanden. Könnten Sie das bitte wiederholen?",
      "Könnten Sie bitte etwas langsamer sprechen?",
      "Habe ich das richtig verstanden: … ?",
      "Könnten Sie mir das bitte buchstabieren?",
    ],
  },
  {
    label: "Beenden",
    items: [
      "Vielen Dank für Ihre Hilfe!",
      "Ich melde mich dann nächste Woche wieder.",
      "Auf Wiederhören!",
    ],
  },
];

export const EMAIL_PHRASES: { label: string; items: string[] }[] = [
  {
    label: "Betreff & Anrede",
    items: [
      "Betreff: Terminanfrage / Krankmeldung / Frage zu …",
      "Sehr geehrte Damen und Herren, (unknown recipient)",
      "Sehr geehrte Frau Müller, / Sehr geehrter Herr Schmidt,",
      "Liebe Kolleginnen und Kollegen, (internal, informal)",
    ],
  },
  {
    label: "Nützliche Sätze",
    items: [
      "ich schreibe Ihnen, weil …",
      "Im Anhang finden Sie …",
      "Könnten Sie mir bitte mitteilen, ob … ?",
      "Vielen Dank im Voraus für Ihre Rückmeldung.",
      "Bitte entschuldigen Sie die späte Antwort.",
    ],
  },
  {
    label: "Grußformeln",
    items: ["Mit freundlichen Grüßen (standard formal)", "Beste Grüße (semi-formal)", "Viele Grüße (informal)"],
  },
];

export const WORK_CULTURE: { title: string; tip: string }[] = [
  { title: "Pünktlichkeit ist heilig", tip: "Being on time means being 5–10 minutes early. A late arrival without notice damages trust immediately — always call ahead if delayed." },
  { title: "Siezen vs. Duzen", tip: "Use 'Sie' with superiors, customers and anyone you haven't been offered 'du' by. The senior person offers the 'du' — never assume it." },
  { title: "Krankmeldung am ersten Tag", tip: "If you're sick, call BEFORE your shift starts — on day one. A doctor's certificate (AU) is usually required from day 3, sometimes day 1." },
  { title: "Direkte Kommunikation", tip: "German feedback is direct and factual, not personal. 'Das ist falsch' means the work needs fixing — not that they dislike you." },
  { title: "Feierabend respektieren", tip: "Work ends at Feierabend. Calls or messages after hours are unusual — and your free time is respected too." },
  { title: "Mülltrennung & Ordnung", tip: "Yes, even at work: separate paper, plastic and Restmüll. Tidiness at your workplace is noticed." },
  { title: "Pausen sind geregelt", tip: "Breaks are legally regulated (30 min at 6+ hours). Take them — working through breaks is not seen as heroic." },
  { title: "Fragen ist stark, nicht schwach", tip: "Asking questions when unsure is expected from Azubis. Mistakes from not asking are judged much more harshly." },
];

export const WORK_SITUATIONS: { title: string; lines: { speaker: string; de: string; en: string }[] }[] = [
  {
    title: "Sich krankmelden · Calling in sick",
    lines: [
      { speaker: "Sie", de: "Guten Morgen, hier ist Sara El Amrani. Ich kann heute leider nicht zur Arbeit kommen — ich bin krank.", en: "Good morning, this is Sara El Amrani. Unfortunately I can't come to work today — I'm sick." },
      { speaker: "Chef", de: "Guten Morgen, Frau El Amrani. Das tut mir leid. Waren Sie schon beim Arzt?", en: "Good morning, Ms. El Amrani. I'm sorry to hear that. Have you seen a doctor yet?" },
      { speaker: "Sie", de: "Ich habe um 10 Uhr einen Termin. Die Krankmeldung schicke ich Ihnen heute noch per E-Mail.", en: "I have an appointment at 10. I'll send you the sick note by email today." },
      { speaker: "Chef", de: "In Ordnung. Gute Besserung!", en: "Alright. Get well soon!" },
    ],
  },
  {
    title: "Um Hilfe bitten · Asking for help",
    lines: [
      { speaker: "Sie", de: "Entschuldigung, Herr Krause, hätten Sie kurz Zeit? Ich habe eine Frage zu dieser Aufgabe.", en: "Excuse me, Mr. Krause, do you have a moment? I have a question about this task." },
      { speaker: "Kollege", de: "Klar, worum geht's?", en: "Sure, what's it about?" },
      { speaker: "Sie", de: "Ich bin nicht sicher, ob ich das Formular richtig ausgefüllt habe. Könnten Sie einmal draufschauen?", en: "I'm not sure if I filled in the form correctly. Could you take a look?" },
      { speaker: "Kollege", de: "Zeig mal her … Ja, fast perfekt — hier fehlt nur das Datum.", en: "Let me see … Yes, almost perfect — only the date is missing here." },
    ],
  },
  {
    title: "Smalltalk in der Pause · Break-room small talk",
    lines: [
      { speaker: "Kollegin", de: "Na, wie läuft deine erste Woche?", en: "So, how's your first week going?" },
      { speaker: "Sie", de: "Ganz gut, danke! Es ist viel Neues, aber alle sind sehr nett.", en: "Pretty good, thanks! Lots of new things, but everyone is very nice." },
      { speaker: "Kollegin", de: "Das freut mich. Wenn du Fragen hast, frag einfach. Kaffee?", en: "Glad to hear it. If you have questions, just ask. Coffee?" },
      { speaker: "Sie", de: "Sehr gern, danke dir!", en: "With pleasure, thank you!" },
    ],
  },
];
