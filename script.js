document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Sticky Header Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(2, 11, 28, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(2, 11, 28, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Tab Switching Logic
    const navLinksItems = document.querySelectorAll('.nav-link, .nav-link-internal, .nav-link-footer');
    const tabViews = document.querySelectorAll('.tab-view');
    const mainHeader = document.querySelector('.nav-links'); // For active state in header

    function switchTab(targetId) {
        // Hide all tabs
        tabViews.forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none'; // Ensure display none is triggered for animation reset
        });

        // Show target tab
        const targetTab = document.getElementById(targetId);
        if (targetTab) {
            targetTab.style.display = 'block';
            // slight delay to allow display block to render before adding active class for opacity transition
            setTimeout(() => {
                targetTab.classList.add('active');
            }, 10);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update Nav Active State
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            }
        });

        // Close mobile menu if open
        if (window.innerWidth <= 900) {
            navLinks.classList.remove('active');
        }
    }

    navLinksItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (targetId) {
                switchTab(targetId);
            }
        });
    });

    // AI Consultant Logic
    const chatInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const responseArea = document.getElementById('ai-response');

    // Mock Knowledge Base
    const knowledgeBase = {
        'default': "I can help you with digital transformation strategies, software engineering courses, or network solutions. Please ask specifically about these topics.",
        'modernize': "To modernize your business systems, we recommend a cloud-first approach. Migrating legacy data to secure cloud infrastructure and implementing an ERP system can increase efficiency by 40%.",
        'course': "Our most popular courses are 'Full Stack Development' and 'Cybersecurity Essentials'. Both are 12-week intensive programs designed to get you job-ready.",
        'network': "For enterprise networking, we recommend a scalable SD-WAN architecture to ensure secure and reliable connectivity across all your branches.",
        'contact': "You can reach our team at hello@devsurgeinfotech.com or call +233 204 111 358 for a personalized consultation."
    };

    function handleChat() {
        const query = chatInput.value.trim().toLowerCase();
        if (!query) return;

        // Visual feedback
        const originalBtnText = sendBtn.innerText;
        sendBtn.innerText = '...';
        sendBtn.disabled = true;

        // Simulate thinking delay
        setTimeout(() => {
            let response = knowledgeBase['default'];

            if (query.includes('modernize') || query.includes('business')) {
                response = knowledgeBase['modernize'];
            } else if (query.includes('course') || query.includes('learn') || query.includes('study')) {
                response = knowledgeBase['course'];
            } else if (query.includes('network') || query.includes('connect')) {
                response = knowledgeBase['network'];
            } else if (query.includes('contact') || query.includes('email') || query.includes('call')) {
                response = knowledgeBase['contact'];
            }

            // Typewriter effect for response
            responseArea.innerHTML = '';
            let i = 0;
            const typingSpeed = 30;

            function typeWriter() {
                if (i < response.length) {
                    responseArea.innerHTML += response.charAt(i);
                    i++;
                    setTimeout(typeWriter, typingSpeed);
                } else {
                    sendBtn.innerText = originalBtnText;
                    sendBtn.disabled = false;
                }
            }
            typeWriter();

        }, 1500);
    }

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }
});
