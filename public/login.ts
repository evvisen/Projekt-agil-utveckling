// login.ts
type LoginResponse =
  | { success: true; message: string; token: string }
  | { success: false; message: string };

const LOGIN_API_URL = "http://localhost:3000/api/login";


function getLoginElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Hittar inte element med id="${id}"`);
  return el as T;
}

window.addEventListener("DOMContentLoaded", () => {

  const loginForm = getLoginElement<HTMLFormElement>("signupForm");
  const loginUsername = getLoginElement<HTMLInputElement>("username");
  const loginPassword = getLoginElement<HTMLInputElement>("password");
  const loginMsg = getLoginElement<HTMLDivElement>("formMessage");


  // Toggle Visa/Dölj lösenord
  const loginTogglePasswordBtn = getLoginElement<HTMLButtonElement>("togglePassword");
  loginTogglePasswordBtn?.addEventListener("click", () => {
    const isHidden = loginPassword.type === "password";
    loginPassword.type = isHidden ? "text" : "password";
    loginTogglePasswordBtn.textContent = isHidden ? "Dölj" : "Visa";
    loginTogglePasswordBtn.setAttribute(
      "aria-label",
      isHidden ? "Dölj lösenord" : "Visa lösenord"
    );
  });

  // Funktion för att visa meddelanden
  const setLoginMessage = (text: string, type: "ok" | "error" | "info" = "info") => {
    loginMsg.textContent = text;
    loginMsg.classList.remove("is-ok", "is-error", "is-info");
    loginMsg.classList.add(type === "ok" ? "is-ok" : type === "error" ? "is-error" : "is-info");
  };

  // Submit login-form
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameVal = loginUsername.value.trim();
    const passwordVal = loginPassword.value;

    if (!usernameVal || !passwordVal) {
      setLoginMessage("Användarnamn och lösenord krävs", "error");
      return;
    }

    try {
      const res = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameVal, password: passwordVal }),
      });

      const data = (await res.json()) as LoginResponse;

      if (!data.success) {
        setLoginMessage(data.message, "error");
        return;
      }

      // Spara JWT-token
      localStorage.setItem("token", data.token);

      // Redirect till dashboard
      window.location.href = "/dashboard.html";
    } catch (err) {
      console.error(err);
      setLoginMessage("Kunde inte kontakta servern. Är backend igång?", "error");
    }
  });


});
