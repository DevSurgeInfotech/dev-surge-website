document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    const POSTS_KEY = 'devsurge_blog_posts';

    // Mock Data for Initial Load (if empty)
    const initialPosts = [
        {
            id: '1',
            title: 'Digital Transformation in West Africa: 2026 Outlook',
            category: 'Tech Trends',
            date: 'Feb 16, 2026',
            image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            excerpt: 'From Accra to Lagos, businesses are leapfrogging legacy systems. We explore how cloud adoption and mobile-first strategies are driving economic growth.',
            content: `
                <p>The tech landscape in West Africa is undergoing a rapid evolution. In 2026, we are witnessing a definitive shift from traditional on-premise infrastructure to cloud-native solutions. This transformation is not just about technology; it's about agility and scalability.</p>
                <h3>The Mobile-First Approach</h3>
                <p>With smartphone penetration reaching new highs, businesses are prioritizing mobile-first strategies. This means building lightweight, responsive web applications and native mobile apps that cater to a user base that is predominantly online via mobile devices.</p>
                <h3>Cloud Adoption as a Catalyst</h3>
                <p>SMEs are increasingly leveraging cloud platforms like AWS and Azure to reduce capital expenditure. By moving to the cloud, businesses in Accra and Lagos can scale their operations globally without the heavy upfront cost of physical servers.</p>
                <p>At Dev Surge Infotech, we specialize in guiding enterprises through this precise journey, ensuring data sovereignty issues are addressed while maximizing efficiency.</p>
            `,
            author: 'David Okafor'
        },
        {
            id: '2',
            title: 'Why Every Business Needs a Cybersecurity Audit',
            category: 'Cybersecurity',
            date: 'Feb 12, 2026',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            excerpt: 'Cyber threats are evolving. Discover the 5 most common vulnerabilities in SME networks and how a simple audit can save you millions.',
            content: `
                <p>Cybersecurity is no longer an IT issue; it's a board-level concern. In the past year alone, ransomware attacks targeting small to medium enterprises (SMEs) have risen by 40%.</p>
                <h3>Common Vulnerabilities</h3>
                <ul>
                    <li>Unpatched Software: Running outdated systems is the easiest way for hackers to gain entry.</li>
                    <li>Weak Passwords: Simple, reusable passwords remain a critical weak point.</li>
                    <li>Phishing: Social engineering attacks are becoming more sophisticated.</li>
                </ul>
                <p>A comprehensive Cybersecurity Audit from Dev Surge Infotech identifies these gaps before they can be exploited. We provide a detailed roadmap to secure your digital assets, ensuring compliance with local data protection regulations.</p>
            `,
            author: 'Sarah Mensah'
        },
        {
            id: '3',
            title: 'The Rise of AI: Up-skilling Your Workforce',
            category: 'Software Engineering',
            date: 'Feb 08, 2026',
            image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            excerpt: 'AI is not here to replace jobs, but to augment them. Learn how comprehensive corporate training can prepare your team for the AI revolution.',
            content: `
                 <p>Artificial Intelligence is reshaping the workplace. From automated customer support to predictive analytics, AI tools are becoming ubiquitous. However, the true bottleneck is not technology—it's talent.</p>
                 <h3>Bridging the Skills Gap</h3>
                 <p>Many organizations lack the internal expertise to leverage these new tools effectively. This is where Corporate Training becomes essential. Up-skilling your current workforce is often more cost-effective than hiring new talent.</p>
                 <p>Our tailored workshops at Dev Surge Academy focus on practical application: how to use AI for code generation, data analysis, and process automation. We empower your team to work smarter, not harder.</p>
            `,
            author: 'James Kweku'
        },
        {
            id: '4',
            title: 'Selecting the Right Tech Stack for Your Startup',
            category: 'Business Strategy',
            date: 'Jan 30, 2026',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            excerpt: 'React vs Angular? AWS vs Azure? We break down the pros and cons of modern technologies to help you build a scalable product.',
            content: `
                <p>Choosing a technology stack is one of the most critical decisions a startup founder makes. The wrong choice can lead to technical debt, scalability issues, and trouble hiring.</p>
                <h3>Frontend: React vs. Vue vs. Angular</h3>
                <p>For most startups, React offers the best balance of flexibility and developer availability. Its component-based architecture allows for rapid iteration.</p>
                <h3>Backend: Python vs. Node.js</h3>
                <p>If your product involves heavy data processing or AI, Python (Django/Flask) is the clear winner. For real-time applications like chat or streaming, Node.js is superior.</p>
                <p>Dev Surge Consultants can help you evaluate your specific use case to architect a stack that scales with your growth.</p>
            `,
            author: 'David Okafor'
        }
    ];

    // Load posts from localStorage or use initial
    function loadPosts() {
        // If localStorage is empty, set initial
        if (!localStorage.getItem(POSTS_KEY)) {
            localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts));
        }
        return JSON.parse(localStorage.getItem(POSTS_KEY));
    }

    // Save posts to localStorage
    function savePost(newPost) {
        const posts = loadPosts();
        posts.unshift(newPost); // Add to top
        localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
        return posts;
    }

    // --- Render Logic ---
    const blogGrid = document.getElementById('blogGrid');

    function renderBlog(posts) {
        if (!blogGrid) return;

        blogGrid.innerHTML = posts.map(post => `
            <div class="blog-card" data-id="${post.id}">
                <div class="blog-img" style="background-image: url('${post.image}');">
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-content">
                    <div class="blog-date"><i class="far fa-calendar-alt"></i> ${post.date} • By ${post.author}</div>
                    <h3>${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-actions">
                        <button class="read-more-btn" data-id="${post.id}">Read More</button>
                        <div class="admin-actions" style="display: ${isAdmin() ? 'flex' : 'none'}; gap: 10px;">
                            <button class="edit-btn" data-id="${post.id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-id="${post.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function isAdmin() {
        return localStorage.getItem('userRole') === 'admin' || (typeof auth !== 'undefined' && auth.currentUser && auth.currentUser.email === 'admin@devsurge.com');
    }

    // Event Delegation for Blog Grid
    if (blogGrid) {
        blogGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.blog-card');
            if (!card) return;

            const id = card.getAttribute('data-id');

            // Handle Delete
            if (e.target.closest('.delete-btn')) {
                e.stopPropagation();
                if (confirm('Delete this article?')) {
                    deletePost(id);
                }
                return;
            }

            // Handle Edit
            if (e.target.closest('.edit-btn')) {
                e.stopPropagation();
                editPost(id);
                return;
            }

            // Handle View (Anywhere on card)
            viewPost(id);
        });
    }

    function deletePost(id) {
        let posts = loadPosts();
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
        renderBlog(posts);
    }

    function editPost(id) {
        const post = loadPosts().find(p => p.id === id);
        if (!post) return;

        // Fill form with post data
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postImage').value = post.image;
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContentEditor').value = post.content || '';

        // Change button to update
        const submitBtn = document.querySelector('.cms-btn');
        submitBtn.innerText = 'Update Article';
        submitBtn.setAttribute('data-edit-id', id);

        // Scroll to form
        document.getElementById('cmsPanel').scrollIntoView({ behavior: 'smooth' });
    }

    // View Post Logic
    function viewPost(id) {
        const posts = loadPosts();
        const post = posts.find(p => p.id === id);

        if (post) {
            const modal = document.getElementById('blogModal');
            if (modal) {
                document.getElementById('modalTitle').innerText = post.title;
                document.getElementById('modalMeta').innerHTML = `<i class="far fa-calendar-alt"></i> ${post.date} • <span class="highlight">${post.category}</span> • By ${post.author}`;
                document.getElementById('modalImage').style.backgroundImage = `url('${post.image}')`;
                document.getElementById('modalBody').innerHTML = post.content || `<p>${post.excerpt}</p>`;
                modal.style.display = 'flex';
            }
        }
    };

    // Close Modal Logic
    const blogModal = document.getElementById('blogModal');
    if (blogModal) {
        const closeBtn = blogModal.querySelector('.close-modal-blog');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => { blogModal.style.display = 'none'; });
        }
        blogModal.addEventListener('click', (e) => { if (e.target === blogModal) blogModal.style.display = 'none'; });
    }

    // Initial Render
    renderBlog(loadPosts());

    // --- Admin CMS Logic ---
    // CMS Visibility is handled by portal.js (toggling #cms-panel)

    // Handle Form Submit
    const cmsForm = document.getElementById('cmsForm');
    if (cmsForm) {
        cmsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('postTitle').value;
            const category = document.getElementById('postCategory').value;
            const excerpt = document.getElementById('postExcerpt').value;
            const content = document.getElementById('postContentEditor').value;
            const imageInput = document.getElementById('postImage').value;
            const image = imageInput ? imageInput : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

            const submitBtn = document.querySelector('.cms-btn');
            const editId = submitBtn.getAttribute('data-edit-id');

            let posts = loadPosts();

            if (editId) {
                // Update existing
                posts = posts.map(p => p.id === editId ? {
                    ...p, title, category, excerpt, content, image
                } : p);
                submitBtn.innerText = 'Publish Article';
                submitBtn.removeAttribute('data-edit-id');
            } else {
                // Create new
                const newPost = {
                    id: Date.now().toString(),
                    title,
                    category,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    image,
                    excerpt,
                    content,
                    author: 'Admin'
                };
                posts.unshift(newPost);
            }

            localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
            renderBlog(posts);
            cmsForm.reset();
            alert('Operation Successful!');
        });
    }

});
