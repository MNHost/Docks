document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const navList = document.getElementById('nav-list');
    const searchInput = document.getElementById('search');
    const themeToggle = document.getElementById('theme-toggle');
    const themeDropdown = document.getElementById('theme-dropdown');

    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme', 'blue-theme');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);

    themeDropdown.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const newTheme = this.getAttribute('data-theme');
            applyTheme(newTheme);
            themeToggle.textContent = `Theme: ${this.textContent}`;
            themeDropdown.style.display = 'none';
        });
    });

    themeToggle.addEventListener('click', function () {
        const isVisible = themeDropdown.style.display === 'block';
        themeDropdown.style.display = isVisible ? 'none' : 'block';
    });

    async function loadMarkdown(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('File not found');
            const text = await response.text();
            const { html, config } = markdownToHtml(text);
            contentDiv.innerHTML = html;
            initializeTabs();
            addShareButtons();  // Add share buttons after content is loaded
            setTimeout(scrollToHash, 100); // Ensure scrolling after content is loaded
        } catch (error) {
            console.error('Error loading markdown:', error);
            loadArticleNotFound();
        }
    }

    function initializeTabs() {
        const tabsContainers = document.querySelectorAll('.tabs-container');

        tabsContainers.forEach(container => {
            const tabButtons = container.querySelectorAll('.tab-button');
            const tabContents = container.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const targetTab = this.getAttribute('data-tab');
                    
                    // Remove active classes
                    tabContents.forEach(content => content.classList.remove('active'));
                    tabButtons.forEach(btn => btn.classList.remove('active'));

                    // Add active classes
                    container.querySelector(`.tab-content[data-tab="${targetTab}"]`).classList.add('active');
                    this.classList.add('active');
                });
            });

            // Trigger click on the first tab button to activate it by default
            if (tabButtons.length > 0) {
                tabButtons[0].click();
            }
        });
    }

    function addShareButtons() {
        const headers = document.querySelectorAll('h1, h2, h3');

        headers.forEach(header => {
            const shareBtn = document.createElement('span');
            shareBtn.classList.add('header-share-btn');
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            header.style.position = 'relative';  // Ensure header is positioned
            header.appendChild(shareBtn);

            shareBtn.addEventListener('click', () => {
                showSharePopup(header);
            });
        });
    }

    function showSharePopup(header) {
        // Create popup if it doesn't exist
        let popup = document.querySelector('.share-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'share-popup';
            document.body.appendChild(popup);

            // Close button
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                popup.classList.remove('active');
            });
            popup.appendChild(closeBtn);

            // Popup content
            const popupContent = document.createElement('div');
            popupContent.className = 'popup-content';
            popup.appendChild(popupContent);

            // URL input
            const urlInput = document.createElement('input');
            urlInput.setAttribute('readonly', true);
            popupContent.appendChild(urlInput);

            // Copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            popupContent.appendChild(copyBtn);

            // Copy message
            const copyMessage = document.createElement('div');
            copyMessage.className = 'copy-message';
            copyMessage.textContent = 'Copied!';
            popupContent.appendChild(copyMessage);

            // Copy button event
            copyBtn.addEventListener('click', () => {
                urlInput.select();
                document.execCommand('copy');
                copyMessage.style.display = 'block';
                setTimeout(() => {
                    copyMessage.style.display = 'none';
                }, 1000);
            });
        }

        // Set URL
        const articleName = getArticleFromUrl();
        const sectionName = header.textContent.trim();
        const url = `https://cmdrdocs.netlify.app/?article=${articleName}&section=${encodeURIComponent(sectionName)}`;
        popup.querySelector('input').value = url;

        // Position the popup
        const rect = header.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 10}px`; // Add some margin
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.classList.add('active');
    }

    function generateSidebar(sections) {
        sections.forEach(section => {
            const sectionItem = document.createElement('li');
            sectionItem.textContent = section.title;
            sectionItem.classList.add('sidebar-section-title');

            const ul = document.createElement('ul');
            section.articles.forEach(article => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#';

                // Fetch markdown content to parse the configuration
                fetch(`markdown/${article}`)
                    .then(response => response.text())
                    .then(text => {
                        // Extract the display name from config if available
                        const { config } = markdownToHtml(text);
                        link.textContent = config['display-name'] || article.replace('.md', '');
                    })
                    .catch(error => {
                        console.error('Error loading markdown for sidebar:', error);
                        link.textContent = article.replace('.md', ''); // Fallback name in case of error
                    });

                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    loadMarkdown(`markdown/${article}`);
                    history.pushState({}, '', window.location.pathname);
                });

                listItem.appendChild(link);
                ul.appendChild(listItem);
            });

            sectionItem.appendChild(ul);
            navList.appendChild(sectionItem);
        });
    }

    function loadArticleNotFound() {
        const notFoundMarkdown = `
# Oops! Article Not Found

We couldn't find the article you were looking for. This could be due to a typo in the URL or the article may have been moved or deleted. But don't worry, we've got a few options to get you back on track!

![404 Error - Article Not Found](/Designer.png){width=600 height=300 align=center}

### What Can You Do?

- **Double-check the URL**: Make sure the address is correct.
- **Browse Other Articles**: Use the sidebar to explore available topics and find what you're looking for.
- **Return to Home**: Click the button below to go back to the homepage and start fresh.

[button:Go to Home](?article=Home)
        `;
        const html = markdownToHtml(notFoundMarkdown).html;
        contentDiv.innerHTML = html;
    }

    function getArticleFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('article');
    }

    function scrollToHash() {
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section');

        if (section) {
            const normalizedSection = normalizeText(section);
            const headers = document.querySelectorAll('h1, h2, h3');
            headers.forEach(header => {
                const headerText = normalizeText(header.textContent.trim());
                if (headerText === normalizedSection) {
                    header.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    function normalizeText(text) {
        return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    }

    const sections = [
        {
            title: 'Getting Started',
            articles: ['Home.md', 'guide.md', 'Installing cmdR.md', 'intro.md', 'example.md']
        },
        {
            title: 'Advanced Topics',
            articles: ['Create Commands.md']
        }
    ];

    generateSidebar(sections);

    const articleName = getArticleFromUrl();
    if (articleName) {
        const fileName = `${articleName}.md`;
        const fileExists = sections.some(section => section.articles.includes(fileName));
        if (fileExists) {
            loadMarkdown(`markdown/${fileName}`);
        } else {
            loadArticleNotFound();
        }
    } else {
        loadMarkdown(`markdown/${sections[0].articles[0]}`);
    }

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const items = navList.querySelectorAll('li');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
});
