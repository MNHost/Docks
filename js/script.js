document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const navList = document.getElementById('nav-list');
    const searchInput = document.getElementById('search');
    const themeSwitcher = document.getElementById('theme-switcher');

    // Function to apply the selected theme
    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme', 'blue-theme');
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme); // Save the selected theme in localStorage
        themeSwitcher.textContent = getThemeSwitcherText(theme);
    }

    // Function to get the text for the theme switcher button
    function getThemeSwitcherText(theme) {
        switch (theme) {
            case 'dark-theme': return 'Switch to Light Theme';
            case 'blue-theme': return 'Switch to Dark Theme';
            default: return 'Switch to Blue Theme';
        }
    }

    // Load the selected theme from localStorage or default to light theme
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);

    // Theme switcher button event listener
    themeSwitcher.addEventListener('click', function () {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light-theme' :
                             document.body.classList.contains('dark-theme') ? 'dark-theme' :
                             document.body.classList.contains('blue-theme') ? 'blue-theme' : 'light-theme';
        const newTheme = currentTheme === 'light-theme' ? 'dark-theme' :
                         currentTheme === 'dark-theme' ? 'blue-theme' :
                         'light-theme';
        applyTheme(newTheme);
    });

    // Function to load Markdown files
    async function loadMarkdown(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('File not found');
            const text = await response.text();
            const html = markdownToHtml(text); // This function is defined in markdown-parser.js
            contentDiv.innerHTML = html;

            // Initialize tabs after content is loaded
            initializeTabs();
        } catch (error) {
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

    // Get the article from the URL parameter if it exists
    function getArticleFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('article');
    }

    // Example structure of sections with Markdown files
    const sections = [
        {
            title: 'Getting Started',
            articles: ['Home.md', 'guide.md', 'Installing cmdR.md']
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
    if (articleName) {
        const fileName = `${articleName}.md`;
        // Check if the file exists in any section
        const fileExists = sections.some(section => section.articles.includes(fileName));
        if (fileExists) {
            loadMarkdown(`markdown/${fileName}`);
        } else {
            loadArticleNotFound();
        }
    } else {
        // Load the first article in the first section by default
        loadMarkdown(`markdown/${sections[0].articles[0]}`);
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
