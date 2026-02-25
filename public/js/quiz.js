const STORAGE_KEY = "vuxenpoang_quiz_juridik_lvl1_v1";

const quiz = {
  module: "Juridik",
  level: 1,
  totalQuestions: 5,
  passPercent: 70,
  nextLevelName: "Hyreskontrakt",
  questions: [
    {
      id: "q1",
      question: "Vad är ett avtal?",
      options: [
        { key: "A", text: "En muntlig eller skriftlig överenskommelse som kan vara bindande" },
        { key: "B", text: "Ett kvitto på att du har betalat" },
        { key: "C", text: "En regel som bara gäller företag" },
        { key: "D", text: "Ett dokument som alltid måste vara notariserat" },
      ],
      correctKey: "A",
      explanation:
        "Avtal är en överenskommelse mellan parter. Många avtal kan vara bindande även om de är muntliga, men skriftligt är enklare att bevisa.",
    },
    {
      id: "q2",
      question: "Vad betyder det att något är 'bindande'?",
      options: [
        { key: "A", text: "Att du kan ångra dig när som helst utan konsekvens" },
        { key: "B", text: "Att ni förväntas följa överenskommelsen och kan få följder om ni inte gör det" },
        { key: "C", text: "Att det bara gäller om en domstol godkänner" },
        { key: "D", text: "Att det bara gäller om det finns ett vittne" },
      ],
      correctKey: "B",
      explanation:
        "Bindande betyder att överenskommelsen gäller. Bryter man den kan det leda till krav på t.ex. betalning, ersättning eller andra rättsliga följder.",
    },
    {
      id: "q3",
      question: "När är det smartast att spara bevis (t.ex. kvitton, mail, sms)?",
      options: [
        { key: "A", text: "Bara om det gäller stora summor" },
        { key: "B", text: "När du kan behöva visa vad ni kom överens om" },
        { key: "C", text: "Aldrig, det behövs inte" },
        { key: "D", text: "Bara om någon blir arg" },
      ],
      correctKey: "B",
      explanation:
        "Bevis gör det lättare att visa vad som hände eller vad ni avtalade om. Mail/sms och kvitton är enkla att spara och kan skydda dig senare.",
    },
    {
      id: "q4",
      question: "Vad är 'ångerrätt' oftast kopplat till?",
      options: [
        { key: "A", text: "Köp på distans, t.ex. online eller telefon (ofta 14 dagar)" },
        { key: "B", text: "Alla köp i butik, alltid" },
        { key: "C", text: "Bara köp av mat" },
        { key: "D", text: "Bara när du betalar kontant" },
      ],
      correctKey: "A",
      explanation:
        "Ångerrätt gäller oftast vid distansköp (online/telefon) och är vanligtvis 14 dagar. I fysisk butik finns ingen automatisk ångerrätt om inte butiken erbjuder det.",
    },
    {
      id: "q5",
      question: "Vad bör du göra först om du hamnar i en tvist med ett företag?",
      options: [
        { key: "A", text: "Skriv en tydlig reklamation och spara all kommunikation" },
        { key: "B", text: "Skriv på ett nytt avtal direkt" },
        { key: "C", text: "Betala allt utan att fråga" },
        { key: "D", text: "Sluta svara och hoppas att det försvinner" },
      ],
      correctKey: "A",
      explanation:
        "Börja med att reklamera (skriv vad som är fel och vad du vill ha som lösning) och spara mail/sms/kvitton. Då har du en tydlig spårbarhet.",
    },
  ],
};

const state = {
  currentIndex: 0,
  answers: {},
  score: 0,
  finished: false,
};

const $ = (id) => document.getElementById(id);

const questionText = $("questionText");
const answersEl = $("answers");
const nextBtn = $("nextBtn");
const closeBtn = $("closeBtn");
const qIndexEl = $("qIndex");
const qTotalEl = $("qTotal");
const progressFill = $("progressFill");
const quizTitle = $("quizTitle");
const overlay = $("feedbackOverlay");
const overlayBackdrop = $("overlayBackdrop");
const feedbackPill = $("feedbackPill");
const feedbackTitle = $("feedbackTitle");
const feedbackText = $("feedbackText");
const feedbackCta = $("feedbackCta");

