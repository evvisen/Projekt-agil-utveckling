const answers = document.querySelector("#answers");

async function svarsalternativ(params) {
  await fetch("http://localhost:3000/api/juridikquiz")
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      console.log(result[0].svarsalternativ1[0]);
      if (currentIndex === 0) {
        answers.children[0].innerHTML = result[0].svarsalternativ1[0];
        answers.children[1].innerHTML = result[0].svarsalternativ1[1];
        answers.children[2].innerHTML = result[0].svarsalternativ1[2];
        answers.children[3].innerHTML = result[0].svarsalternativ1[3];
      }
      if (currentIndex === 1) {
        answers.children[0].innerHTML = result[0].svarsalternativ2[0];
        answers.children[1].innerHTML = result[0].svarsalternativ2[1];
        answers.children[2].innerHTML = result[0].svarsalternativ2[2];
        answers.children[3].innerHTML = result[0].svarsalternativ2[3];
      }
      if (currentIndex === 2) {
        answers.children[0].innerHTML = result[0].svarsalternativ3[0];
        answers.children[1].innerHTML = result[0].svarsalternativ3[1];
        answers.children[2].innerHTML = result[0].svarsalternativ3[2];
        answers.children[3].innerHTML = result[0].svarsalternativ3[3];
      }
    });
}

svarsalternativ();

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
