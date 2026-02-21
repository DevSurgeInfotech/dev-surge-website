// Portal Authentication Logic

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const authContainer = document.getElementById('authContainer');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const dashboardView = document.getElementById('dashboardView');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfileName = document.querySelector('.student-info h3');
    const userProfileTrack = document.querySelector('.student-info span');
    const userAvatar = document.querySelector('.avatar');

    // Toggle Forms
    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener('click', () => {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            showSignupLink.style.display = 'none';
            showLoginLink.style.display = 'inline';
        });

        showLoginLink.addEventListener('click', () => {
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
            showLoginLink.style.display = 'none';
            showSignupLink.style.display = 'inline';
        });
    }

    // Auth State Observer
    const currentAuth = window.auth || auth; // Fallback for safety

    if (currentAuth) {
        currentAuth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                console.log("User logged in:", user.email);
                authContainer.style.display = 'none';
                dashboardView.style.display = 'block';

                // Update UI with user info
                const displayName = user.displayName || user.email.split('@')[0];
                userProfileName.innerText = `Welcome back, ${displayName}!`;
                userAvatar.innerText = displayName.substring(0, 2).toUpperCase();

                // Admin Features Check
                const aiTools = document.getElementById('aiToolsWidget');
                const cmsPanel = document.getElementById('cmsPanel'); // Blog CMS
                const certPanel = document.getElementById('certPanel'); // Certificate Panel

                if (user.email === 'admin@devsurge.com') {
                    if (aiTools) aiTools.style.display = 'block';
                    if (cmsPanel) cmsPanel.style.display = 'block';
                    if (certPanel) certPanel.style.display = 'block';
                } else {
                    if (aiTools) aiTools.style.display = 'none';
                    if (cmsPanel) cmsPanel.style.display = 'none';
                    if (certPanel) certPanel.style.display = 'none';
                }
            } else {
                // User is signed out
                console.log("User logged out");
                dashboardView.style.display = 'none';
                authContainer.style.display = 'block';
            }
        });
    }

    // Handle Login
    if (loginForm && currentAuth) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Verify...';
            btn.disabled = true;

            currentAuth.signInWithEmailAndPassword(email, password)
                .catch(error => {
                    console.error("Login Failed:", error);
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials' || error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
                        alert("Account not found. If you are an admin, please Create an Account first with this email.");
                    } else {
                        alert("Login Failed: " + error.message);
                    }
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // Handle Signup
    if (signupForm && currentAuth) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const btn = signupForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Creating Account...';
            btn.disabled = true;

            currentAuth.createUserWithEmailAndPassword(email, password)
                .then(cred => {
                    return cred.user.updateProfile({
                        displayName: name
                    });
                })
                .catch(error => {
                    alert('Signup Failed: ' + error.message);
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // Handle Logout
    if (logoutBtn && currentAuth) {
        logoutBtn.addEventListener('click', () => {
            currentAuth.signOut().catch((error) => {
                console.error("Logout Error:", error);
            });
        });
    }

    // Handle Google Login
    const googleBtn = document.getElementById('googleLoginBtn');
    if (googleBtn && currentAuth) {
        googleBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            currentAuth.signInWithPopup(provider)
                .then((result) => {
                    console.log("Google Login Success");
                }).catch((error) => {
                    console.error("Google Login Error:", error);
                    alert("Google Sign-In failed: " + error.message);
                });
        });
    }
    // Classroom Logic
    const continueBtn = document.getElementById('continueLearningBtn');
    const classroomView = document.getElementById('classroomView');
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');

    console.log("Classroom Elements Check:", {
        continueBtn: !!continueBtn,
        classroomView: !!classroomView,
        dashboardView: !!dashboardView
    });

    if (continueBtn && classroomView && dashboardView) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Continue Learning Clicked");
            dashboardView.style.display = 'none';
            classroomView.style.display = 'block';
            window.scrollTo(0, 0);
        });
    } else {
        console.error("Critical elements for classroom navigation missing.");
    }

    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', () => {
            classroomView.style.display = 'none';
            dashboardView.style.display = 'block';
        });
    }
});

// Export loadVideo to global scope for onclick inline handlers
window.loadVideo = function (lessonId, videoId) {
    const player = document.getElementById('videoPlayer');
    if (player) {
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }

    // Simple active state toggle
    // Note: Since this is called via inline HTML onclick, 'event' is available globally in browsers
    if (typeof event !== 'undefined') {
        document.querySelectorAll('.module-item').forEach(item => item.classList.remove('active'));
        // Use closest in case user clicks the icon or text span
        const activeItem = event.target.closest('.module-item');
        if (activeItem) activeItem.classList.add('active');
    }
};
