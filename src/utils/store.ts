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
