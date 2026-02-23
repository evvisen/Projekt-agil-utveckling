type RegisterResponse =
  | { success: true; message: string; token?: string }
  | { success: false; message: string };

const API_URL = "http://localhost:3000/api/register";


function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Hittar inte element med id="${id}"`);
  return el as T;
}

window.addEventListener("DOMContentLoaded", () => {
  const form = byId<HTMLFormElement>("signupForm");
  const username = byId<HTMLInputElement>("username");
  const password = byId<HTMLInputElement>("password");
  const passwordConfirm = byId<HTMLInputElement>("passwordConfirm");
  const msg = byId<HTMLDivElement>("formMessage");

  const setMessage = (text: string, type: "ok" | "error" | "info" = "info") => {
    msg.textContent = text;
    msg.classList.remove("is-ok", "is-error", "is-info");
    msg.classList.add(
      type === "ok" ? "is-ok" : type === "error" ? "is-error" : "is-info",
    );
  };

  // Toggle Visa/Dölj lösenord
  const togglePasswordBtn = byId<HTMLButtonElement>("togglePassword");
togglePasswordBtn?.addEventListener("click", () => {
  const isHidden = password.type === "password";
  password.type = isHidden ? "text" : "password";
  togglePasswordBtn.textContent = isHidden ? "Dölj" : "Visa";
  togglePasswordBtn.setAttribute(
    "aria-label",
    isHidden ? "Dölj lösenord" : "Visa lösenord"
  );
});

  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const u = username.value.trim();
    const p = password.value;
    const pc = passwordConfirm.value;

    if (!u || u.length < 3) {
      setMessage("Användarnamn måste vara minst 3 tecken.", "error");
      username.focus();
      return;
    }

    if (!p || p.length < 8) {
      setMessage("Lösenord måste vara minst 8 tecken.", "error");
      password.focus();
      return;
    }

    if (p !== pc) {
      setMessage("Lösenorden matchar inte.", "error");
      passwordConfirm.focus();
      return;
    }

    setMessage("Skapar konto...", "info");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      const data = (await res.json()) as Partial<RegisterResponse> & {
        sucess?: boolean;
      };

      const success = (data as any).success ?? (data as any).sucess ?? false;

      if (!res.ok || !success) {
        setMessage(
          (data as any).message || "Något gick fel vid registrering.",
          "error",
        );
        return;
      }

      setMessage((data as any).message || "Användare skapad!", "ok");

      if ((data as any).token) {
        localStorage.setItem("token", (data as any).token);
      }
      window.location.href= "/login.html";

      form.reset();

    } catch (err) {
      console.error(err);
      setMessage("Kunde inte kontakta servern. Är backend igång?", "error");
    }
  });

  const goToLogin = document.getElementById("goToLogin");
  goToLogin?.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    window.location.href = "/login.html";
  });


});
