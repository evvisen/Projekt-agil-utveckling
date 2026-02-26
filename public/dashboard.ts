window.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.getElementById("continueBtn") as HTMLButtonElement;

  continueBtn.addEventListener("click", () => {
    window.location.href = "/quiz.html";
  });
});