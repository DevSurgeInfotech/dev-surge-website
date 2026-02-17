document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    const COOKIE_CONSENT_KEY = 'devsurge_cookie_consent';
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    // Privacy Modal Logic
    const openPrivacyLink = document.querySelectorAll('.privacy-link'); // Any link triggering modal
    const privacyModal = document.getElementById('privacyModal');
    const closeModal = document.querySelector('.close-modal');

    // --- Cookie Consent Logic ---
    function checkCookieConsent() {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Show banner after 2 seconds
            setTimeout(() => {
                if (cookieBanner) cookieBanner.classList.add('show');
            }, 2000);
        }
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Privacy Modal Logic ---
    if (openPrivacyLink.length) {
        openPrivacyLink.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                privacyModal.style.display = 'flex';
            });
        });
    }

    // Fix: Handle multiple close buttons (header X and footer Close)
    if (privacyModal) {
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                privacyModal.style.display = 'none';
            });
        });

        // Close on outside click
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                privacyModal.style.display = 'none';
            }
        });
    }

    // Run Initial Check
    checkCookieConsent();

});
