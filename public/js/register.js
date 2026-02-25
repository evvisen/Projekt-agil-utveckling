var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var _this = this;
var API_URL = "http://localhost:3000/api/register";
function byId(id) {
  var el = document.getElementById(id);
  if (!el)
    throw new Error("Hittar inte element med id=\"".concat(id, "\""));
  return el;
}
window.addEventListener("DOMContentLoaded", function () {
  var form = byId("signupForm");
  var username = byId("username");
  var password = byId("password");
  var passwordConfirm = byId("passwordConfirm");
  var msg = byId("formMessage");
  var setMessage = function (text, type) {
    if (type === void 0) { type = "info"; }
    msg.textContent = text;
    msg.classList.remove("is-ok", "is-error", "is-info");
    msg.classList.add(type === "ok" ? "is-ok" : type === "error" ? "is-error" : "is-info");
  };
  // Toggle Visa/Dölj lösenord
  var togglePasswordBtn = byId("togglePassword");
  togglePasswordBtn === null || togglePasswordBtn === void 0 ? void 0 : togglePasswordBtn.addEventListener("click", function () {
    var isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    togglePasswordBtn.textContent = isHidden ? "Dölj" : "Visa";
    togglePasswordBtn.setAttribute("aria-label", isHidden ? "Dölj lösenord" : "Visa lösenord");
  });
  form.addEventListener("submit", function (e) {
    return __awaiter(_this, void 0, void 0, function () {
      var u, p, pc, res, data, success, err_1;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            e.preventDefault();
            u = username.value.trim();
            p = password.value;
            pc = passwordConfirm.value;
            if (!u || u.length < 3) {
              setMessage("Användarnamn måste vara minst 3 tecken.", "error");
              username.focus();
              return [2 /*return*/];
            }
            if (!p || p.length < 8) {
              setMessage("Lösenord måste vara minst 8 tecken.", "error");
              password.focus();
              return [2 /*return*/];
            }
            if (p !== pc) {
              setMessage("Lösenorden matchar inte.", "error");
              passwordConfirm.focus();
              return [2 /*return*/];
            }
            setMessage("Skapar konto...", "info");
            _c.label = 1;
          case 1:
            _c.trys.push([1, 4, , 5]);
            return [4 /*yield*/, fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username: u, password: p }),
            })];
          case 2:
            res = _c.sent();
            return [4 /*yield*/, res.json()];
          case 3:
            data = (_c.sent());
            success = (_b = (_a = data.success) !== null && _a !== void 0 ? _a : data.sucess) !== null && _b !== void 0 ? _b : false;
            if (!res.ok || !success) {
              setMessage(data.message || "Något gick fel vid registrering.", "error");
              return [2 /*return*/];
            }
            setMessage(data.message || "Användare skapad!", "ok");
            if (data.token) {
              localStorage.setItem("token", data.token);
            }
            window.location.href = "/login.html";
            form.reset();
            return [3 /*break*/, 5];
          case 4:
            err_1 = _c.sent();
            console.error(err_1);
            setMessage("Kunde inte kontakta servern. Är backend igång?", "error");
            return [3 /*break*/, 5];
          case 5: return [2 /*return*/];
        }
      });
    });
  });
  var goToLogin = document.getElementById("goToLogin");
  goToLogin === null || goToLogin === void 0 ? void 0 : goToLogin.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/login.html";
  });
});
