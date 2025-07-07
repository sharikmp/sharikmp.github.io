function updateActivity() {
    const errorDiv = document.getElementById('error');
    if (errorDiv && !errorDiv.classList.contains('hidden')) {
        errorDiv.classList.add('hidden');
    }
}

// Attach activity listeners to hide error messages
["click", "keydown", "scroll", "touchstart"].forEach(event => {
    window.addEventListener(event, updateActivity);
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('error');

    // Static dummy credentials
    const validEmail = 'test-user@dummyclaim.com';
    const validPassword = 'TestUser@0987654321';

    // Regex for standard email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regex for specific pattern: test-{timestamp}-user@example.com
    const timestampEmailRegex = /^test-\d{10,}-user@dummyclaim\.com$/;

    // --- Validation starts ---

    let loginSuccess = false;
    let errorMsg = "";

    if (email === "") {
        errorMsg = "Email is required";
    } else if (password === "") {
        errorMsg = "Password is required";
    } else if (!emailRegex.test(email)) {
        errorMsg = "Please enter a valid email address";
    } else if (email === validEmail && password === validPassword) {
        loginSuccess = true;
    } else if (timestampEmailRegex.test(email) && password === validPassword) {
        loginSuccess = true;
    } else {
        errorMsg = "Email or Password is incorrect!";
    }

    if (loginSuccess) {
        // Set cookie for session (simulate secure session)
        setCookie("DummyClaimSessionID", Date.now(), 5); // valid for 5 min
        errorDiv.classList.add('hidden');

        // Delay redirection slightly to ensure cookie is written
        setTimeout(() => {
            console.log('Session cookie after login:', document.cookie);
            window.location.href = 'dashboard.html';
        }, 500); // 100ms is usually enough
    }

    else {
        errorDiv.classList.remove('hidden');
        errorDiv.innerHTML = errorMsg;
    }
});



