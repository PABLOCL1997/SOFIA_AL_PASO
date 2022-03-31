
const loginForm = "login-info-form";

export const token = {
  get(): string {
    return String(localStorage.getItem("token"));
  },
  set(value: string): string {
    localStorage.setItem("token", value);
    return token.get();
  },
  delete(): void {
    localStorage.removeItem("token");
  },
};

export const loginInfoForm = {
  get(): string {
    return String(localStorage.getItem(loginForm));
  },
  set(value: string): string {
    localStorage.setItem(loginForm, value);
    return loginInfoForm.get();
  },
  delete(): void {
    localStorage.removeItem(loginForm);
  }
};