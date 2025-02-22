class UserService {
    constructor() {
        this.initializeUser();
    }

    initializeUser() {
        if (!localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify({
                isLoggedIn: false,
                userData: null
            }));
        }
    }

    isLoggedIn() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user.isLoggedIn;
    }

    getCurrentUser() {
        const user = JSON.parse(localStorage.getItem('user'));
        return user.userData;
    }

    login(userData) {
        localStorage.setItem('user', JSON.stringify({
            isLoggedIn: true,
            userData
        }));
    }

    logout() {
        localStorage.setItem('user', JSON.stringify({
            isLoggedIn: false,
            userData: null
        }));
        window.location.href = 'index.html';
    }

    updateUserData(newData) {
        const user = JSON.parse(localStorage.getItem('user'));
        user.userData = { ...user.userData, ...newData };
        localStorage.setItem('user', JSON.stringify(user));
    }
}

const userService = new UserService();
export default userService;
