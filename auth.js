document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm'); // Assuming you'll add a register form
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin'); // Assuming you'll add this link in your register section

    const loginContainer = document.querySelector('.container'); // Assuming this is the login container
    let registerContainer; // Will be defined if register form elements are added by user

    // Attempt to find a separate registration container if it exists
    // This is a common pattern, but user might need to adjust HTML
    const allContainers = document.querySelectorAll('.container');
    if (allContainers.length > 1) {
        // Heuristic: if there's more than one .container, the second one might be for registration
        // Or, ideally, it would have a specific ID like 'registerContainer'
        const potentialRegisterContainer = document.getElementById('registerContainer');
        if (potentialRegisterContainer) {
            registerContainer = potentialRegisterContainer;
        } else {
            // Fallback if no specific ID, this is less robust
            // registerContainer = allContainers[1];
            console.warn('Register container not explicitly found by ID "registerContainer". UI toggling might be incomplete.');
        }
    }


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

    // Toggle between Login and Register views
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginContainer && registerContainer) {
                loginContainer.style.display = 'none';
                registerContainer.style.display = 'block';
            } else {
                // Fallback or alert if containers aren't set up as expected
                // This might happen if the registration form HTML isn't present or identifiable
                alert('Registration form not found. Please ensure login.html is set up correctly.');
                console.error("Login or Register container not found. Ensure login.html has a login container and a register container (e.g., with class 'container' or IDs 'loginContainer', 'registerContainer') and that registerForm has ID 'registerForm'.");
            }
        });
    }

    if (showLoginLink && registerContainer) { // Ensure registerContainer exists for this
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginContainer && registerContainer) {
                registerContainer.style.display = 'none';
                loginContainer.style.display = 'block';
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
