document.addEventListener('DOMContentLoaded', function () {
    // Define sections array at the top
    const sections = [
        {
            title: 'Getting Started',
            articles: ['Home', 'User Guide', 'Installing cmdR', 'intro']
        },
        {
            title: 'Advanced Topics',
            articles: ['Create Commands']
        }
    ];

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
            const html = markdownToHtml(text); // This function is defined in markdown-parser.js
            contentDiv.innerHTML = html.htmlContent; // Render the HTML part of the content
            initializeTabs();
        } catch (error) {
            console.error('Error loading markdown:', error);
            loadArticleNotFound();
        }
    }

    // Function to parse the Markdown and extract configuration
    function markdownToHtml(markdown) {
        const config = {};
        let html = markdown;

        // Extract configuration section
        const configSection = markdown.match(/-----(.*?display-name=.*?)-----/s);
        if (configSection) {
            configSection[1].split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) config[key.trim()] = value.trim();
            });
            // Remove the config from the markdown content
            html = html.replace(configSection[0], '');
        }

        // Rest of the Markdown parsing logic (tabs, headers, lists, etc.)
        // ...

        return { htmlContent: html, config };
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

                fetch(`markdown/${article}.md`)
                    .then(response => response.text())
                    .then(text => {
                        // Parse markdown and get the configuration
                        const { config } = markdownToHtml(text);
                        // Use the display-name from the config if it exists, otherwise use the article name
                        link.textContent = config['display-name'] || article;
                    })
                    .catch(error => {
                        console.error('Error loading markdown for sidebar:', error);
                        link.textContent = article; // Fallback to article name in case of error
                    });

                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    loadMarkdown(`markdown/${article}.md`);
                    history.pushState({}, '', window.location.pathname);
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
        contentDiv.innerHTML = html.htmlContent;
    }

    // Get the article from the URL parameter if it exists
    function getArticleFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('article');
    }

    // Generate sidebar with sections
    generateSidebar(sections);

    // Load article based on URL parameter or default to the first article
    const articleName = getArticleFromUrl();
    if (articleName) {
        const fileName = `markdown/${articleName}.md`;
        // Check if the file exists in any section
        const fileExists = sections.some(section => section.articles.includes(articleName));
        if (fileExists) {
            loadMarkdown(fileName);
        } else {
            loadArticleNotFound();
        }
    } else {
        // Load the first article in the first section by default
        loadMarkdown(`markdown/${sections[0].articles[0]}.md`);
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