function saveProgress() {
  const payload = {
    module: quiz.module,
    level: quiz.level,
    currentIndex: state.currentIndex,
    answers: state.answers,
    score: state.score,
    finished: state.finished,
    savedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (data?.module !== quiz.module || data?.level !== quiz.level) return false;

    state.currentIndex = data.currentIndex ?? 0;
    state.answers = data.answers ?? {};
    state.score = data.score ?? 0;
    state.finished = data.finished ?? false;
    return true;
  } catch {
    return false;
  }
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

function readUnlocks() {
  try {
    return JSON.parse(localStorage.getItem("vuxenpoang_unlocks_v1") || "{}");
  } catch {
    return {};
  }
}

function openOverlay() {
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
}
function closeOverlay() {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
}

function renderHeader() {
  quizTitle.textContent = `${quiz.module} • Nivå ${quiz.level}`;
  qTotalEl.textContent = String(quiz.totalQuestions);
}

function setProgressBarForIndex() {
  const pct = Math.round(((state.currentIndex + 1) / quiz.totalQuestions) * 100);
  progressFill.style.width = `${pct}%`;
}

function renderQuestion() {
  const q = quiz.questions[state.currentIndex];
  if (!q) return;

  qIndexEl.textContent = String(state.currentIndex + 1);
  setProgressBarForIndex();

  questionText.textContent = q.question;
  answersEl.innerHTML = "";
  nextBtn.disabled = true;

  const existing = state.answers[q.id];

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answerBtn";
    btn.dataset.key = opt.key;

    const badge = document.createElement("div");
    badge.className = "answerBadge";
    badge.textContent = opt.key;

    const text = document.createElement("div");
    text.className = "answerText";
    text.textContent = opt.text;

    btn.appendChild(badge);
    btn.appendChild(text);

    if (existing) {
      btn.disabled = true;

      if (opt.key === existing.selectedKey) btn.classList.add("is-selected");

      if (opt.key === q.correctKey) {
        btn.classList.add("is-correct");
        const tag = document.createElement("span");
        tag.className = "correctTag";
        tag.textContent = "Rätt svar";
        btn.appendChild(tag);
      }

      if (opt.key === existing.selectedKey && !existing.isCorrect) {
        btn.classList.add("is-wrong");
      }

      nextBtn.disabled = false;
    } else {
      btn.addEventListener("click", () => onAnswer(opt.key));
    }

    answersEl.appendChild(btn);
  });
}

function showFeedback(isCorrect, explanation) {
  if (isCorrect) {
    feedbackPill.textContent = "Rätt svar";
    feedbackPill.style.background = "rgba(22,163,74,0.10)";
    feedbackPill.style.color = "rgb(22,163,74)";
    feedbackTitle.textContent = "Bra jobbat!";
  } else {
    feedbackPill.textContent = "Fel svar";
    feedbackPill.style.background = "rgba(220,38,38,0.10)";
    feedbackPill.style.color = "rgb(220,38,38)";
    feedbackTitle.textContent = "Inte riktigt…";
  }

  feedbackText.textContent = explanation;
  feedbackCta.textContent = "Fortsätt";
  feedbackCta.onclick = () => closeOverlay();

  openOverlay();
}

function showFinishSummary() {
  const percent = Math.round((state.score / quiz.totalQuestions) * 100);
  const pass = percent >= quiz.passPercent;

  progressFill.style.width = "100%";

  feedbackPill.textContent = pass ? "Godkänd" : "Inte godkänd";
  feedbackPill.style.background = pass ? "rgba(22,163,74,0.10)" : "rgba(220,38,38,0.10)";
  feedbackPill.style.color = pass ? "rgb(22,163,74)" : "rgb(220,38,38)";

  feedbackTitle.textContent = pass ? "Nivå klar 🎉" : "Försök igen";
  feedbackText.textContent = pass
    ? `Du fick ${state.score} av ${quiz.totalQuestions} rätt (${percent}%). Nästa nivå (“${quiz.nextLevelName}”) kan nu låsas upp.`
    : `Du fick ${state.score} av ${quiz.totalQuestions} rätt (${percent}%). Du behöver minst ${quiz.passPercent}% för att klara nivån.`;

  feedbackCta.textContent = pass ? "Tillbaka" : "Starta om";

  feedbackCta.onclick = () => {
    if (pass) {
      localStorage.setItem(
        "vuxenpoang_unlocks_v1",
        JSON.stringify({
          ...readUnlocks(),
          [`${quiz.module.toLowerCase()}_lvl${quiz.level}`]: { passed: true, percent, score: state.score },
        })
      );

      clearProgress();
      window.location.href = "./module-path.html";
    } else {
      clearProgress();
      state.currentIndex = 0;
      state.answers = {};
      state.score = 0;
      state.finished = false;
      saveProgress();
      closeOverlay();
      renderQuestion();
    }
  };

  openOverlay();
}

function onAnswer(selectedKey) {
  const q = quiz.questions[state.currentIndex];
  if (!q) return;

  const isCorrect = selectedKey === q.correctKey;
  if (isCorrect) state.score += 1;

  state.answers[q.id] = { selectedKey, isCorrect };
  saveProgress();

  renderQuestion();
  showFeedback(isCorrect, q.explanation);
}

function goNext() {
  if (state.currentIndex < quiz.totalQuestions - 1) {
    state.currentIndex += 1;
    saveProgress();
    renderQuestion();
    return;
  }

  state.finished = true;
  saveProgress();
  showFinishSummary();
}

function onCloseQuiz() {
  saveProgress();
  window.location.href = "./module-path.html";
}

function init() {
  renderHeader();
  loadProgress();

  if (state.finished) {
    showFinishSummary();
  } else {
    renderQuestion();
  }

  nextBtn.addEventListener("click", goNext);
  closeBtn.addEventListener("click", onCloseQuiz);
  overlayBackdrop.addEventListener("click", closeOverlay);
}

init();
