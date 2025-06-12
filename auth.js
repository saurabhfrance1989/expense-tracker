document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const showForgotPasswordLink = document.getElementById('showForgotPassword');
    const backToLoginFromForgotLink = document.getElementById('backToLoginFromForgot');

    const verifyUserBtn = document.getElementById('verifyUserBtn');

    const loginContainer = document.querySelector('.container'); // Main login container
    const registerContainer = document.getElementById('registerContainer');
    const forgotPasswordContainer = document.getElementById('forgotPasswordContainer');

    let usernameToReset = null; // To store username after verification


    // Function to get users from localStorage
    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    // Function to save users to localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;
            const users = getUsers();

            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', username);
                window.location.href = 'index.html'; // Redirect to main app page
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = registerForm.username.value;
            const email = registerForm.email.value; // Added email
            const password = registerForm.password.value; // Consider adding confirm password
            let users = getUsers();

            if (users.find(u => u.username === username)) {
                alert('Username already exists.');
            } else if (users.find(u => u.email === email)) { // Check if email already exists
                alert('Email already registered.');
            } else {
                users.push({ username, email, password }); // Added email
                saveUsers(users);
                alert('Registration successful! Please login.');
                // Optionally, log them in directly or switch to login view
                if (loginContainer && registerContainer) {
                    registerContainer.style.display = 'none';
                    loginContainer.style.display = 'block';
                    loginForm.username.value = username; // Pre-fill username
                    loginForm.password.focus();
                } else {
                     window.location.reload(); // Reload to show login form
                }
            }
        });
    }

    // Toggle between Login, Register, and Forgot Password views
    function showForm(formToShow) {
        loginContainer.style.display = 'none';
        if(registerContainer) registerContainer.style.display = 'none';
        if(forgotPasswordContainer) forgotPasswordContainer.style.display = 'none';
        
        if (formToShow === 'login' && loginContainer) loginContainer.style.display = 'block';
        if (formToShow === 'register' && registerContainer) registerContainer.style.display = 'block';
        if (formToShow === 'forgotPassword' && forgotPasswordContainer) forgotPasswordContainer.style.display = 'block';
        
        // Reset forms when switching
        if(loginForm) loginForm.reset();
        if(registerForm) registerForm.reset();
        if(forgotPasswordForm) forgotPasswordForm.reset();
        if(resetPasswordForm) resetPasswordForm.reset();
        if(resetPasswordForm) resetPasswordForm.style.display = 'none'; // Hide reset part initially
        if(forgotPasswordForm) forgotPasswordForm.style.display = 'block'; // Show verify part initially
        usernameToReset = null;
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm('register');
        });
    }

    if (showLoginLink && registerContainer) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm('login');
        });
    }

    if (showForgotPasswordLink) {
        showForgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm('forgotPassword');
        });
    }
    
    if (backToLoginFromForgotLink) {
        backToLoginFromForgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm('login');
        });
    }


    // Handle Forgot Password - Step 1: Verify User
    if (verifyUserBtn && forgotPasswordForm) {
        verifyUserBtn.addEventListener('click', () => {
            const username = forgotPasswordForm.fpUsername.value;
            const email = forgotPasswordForm.fpEmail.value;
            const users = getUsers();
            const user = users.find(u => u.username === username && u.email === email);

            if (user) {
                usernameToReset = user.username; // Store username for password update
                forgotPasswordForm.style.display = 'none';
                if(resetPasswordForm) resetPasswordForm.style.display = 'block';
                alert('User verified. Please enter your new password.');
            } else {
                alert('Username or email not found, or they do not match.');
                usernameToReset = null;
            }
        });
    }

    // Handle Forgot Password - Step 2: Reset Password
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!usernameToReset) {
                alert('User not verified. Please verify your username and email first.');
                return;
            }

            const newPassword = resetPasswordForm.newPassword.value;
            const confirmNewPassword = resetPasswordForm.confirmNewPassword.value;

            if (newPassword !== confirmNewPassword) {
                alert('New passwords do not match.');
                return;
            }
            if (newPassword.length < 1) { // Basic validation
                alert('Password cannot be empty.');
                return;
            }

            let users = getUsers();
            const userIndex = users.findIndex(u => u.username === usernameToReset);

            if (userIndex > -1) {
                users[userIndex].password = newPassword;
                saveUsers(users);
                alert('Password successfully reset! Please login with your new password.');
                usernameToReset = null;
                showForm('login');
            } else {
                // Should not happen if usernameToReset is correctly set
                alert('Error resetting password. User not found.');
            }
        });
    }


    // Redirect if already logged in
    if (localStorage.getItem('loggedInUser') && window.location.pathname.includes('login.html')) {
        // Allow access to login page if trying to logout via URL or clear state
        // Or, more simply, if on login page and logged in, go to index.
        // window.location.href = 'index.html';
    }
});
