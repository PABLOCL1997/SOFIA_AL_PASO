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

export const cart = {
    get(): any {
        let cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    set(value: any): any {
        localStorage.setItem('cart', JSON.stringify(value));
        return cart.get();
    },
    delete(): void {
        localStorage.removeItem('cart');
    }
};