export const token = {
    get(): string {
        return String(localStorage.getItem('token'));
    },
    set(value: string): string {
        localStorage.setItem('token', value);
        return token.get();
    },
    delete(): void {
        localStorage.removeItem('token');
    }
};

export const user = {
    get(): any {
        let user = localStorage.getItem('user');
        return user ? JSON.parse(user) : {};
    },
    set(value: any): any {
        localStorage.setItem('user', JSON.stringify(value));
        return user.get();
    },
    delete(): void {
        localStorage.removeItem('user');
    }
};