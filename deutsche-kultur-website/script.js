// Shared bilingual language switch, mobile navigation and culture quiz.
const languageButton = document.querySelector(".lang-toggle");
let currentLanguage = localStorage.getItem("deutschland-language") || "de";
function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-en][data-de]").forEach(el => {
    const value = el.dataset[currentLanguage];
    if (value !== undefined) el.innerHTML = value;
  });
  if (languageButton) languageButton.textContent = currentLanguage === "de" ? "EN" : "DE";
}
if (languageButton) {
  applyLanguage();
  languageButton.addEventListener("click", () => {
    currentLanguage = currentLanguage === "de" ? "en" : "de";
    localStorage.setItem("deutschland-language", currentLanguage);
    applyLanguage();
  });
}
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (menuButton && nav) menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "×" : "☰";
});

const quizRoot = document.querySelector(".quiz-panel");
if (quizRoot) {
  const questions = [
    {de:"Welche Farben hat die deutsche Flagge?", en:"Which colours are on the German flag?", answers:[["Schwarz, Rot und Gold","Black, red and gold"],["Blau, Weiß und Rot","Blue, white and red"],["Grün, Weiß und Orange","Green, white and orange"]], correct:0, explain:["Richtig! Die Flagge ist schwarz-rot-gold.","Correct! The flag is black, red and gold."]},
    {de:"In welcher Stadt findet das berühmte Oktoberfest statt?", en:"In which city is the famous Oktoberfest held?", answers:[["Berlin","Berlin"],["München","Munich"],["Hamburg","Hamburg"]], correct:1, explain:["Genau! Das Oktoberfest ist in München.","That's right! Oktoberfest takes place in Munich."]},
    {de:"Wie heißt das berühmte Schloss in Bayern?", en:"What is the famous castle in Bavaria called?", answers:[["Schloss Neuschwanstein","Neuschwanstein Castle"],["Schloss Versailles","Palace of Versailles"],["Schloss Windsor","Windsor Castle"]], correct:0, explain:["Richtig! Schloss Neuschwanstein liegt in Bayern.","Correct! Neuschwanstein Castle is in Bavaria."]},
    {de:"Was bedeutet „Danke“ auf Englisch?", en:"What does “Danke” mean in English?", answers:[["Hello","Hello"],["Please","Please"],["Thank you","Thank you"]], correct:2, explain:["Sehr gut! „Danke“ bedeutet „Thank you“.","Well done! “Danke” means “Thank you”."]},
    {de:"Was kann man auf einem Weihnachtsmarkt finden?", en:"What might you find at a Christmas market?", answers:[["Festliche Stände und Dekoration","Festive stalls and decorations"],["Nur Strandspiele","Only beach games"],["Schulprüfungen","School exams"]], correct:0, explain:["Richtig! Weihnachtsmärkte sind für ihre Stände und Lichter bekannt.","Correct! Christmas markets are known for their stalls and lights."]}
  ];
  let index = 0, score = 0, locked = false;
  const questionEl = document.querySelector("#question"), answersEl = document.querySelector("#answers");
  const counter = document.querySelector("#quiz-counter"), scoreLabel = document.querySelector("#score-label");
  const feedback = document.querySelector("#feedback"), next = document.querySelector("#next-btn"), fill = document.querySelector("#progress-fill");
  const t = (de,en) => currentLanguage === "de" ? de : en;
  function render() {
    locked = false;
    const q = questions[index];
    questionEl.textContent = t(q.de,q.en);
    counter.textContent = t(`FRAGE ${index+1} VON ${questions.length}`,`QUESTION ${index+1} OF ${questions.length}`);
    scoreLabel.textContent = t(`PUNKTE: ${score}`,`SCORE: ${score}`);
    fill.style.width = `${(index+1)/questions.length*100}%`;
    feedback.textContent = "";
    answersEl.innerHTML = "";
    q.answers.forEach((answer,i) => {
      const btn = document.createElement("button");
      btn.className = "answer";
      btn.textContent = answer[currentLanguage === "de" ? 0 : 1];
      btn.addEventListener("click", () => choose(i));
      answersEl.appendChild(btn);
    });
    next.disabled = true;
    next.innerHTML = index === questions.length-1 ? `${t("Ergebnis anzeigen","See results")} <span>→</span>` : `${t("Weiter","Next")} <span>→</span>`;
  }
  function choose(choice) {
    if (locked) return;
    locked = true;
    const q = questions[index], buttons = [...answersEl.children];
    buttons.forEach((btn,i) => { btn.disabled = true; if (i === q.correct) btn.classList.add("correct"); });
    if (choice === q.correct) { score++; feedback.textContent = q.explain[currentLanguage === "de" ? 0 : 1]; }
    else { buttons[choice].classList.add("wrong"); feedback.textContent = t("Nicht ganz! Die richtige Antwort ist hervorgehoben.","Not quite! The correct answer is highlighted."); }
    scoreLabel.textContent = t(`PUNKTE: ${score}`,`SCORE: ${score}`);
    next.disabled = false;
  }
  next.addEventListener("click", () => {
    if (!locked) return;
    index++;
    if (index < questions.length) render();
    else showResult();
  });
  function showResult() {
    const message = score === 5 ? t("Fantastisch! Du bist ein Deutschland-Profi!","Fantastic! You're a Germany expert!") : score >= 3 ? t("Sehr gut! Du kennst dich schon gut aus.","Very good! You know quite a bit.") : t("Gut gemacht! Entdecke die Seiten noch einmal und versuche es erneut.","Good effort! Explore the pages again and try once more.");
    quizRoot.innerHTML = `<p class="eyebrow accent">${t("QUIZ ABGESCHLOSSEN","QUIZ COMPLETE")}</p><div class="result-score">${score}/5</div><h2>${message}</h2><p class="intro-text">${t("Danke fürs Mitmachen!","Thanks for taking part!")}</p><button class="button button-dark" id="restart">${t("Noch einmal spielen","Play again")} <span>↻</span></button>`;
    document.querySelector("#restart").addEventListener("click", () => { index=0; score=0; quizRoot.innerHTML = `<div class="quiz-top"><span class="eyebrow accent" id="quiz-counter"></span><span class="score-label" id="score-label"></span></div><div class="progress"><span id="progress-fill"></span></div><h2 id="question"></h2><div id="answers" class="answers"></div><p id="feedback" class="feedback" aria-live="polite"></p><div class="quiz-controls"><button class="button button-dark" id="next-btn" disabled></button></div>`; location.reload(); });
  }
  render();
}
