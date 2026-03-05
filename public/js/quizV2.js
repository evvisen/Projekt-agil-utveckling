const answerText = document.querySelectorAll(".answertext");
console.log(answerText[0]);

const buttonValue = document.querySelectorAll(".answerBtn")
const allAnswerbuttons = document.querySelectorAll(".answerBtn");

let correctAnswers = 0;

async function svarsalternativ(params) {
  await fetch("http://localhost:3000/api/juridikquiz")
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      console.log(result[0].rätt_svar1[0]);
      if (currentIndex === 0) {
        answerText[0].textContent = result[0].svarsalternativ1[0];
        answerText[1].textContent = result[0].svarsalternativ1[1];
        answerText[2].textContent = result[0].svarsalternativ1[2];
        answerText[3].textContent = result[0].svarsalternativ1[3];

        buttonValue[0].setAttribute("value", result[0].rätt_svar1[0]);
        buttonValue[1].setAttribute("value", result[0].rätt_svar1[1]);
        buttonValue[2].setAttribute("value", result[0].rätt_svar1[2]);
        buttonValue[3].setAttribute("value", result[0].rätt_svar1[3]);

      }
      if (currentIndex === 1) {
        answerText[0].textContent = result[0].svarsalternativ2[0];
        answerText[1].textContent = result[0].svarsalternativ2[1];
        answerText[2].textContent = result[0].svarsalternativ2[2];
        answerText[3].textContent = result[0].svarsalternativ2[3];

        buttonValue[0].setAttribute("value", result[0].rätt_svar2[0]);
        buttonValue[1].setAttribute("value", result[0].rätt_svar2[1]);
        buttonValue[2].setAttribute("value", result[0].rätt_svar2[2]);
        buttonValue[3].setAttribute("value", result[0].rätt_svar2[3]);
      }
      if (currentIndex === 2) {
        answerText[0].textContent = result[0].svarsalternativ3[0];
        answerText[1].textContent = result[0].svarsalternativ3[1];
        answerText[2].textContent = result[0].svarsalternativ3[2];
        answerText[3].textContent = result[0].svarsalternativ3[3];

        buttonValue[0].setAttribute("value", result[0].rätt_svar3[0]);
        buttonValue[1].setAttribute("value", result[0].rätt_svar3[1]);
        buttonValue[2].setAttribute("value", result[0].rätt_svar3[2]);
        buttonValue[3].setAttribute("value", result[0].rätt_svar3[3]);
      }
    });
}

//Gör två element inne i knappen där ena representerar badgen och den andra texten.
// Använd slice() för att ta bort bokstäverna från svarsalternativen

svarsalternativ();

buttonValue.forEach(buttonValue => {
  buttonValue.addEventListener("click", () => {
    if (buttonValue.getAttribute("value") === "true") {
      console.log("Du har rätt");
      buttonValue.classList.add("is-correct");
      allAnswerbuttons.forEach(allAnswerbuttons => {
        allAnswerbuttons.disabled = true;
      })
      correctAnswers += 1;
      console.log(correctAnswers);

    }
    if (buttonValue.getAttribute("value") === "false") {
      console.log("Du har fel");
      buttonValue.classList.add("is-wrong");
      allAnswerbuttons.forEach(allAnswerbuttons => {
        allAnswerbuttons.disabled = true;
      })
    }
  })
})

const urlParams = new URLSearchParams(window.location.search);
const moduleId = urlParams.get("module_id");
const levelNumber = urlParams.get("level");

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.user_id;
}

async function getQuestions() {
  const response = await fetch(`/api/questions?module_id=${moduleId}&level=${levelNumber}`);
  const result = await response.json();
  return result.questions;
}

let currentIndex = 0;
let questions = [];

async function startQuiz() {
  questions = await getQuestions();

  document.getElementById("quizTitle").textContent = `${questions[0].module} Nivå ${levelNumber}`;
  document.getElementById("qTotal").textContent = String(questions.length);

  renderQuestion();
  document.getElementById("nextBtn").addEventListener("click", goNext);
  correctAnswers = 0;
}

function renderQuestion() {
  const question = questions[currentIndex];

  document.getElementById("qIndex").textContent = String(currentIndex + 1);

  document.getElementById("questionText").textContent = question.quiz_question;

  document.getElementById("nextBtn").disabled = false;

  const progressPercent = Math.round(
    ((currentIndex + 1) / questions.length) * 100
  );

  document.getElementById("progressFill").style.width = progressPercent + "%";
}

function goNext() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
    svarsalternativ();
    allAnswerbuttons.forEach(allAnswerbuttons => {
      allAnswerbuttons.disabled = false;
      allAnswerbuttons.classList.remove("is-wrong");
      allAnswerbuttons.classList.remove("is-correct");
    })
  } else {
    completeLevel();
  }
}

async function completeLevel() {
  if (correctAnswers === 3) {
    const userId = getUserIdFromToken();
    if (!userId || !questions.length) return;

    const moduleLevelId = questions[0].module_level_id;

    try {
      await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          module_level_id: moduleLevelId,
        }),
      });
    } catch (err) {
      console.error("Kunde inte uppdatera progress:", err);
    }

    document.getElementById("questionText").textContent = "Quiz klart! Bra jobbat!";
    document.querySelector(".answers").style.display = "none";
    document.getElementById("nextBtn").textContent = "Tillbaka";
    document.getElementById("nextBtn").disabled = false;
    document.getElementById("nextBtn").removeEventListener("click", goNext);
    document.getElementById("nextBtn").addEventListener("click", () => {
      window.location.href = `module-path.html?id=${moduleId}`;
    });
  }
  if (correctAnswers < 3) {
    document.getElementById("questionText").textContent = "Du behöver göra om";
    document.querySelector(".answers").style.display = "none";
    document.getElementById("nextBtn").textContent = "Tillbaka";
    document.getElementById("nextBtn").disabled = false;
    document.getElementById("nextBtn").removeEventListener("click", goNext);
    document.getElementById("nextBtn").addEventListener("click", () => {
      window.location.href = `module-path.html?id=${moduleId}`;
    });
  }
}

startQuiz();
