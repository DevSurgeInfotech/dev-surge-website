function initChatWidget() {
    const chatBtn = document.getElementById('chatWidgetBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInputForm = document.getElementById('chatInputForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const typingIndicator = document.getElementById('typingIndicator');

    let currentMode = 'ai'; // 'ai' or 'live'

    // Enhanced Knowledge Base
    const knowledgeBase = [
        {
            keywords: ['full stack', 'web dev', 'html', 'react', 'node', 'javascript'],
            response: "Our <strong>Full Stack Software Engineering</strong> course is a 24-week program covering HTML, CSS, JavaScript, React, and Node.js. It's designed to take you from beginner to job-ready developer."
        },
        {
            keywords: ['data', 'analytics', 'python', 'sql', 'machine learning'],
            response: "The <strong>Data Science & Analytics</strong> track is 16 weeks long. You'll master Python, SQL, and Machine Learning to turn data into actionable insights."
        },
        {
            keywords: ['cyber', 'security', 'hack', 'defense'],
            response: "Our <strong>Cybersecurity Essentials</strong> course runs for 12 weeks. It covers ethical hacking, network defense, and system protection strategies."
        },
        {
            keywords: ['cloud', 'aws', 'deploy'],
            response: "The <strong>Cloud Computing (AWS)</strong> course is a 16-week intermediate program focusing on deploying scalable applications and mastering AWS architecture."
        },
        {
            keywords: ['ui', 'ux', 'design', 'figma', 'prototype'],
            response: "Our <strong>UI/UX Product Design</strong> course is perfect for creative minds. In 12 weeks, you'll learn to design intuitive interfaces using Figma."
        },
        {
            keywords: ['mobile', 'app', 'flutter', 'android', 'ios'],
            response: "Join our <strong>Mobile App Development</strong> track! It's a 20-week course where you'll build cross-platform apps for iOS and Android using Flutter & Dart."
        },
        {
            keywords: ['price', 'cost', 'fee', 'much'],
            response: "Our course fees range from <strong>GH₵ 1,500 to GH₵ 3,000</strong> depending on the specific track. Please visit the Student Portal or Contact us for a detailed fee schedule."
        },
        {
            keywords: ['location', 'where', 'address', 'office'],
            response: "Our Operations Base is at <strong>24 Mammomo Street, McCarthy Hill, Accra</strong>. However, please note that our Academy classes are <strong>100% Online</strong>."
        },
        {
            keywords: ['contact', 'email', 'phone', 'call', 'support'],
            response: "You can reach us at <strong>devsurgeinfotech@gmail.com</strong> or call us at <strong>+233 243 441 023 / +233 204 774 174</strong>."
        },
        {
            keywords: ['services', 'corporate', 'business', 'software', 'network'],
            response: "We offer <strong>Enterprise Software Development</strong>, <strong>Network Infrastructure Setup</strong>, and <strong>Corporate Training</strong> for businesses. Check the 'Services' tab for more info."
        },
        {
            keywords: ['hello', 'hi', 'hey', 'start'],
            response: "Hello! Welcome to Dev Surge Infotech. I can help you with info on our <strong>Courses</strong>, <strong>Services</strong>, or <strong>Pricing</strong>. What would you like to know?"
        }
    ];

    // Toggle Chat Window
    function toggleChat() {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            chatInput.focus();
        }
    }

    if (chatBtn) chatBtn.addEventListener('click', toggleChat);
    if (closeChat) closeChat.addEventListener('click', () => chatWindow.classList.remove('open'));

    // Switch Mode
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.getAttribute('data-mode');

            // System message
            addMessage('bot', currentMode === 'ai'
                ? "Switched to AI Assistant. Ask me anything about our courses or services."
                : "Connecting to a live agent... (Simulated: Please leave your query and we'll email you).");
        });
    });

    // Handle Messages
    if (chatInputForm) {
        chatInputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            // User Message
            addMessage('user', text);
            chatInput.value = '';

            // Simulate Response
            showTyping(true);
            setTimeout(() => {
                showTyping(false);
                let response = "";

                if (currentMode === 'ai') {
                    response = getAIResponse(text);
                } else {
                    response = "An agent will be with you shortly. In the meantime, please provide your email address.";
                }

                addMessage(currentMode === 'ai' ? 'bot' : 'agent', response);
            }, 1000 + Math.random() * 1000);
        });
    }

    function addMessage(type, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;
        msgDiv.innerHTML = text; // Changed to innerHTML to support bold tags
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping(show) {
        if (typingIndicator) typingIndicator.style.display = show ? 'block' : 'none';
    }

    // AI Logic
    function getAIResponse(query) {
        query = query.toLowerCase();

        // Search Knowledge Base
        for (const entry of knowledgeBase) {
            for (const keyword of entry.keywords) {
                if (query.includes(keyword)) {
                    return entry.response;
                }
            }
        }

        // Fallback
        return "I'm not sure about that. I can tell you about our <strong>Courses</strong> (like Full Stack, Data Science, etc.), <strong>Pricing</strong>, or <strong>Location</strong>. Would you like to switch to a Live Agent?";
    }
}

document.addEventListener('DOMContentLoaded', initChatWidget);
