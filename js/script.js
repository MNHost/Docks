document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const navList = document.getElementById('nav-list');
    const searchInput = document.getElementById('search-input');
    const themeSwitcher = document.getElementById('theme-switcher');

    // Function to load Markdown files
    async function loadMarkdown(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('File not found');
            const text = await response.text();
            const html = markdownToHtml(text);
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
        navList.innerHTML = ''; // Clear existing sidebar content

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

        // Initialize search functionality after generating sidebar
        initializeSearch();
    }

    // Function to load the "Article Not Found" page
    function loadArticleNotFound() {
        const notFoundMarkdown = `
# Article Not Found

Sorry, the article you are looking for does not exist. Please check the URL or select another article from the sidebar.

![404 Article Not Found](/Designer.png){width=800 height=400 align=center}

You can navigate back to the [button:Home](?article=Home)
        `;
        const html = markdownToHtml(notFoundMarkdown);
        contentDiv.innerHTML = html;
    }

    // Function to get the article from the URL parameter if it exists
    function getArticleFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('article');
    }

    // Function to initialize the search input
    function initializeSearch() {
        searchInput.addEventListener('input', function () {
            const query = searchInput.value.toLowerCase();
            const links = navList.querySelectorAll('a');

            links.forEach(link => {
                const text = link.textContent.toLowerCase();
                const listItem = link.parentElement;

                if (text.includes(query)) {
                    listItem.style.display = '';
                } else {
                    listItem.style.display = 'none';
                }
            });
        });
    }

    // Function to switch themes
    function switchTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Save the selected theme to local storage
        localStorage.setItem('theme', theme);
    }

    // Function to initialize theme switcher
    function initializeThemeSwitcher() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        switchTheme(savedTheme);

        themeSwitcher.addEventListener('change', function () {
            switchTheme(this.value);
        });
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

    // Initialize theme switcher
    initializeThemeSwitcher();
});
