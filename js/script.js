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
            // Debugging output
            console.log('Markdown content:', text);
            const { html, config } = markdownToHtml(text); // Updated function returns config
            contentDiv.innerHTML = html;

            // Update sidebar display name from config if available
            if (config['display-name']) {
                document.getElementById('page-title').textContent = config['display-name'];
            }

            // Initialize tabs after content is loaded
            initializeTabs();
            navigateToSection(getSectionFromUrl());

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
                link.textContent = article.displayName || article.title; // Use displayName if available
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    loadMarkdown(`markdown/${article.file}.md`); // Append .md when loading
                    history.pushState({}, '', window.location.pathname); // Remove URL query
                });
                listItem.appendChild(link);
                ul.appendChild(listItem);
            });

            sectionItem.appendChild(ul);
            navList.appendChild(sectionItem);
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
        const html = markdownToHtml(notFoundMarkdown).html; // This function is defined in markdown-parser.js
        contentDiv.innerHTML = html;
    }

    // Get the article from the URL parameter if it exists
    function getArticleFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('article');
    }

    // Get the section from the URL parameter if it exists
    function getSectionFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('section');
    }

    // Function to navigate to a specific section
    function navigateToSection(section) {
        if (section) {
            const targetElement = document.querySelector(`h2[id="${section}"], h3[id="${section}"], h4[id="${section}"], h5[id="${section}"], h6[id="${section}"]`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // Example structure of sections with Markdown files
    const sections = [
        {
            title: 'Getting Started',
            articles: [
                { title: 'Home', file: 'Home', displayName: 'Welcome' },
                { title: 'User Guide', file: 'User Guide' },
                { title: 'Installing cmdR', file: 'Installing cmdR' }
            ]
        },
        {
            title: 'Advanced Topics',
            articles: [
                { title: 'Create Commands', file: 'CreateCommands' }
            ]
        }
    ];

    // Generate sidebar with sections
    generateSidebar(sections);

    // Load article based on URL parameter or default to the first article
    const articleName = getArticleFromUrl();
    if (articleName) {
        const fileName = `${articleName}.md`;
        // Check if the file exists in any section
        const fileExists = sections.some(section => section.articles.some(article => article.file === articleName));
        if (fileExists) {
            loadMarkdown(`markdown/${fileName}`);
        } else {
            loadArticleNotFound();
        }
    } else {
        // Load the first article in the first section by default
        loadMarkdown(`markdown/${sections[0].articles[0].file}.md`);
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
