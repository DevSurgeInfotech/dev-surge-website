document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    const POSTS_KEY = 'devsurge_blog_posts_v2';

    // Mock Data for Initial Load (Empty as requested)
    const initialPosts = [];

    // Load posts from localStorage or use initial
    function loadPosts() {
        if (!localStorage.getItem(POSTS_KEY)) {
            localStorage.setItem(POSTS_KEY, JSON.stringify(initialPosts));
        }
        return JSON.parse(localStorage.getItem(POSTS_KEY));
    }

    // Save posts to localStorage
    function savePost(newPost) {
        const posts = loadPosts();
        posts.unshift(newPost);
        localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
        return posts;
    }

    // --- Render Logic ---
    const blogGrid = document.getElementById('blogGrid');

    function renderBlog(posts) {
        if (!blogGrid) return;

        if (posts.length === 0) {
            blogGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No articles published yet. Stay tuned!</div>';
            return;
        }

        blogGrid.innerHTML = posts.map(post => `
            <div class="blog-card" data-id="${post.id}">
                <div class="blog-img" style="background-image: url('${post.image}');">
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-content">
                    <div class="blog-date"><i class="far fa-calendar-alt"></i> ${post.date} • By ${post.author}</div>
                    <h3>${post.title}</h3>
                    <div class="blog-tags-list" style="margin-bottom: 0.5rem;">
                        ${(post.tags || '').split(',').filter(t => t.trim()).map(tag => `<span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; margin-right: 5px; color: var(--accent-teal);">#${tag.trim()}</span>`).join('')}
                    </div>
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

            if (e.target.closest('.delete-btn')) {
                e.stopPropagation();
                if (confirm('Delete this article?')) {
                    deletePost(id);
                }
                return;
            }

            if (e.target.closest('.edit-btn')) {
                e.stopPropagation();
                editPost(id);
                return;
            }

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

        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postImage').value = post.image;
        document.getElementById('postTags').value = post.tags || '';
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContentEditor').value = post.content || '';

        const submitBtn = document.querySelector('.cms-btn');
        submitBtn.innerText = 'Update Article';
        submitBtn.setAttribute('data-edit-id', id);

        document.getElementById('cmsPanel').scrollIntoView({ behavior: 'smooth' });
    }

    function viewPost(id) {
        const posts = loadPosts();
        const post = posts.find(p => p.id === id);

        if (post) {
            const modal = document.getElementById('blogModal');
            if (modal) {
                document.getElementById('modalTitle').innerText = post.title;
                document.getElementById('modalMeta').innerHTML = `
                    <i class="far fa-calendar-alt"></i> ${post.date} • <span class="highlight">${post.category}</span> • By ${post.author}
                    <div class="modal-tags" style="margin-top: 10px;">
                        ${(post.tags || '').split(',').filter(t => t.trim()).map(tag => `<span style="font-size: 0.8rem; background: var(--bg-secondary); border: 1px solid var(--glass-border); padding: 3px 10px; border-radius: 4px; margin-right: 5px; color: var(--accent-teal);">#${tag.trim()}</span>`).join('')}
                    </div>
                `;
                document.getElementById('modalImage').style.backgroundImage = `url('${post.image}')`;
                document.getElementById('modalBody').innerHTML = post.content || `<p>${post.excerpt}</p>`;
                modal.style.display = 'flex';
            }
        }
    };

    const blogModal = document.getElementById('blogModal');
    if (blogModal) {
        const closeBtn = blogModal.querySelector('.close-modal-blog');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => { blogModal.style.display = 'none'; });
        }
        blogModal.addEventListener('click', (e) => { if (e.target === blogModal) blogModal.style.display = 'none'; });
    }

    renderBlog(loadPosts());

    const cmsForm = document.getElementById('cmsForm');
    if (cmsForm) {
        cmsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('postTitle').value;
            const category = document.getElementById('postCategory').value;
            const excerpt = document.getElementById('postExcerpt').value;
            const content = document.getElementById('postContentEditor').value;
            const tags = document.getElementById('postTags').value;
            const imageInput = document.getElementById('postImage').value;
            const image = imageInput ? imageInput : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

            const submitBtn = document.querySelector('.cms-btn');
            const editId = submitBtn.getAttribute('data-edit-id');

            let posts = loadPosts();

            if (editId) {
                posts = posts.map(p => p.id === editId ? {
                    ...p, title, category, excerpt, content, image, tags
                } : p);
                submitBtn.innerText = 'Publish Article';
                submitBtn.removeAttribute('data-edit-id');
            } else {
                const newPost = {
                    id: Date.now().toString(),
                    title,
                    category,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    image,
                    excerpt,
                    content,
                    tags,
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
