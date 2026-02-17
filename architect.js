// AI Course Architect Logic
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const architectView = document.getElementById('architectView');
    const dashboardView = document.getElementById('dashboardView');
    const backBtn = document.getElementById('backToDashFromArch');
    const generateBtn = document.getElementById('generateCourseBtn');
    const topicInput = document.getElementById('courseTopic');
    const loadingState = document.getElementById('architectLoading');
    const resultsArea = document.getElementById('architectResults');
    const titleDisplay = document.getElementById('genCourseTitle');
    const moduleList = document.getElementById('genModulesList');

    // Navigation: Dashboard -> Architect
    const openArchitectBtn = document.getElementById('openArchitectBtn');
    if (openArchitectBtn) {
        openArchitectBtn.addEventListener('click', () => {
            if (dashboardView) dashboardView.style.display = 'none';
            architectView.style.display = 'block';
            window.scrollTo(0, 0);
        });
    }

    // Navigation: Architect -> Dashboard
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            architectView.style.display = 'none';
            if (dashboardView) dashboardView.style.display = 'block';
        });
    }

    // Generator Logic
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const topic = topicInput.value.trim();
            if (!topic) {
                alert("Please enter a topic first!");
                return;
            }

            // UI Updates
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            resultsArea.style.display = 'none';
            loadingState.style.display = 'block';

            // Simulate AI Delay (2.5s)
            setTimeout(() => {
                // Generate Mock Data based on Topic
                const curriculum = generateMockCurriculum(topic);

                // Render Results
                renderCurriculum(curriculum);

                // UI Reset
                loadingState.style.display = 'none';
                resultsArea.style.display = 'block';
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Curriculum';
            }, 2500);
        });
    }

    // Mock Generator Function
    // Mock Generator Function
    function generateMockCurriculum(topic) {
        const keywords = topic.split(' ');
        const mainKw = keywords[0] || 'Topic';

        return {
            title: `Mastering ${topic}: From Zero to Hero`,
            modules: [
                {
                    title: `Introduction to ${mainKw} Ecosystem`,
                    duration: "45 mins",
                    script: `Welcome to the future of ${mainKw}! In this comprehensive first module, we are going to demystify the entire ecosystem surrounding ${topic}. We'll start by understanding the historical context—why this technology emerged and the critical problems it solves for modern enterprises. Then, we'll walk through a step-by-step environmental setup, ensuring you have the exact toolchain used by professionals at Google and Meta. By the end of this hour, you will have your first 'Hello World' running and a clear roadmap for the weeks ahead.`,
                    keyPoints: ["History & Evolution", "Environment Setup", "CLI Tools Basics", "First Execution"],
                    quiz: ["What year was this technology released?", "Which command initializes the project?", "Why is the virtual environment important?"]
                },
                {
                    title: "Core Concepts & Architecture",
                    duration: "1h 20m",
                    script: `Now that we're set up, we need to talk about the 'Mental Model'. ${topic} is different effectively because of its unique architecture. We will break down the memory management model, the event loop, and how data flows through the system. I see many beginners skip this theory and struggle later. We won't make that mistake. We will diagram the architecture together and I will show you how to read the official documentation like a senior engineer. This foundation is what separates the coders from the engineers.`,
                    keyPoints: ["Memory Management", "Event Loop Mechanics", "Data Flow", "Architecture Diagrams"],
                    quiz: ["Explain the difference between Stack and Heap here.", "What is the primary thread function?"]
                },
                {
                    title: `Building Your First ${mainKw} App`,
                    duration: "2h 10m",
                    script: `Theory time is over. It's time to build. In this extended module, we are going to build a 'Task Manager' application from scratch. We'll start with the data layer, defining our schemas. Then, we'll move to the logic layer, implementing CRUD operations. Finally, we'll wrap it in a sleek UI. I will code every single line with you, explaining my thought process on variable naming, function structure, and error handling. You will leave this session with a portfolio-ready project.`,
                    keyPoints: ["CRUD Operations", "Schema Design", "UI Implementation", "Error Handling"],
                    quiz: ["What does CRUD stand for?", "How do you handle a null pointer exception?"]
                },
                {
                    title: "Advanced Patterns & Best Practices",
                    duration: "1h 45m",
                    script: `You can build an app, but is it scalable? In this advanced module, we look at the 'Gang of Four' design patterns applied to ${topic}. We will refactor our previous code to use the Factory Pattern and Observer Pattern. We'll also discuss SOLID principles. I will show you 'bad code' vs 'good code' side-by-side. This is the kind of knowledge that aces job interviews. We'll also touch on unit testing and why TDD (Test Driven Development) is a game changer.`,
                    keyPoints: ["Factory & Observer Patterns", "SOLID Principles", "Refactoring Strategies", "TDD Basics"],
                    quiz: ["Define the Single Responsibility Principle.", "When should you use the Factory pattern?"]
                },
                {
                    title: "Deployment & Scaling Strategies",
                    duration: "55 mins",
                    script: `It works on your machine, but does it work on the cloud? In this final module, we are going to containerize our application using Docker. We will write a Dockerfile, build an image, and deploy it to a Kubernetes cluster (simulated). We will also discuss CI/CD pipelines and how to automate your deployment. Finally, we'll talk about scaling—how to handle 10,000 concurrent users without crashing. This is the finish line.`,
                    keyPoints: ["Docker Basics", "CI/CD Pipelines", "Load Balancing", "Cloud Deployment"],
                    quiz: ["What is a Docker field?", "Explain horizontal vs vertical scaling."]
                }
            ]
        };
    }

    function renderCurriculum(data) {
        if (!titleDisplay || !moduleList) return;

        titleDisplay.innerText = data.title;
        moduleList.innerHTML = ''; // Clear previous

        data.modules.forEach((mod, index) => {
            const modEl = document.createElement('div');
            modEl.className = 'generated-module';

            // Build Key Points HTML
            const pointsHtml = mod.keyPoints ?
                `<div style="margin: 10px 0;"><strong>Key Topics:</strong><ul style="padding-left: 20px; list-style: disc; color: var(--text-gray); font-size: 0.9rem;">${mod.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul></div>`
                : '';

            modEl.innerHTML = `
                <div class="module-header">
                    <div class="module-title">
                        <h4>Module ${index + 1}: ${mod.title}</h4>
                    </div>
                    <div class="module-duration">
                        <i class="far fa-clock"></i> ${mod.duration} <i class="fas fa-chevron-down" style="margin-left:10px;"></i>
                    </div>
                </div>
                <div class="module-details">
                    <div class="script-section">
                        <h5><i class="fas fa-robot"></i> AI Instructor Script</h5>
                        <p class="script-content">"${mod.script}"</p>
                    </div>
                    ${pointsHtml}
                    <div style="margin-top:1rem; text-align:right;">
                        <button class="btn btn-sm" style="background:var(--accent-teal); border:none; color:white; padding:8px 16px; border-radius:4px; font-size:0.8rem; cursor:pointer;">
                            <i class="fas fa-plus"></i> Add to Syllabus
                        </button>
                    </div>
                </div>
            `;

            // Add click listener to header
            const header = modEl.querySelector('.module-header');
            const details = modEl.querySelector('.module-details');
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                details.classList.toggle('open');
            });

            moduleList.appendChild(modEl);
        });
    }
});
