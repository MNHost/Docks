document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const navList = document.getElementById('nav-list');
    const searchInput = document.getElementById('search');
    const themeToggle = document.getElementById('theme-toggle');
    const themeDropdown = document.getElementById('theme-dropdown');

    // Function to apply the selected theme
    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme', 'blue-theme');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme); // Save the selected theme in localStorage
    }

    // Function to load the selected theme from localStorage or default to light theme
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);

    // Dropdown item event listeners
    themeDropdown.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const newTheme = this.getAttribute('data-theme');
            applyTheme(newTheme);
            themeToggle.textContent = `Theme: ${this.textContent}`; // Update button text
            themeDropdown.style.display = 'none'; // Hide dropdown after selection
        });
    });

    // Toggle dropdown visibility
    themeToggle.addEventListener('click', function () {
        const isVisible = themeDropdown.style.display === 'block';
        themeDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Function to load Markdown files
    async function loadMarkdown(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('File not found');
            const text = await response.text();
            const config = parseConfig(text); // Parse configuration from the Markdown content
            const html = markdownToHtml(text); // Convert Markdown to HTML
            contentDiv.innerHTML = html;

            // Initialize tabs after content is loaded
            initializeTabs();

            // Update sidebar items based on configuration
            updateSidebarItems(config);

            // Scroll to section if specified
            const section = getSectionFromUrl();
            if (section) {
                const targetElement = document.getElementById(section);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } catch (error) {
            console.error('Error loading markdown:', error);
            loadArticleNotFound();
        }
    }

    // Function to initialize tab functionality
    function initializeTabs() {
        const tabsContainers = document.querySelectorAll('.tabs-container');

        tabsContainers.forEach(container => {
            const tabButtons = container.querySelectorAll('.tab-buttons button');
            const tabContents = container.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const targetTab = this.getAttribute('data-tab');

                    // Hide all tabs
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                    });

                    // Show the selected tab
                    container.querySelector(`.tab-content[data-tab="${targetTab}"]`).classList.add('active');

                    // Set the active button
                    tabButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });

            // Initialize first tab
            if (tabButtons.length > 0) {
                tabButtons[0].click();
            }
        });
    }

    // Function to generate the sidebar with sections
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
                link.textContent = article.replace('.md', '');
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    loadMarkdown(`markdown/${article}`);
                    history.pushState({}, '', window.location.pathname); // Remove URL query
                });
                listItem.appendChild(link);
                ul.appendChild(listItem);
            });

            sectionItem.appendChild(ul);
            navList.appendChild(sectionItem);
        });
    }

    // Function to update sidebar items based on configuration
    function updateSidebarItems(config) {
        if (config['display-name']) {
            // Find the sidebar item with the corresponding article name and update its text
            const items = navList.querySelectorAll('li');
            items.forEach(item => {
                const link = item.querySelector('a');
                if (link && link.textContent === currentArticle.replace('.md', '')) {
                    link.textContent = config['display-name'];
                }
            });
        }
    }

    // Function to parse the configuration from Markdown content
    function parseConfig(markdown) {
        const config = {};
        const configSection = markdown.match(/-----([\s\S]*?)-----/);
        if (configSection) {
            const configText = configSection[1].trim();
            configText.split('\n').forEach(line => {
                const [key, value] = line.split('=').map(part => part.trim());
                if (key && value) {
                    config[key] = value;
                }
            });
        }
        return config;
    }

    // Function to load the "Article Not Found" page
    function loadArticleNotFound() {
        const notFoundMarkdown = `
# Article Not Found

Sorry, the article you are looking for does not exist. Please check the URL or select another article from the sidebar.

![404 Article Not Found](/Designer.png){width=800 height=400 align=center}

You can navigate back to the [button:Home](?article=Home)
        `;
        const html = markdownToHtml(notFoundMarkdown); // This function is defined in markdown-parser.js
        contentDiv.innerHTML = html;
    }

    // Get the article and section from URL parameters
    function getArticleFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('article');
    }

    function getSectionFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('section');
    }

    // Example structure of sections with Markdown files
    const sections = [
        {
            title: 'Getting Started',
            articles: ['Home.md', 'User Guide.md', 'Installing cmdR.md']
        },
        {
            title: 'Advanced Topics',
            articles: ['Create Commands.md']
        }
    ];

    // Generate sidebar with sections
    generateSidebar(sections);

    // Load article based on URL parameter or default to the first article
    const articleName = getArticleFromUrl();
    const section = getSectionFromUrl();
    let fileName = '';
    if (articleName) {
        fileName = `${articleName}.md`;
        // Check if the file exists in any section
        const fileExists = sections.some(section => section.articles.includes(fileName));
        if (fileExists) {
            loadMarkdown(`markdown/${fileName}`);
        } else {
            loadArticleNotFound();
        }
    } else {
        // Load the first article in the first section by default
        fileName = sections[0].articles[0];
        loadMarkdown(`markdown/${fileName}`);
    }

    // Search functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const items = navList.querySelectorAll('li');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
});
