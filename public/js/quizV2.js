const answerText = document.querySelectorAll(".answertext");
console.log(answerText[0]);

const buttonValue = document.querySelectorAll(".answerBtn")
const allAnswerbuttons = document.querySelectorAll(".answerBtn");

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
      const tag = document.createElement("span");
      tag.className = "correctTag";
      tag.textContent = "Rätt svar";
      buttonValue.appendChild(tag);
      allAnswerbuttons.forEach(allAnswerbuttons => {
        allAnswerbuttons.disabled = true;
      })
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

async function getQuestions() {
  const response = await fetch("http://localhost:3000/api/questions");
  const result = await response.json();

  //filtrera modul och nivå tillfälligt
  const filtered = result.questions.filter(
    (question) => question.module === "Juridik" && question.level_number === 1
  );

  console.log(filtered);
  return filtered;
}

let currentIndex = 0;
let questions = [];

async function startQuiz() {
  questions = await getQuestions();

  document.getElementById("quizTitle").textContent = "Juridik Nivå 1";
  document.getElementById("qTotal").textContent = String(questions.length);

  renderQuestion();
  document.getElementById("nextBtn").addEventListener("click", goNext);
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
  }
}

startQuiz();
