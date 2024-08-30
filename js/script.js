document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const navList = document.getElementById('nav-list');
    const searchInput = document.getElementById('search');
    const themeToggle = document.getElementById('theme-toggle');
    const themeDropdown = document.getElementById('theme-dropdown');
    const pageTitle = document.getElementById('page-title');

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
        navList.innerHTML = ''; // Clear existing sidebar items

        sections.forEach(section => {
            const sectionItem = document.createElement('li');
            sectionItem.textContent = section.title;
            sectionItem.classList.add('sidebar-section-title');

            const ul = document.createElement('ul');
            section.articles.forEach(article => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = article.displayName || article.name; // Use displayName or name
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    loadMarkdown(`markdown/${article.name}`); // Automatically add .md extension
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
        const items = navList.querySelectorAll('a');
        items.forEach(item => {
            const articleName = item.textContent;
            const configItem = config.articles.find(article => article.name === articleName);
            if (configItem && configItem.displayName) {
                item.textContent = configItem.displayName;
            }
        });
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

    // Function to parse configuration from Markdown content
    function parseConfig(markdown) {
        const config = {};
        const configStart = markdown.indexOf('-----');
        if (configStart !== -1) {
            const configEnd = markdown.indexOf('-----', configStart + 5);
            if (configEnd !== -1) {
                const configSection = markdown.substring(configStart + 5, configEnd).trim();
                const lines = configSection.split('\n');
                lines.forEach(line => {
                    const [key, value] = line.split(':').map(part => part.trim());
                    if (key && value) {
                        config[key.toLowerCase()] = value;
                    }
                });
            }
        }
        return config;
    }

    // Function to get the section from the URL parameter
    function getSectionFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('section');
    }

    // Example structure of sections with Markdown files
    const sections = [
        {
            title: 'Getting Started',
            articles: [
                { name: 'Home.md', displayName: 'Home' },
                { name: 'User Guide.md', displayName: 'UserGuide' },
                { name: 'Installing cmdR.md', displayName: 'Installing cmdR' }
            ]
        },
        {
            title: 'Advanced Topics',
            articles: [
                { name: 'Create Commands.md', displayName: 'Create Commands' }
            ]
        }
    ];

    // Generate sidebar with sections
    generateSidebar(sections);

    // Load article based on URL parameter or default to the first article
    const articleName = new URLSearchParams(window.location.search).get('article');
    if (articleName) {
        const fileName = `${articleName}.md`;
        // Check if the file exists in any section
        const fileExists = sections.some(section => section.articles.some(article => article.name === fileName));
        if (fileExists) {
            loadMarkdown(`markdown/${fileName}`);
        } else {
            loadArticleNotFound();
        }
    } else {
        // Load the first article in the first section by default
        loadMarkdown(`markdown/${sections[0].articles[0].name}`);
    }

    // Search functionality
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const items = navList.querySelectorAll('li');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
});
