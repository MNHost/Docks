document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const navList = document.getElementById('nav-list');

    // Function to load Markdown files
    async function loadMarkdown(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('File not found');
            const text = await response.text();
            const html = markdownToHtml(text);
            contentDiv.innerHTML = html;
        } catch (error) {
            loadArticleNotFound();
        }
    }

    // Function to generate the sidebar
    function generateSidebar(files) {
        files.forEach(file => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `?article=${encodeURIComponent(file.replace('.md', ''))}`;
            link.textContent = file.replace('.md', '');
            link.addEventListener('click', (event) => {
                event.preventDefault();
                loadMarkdown(`markdown/${file}`);
            });
            listItem.appendChild(link);
            navList.appendChild(listItem);
        });
    }

    // Function to load the "Article Not Found" page
    function loadArticleNotFound() {
        const notFoundMarkdown = `
# Article Not Found

Sorry, the article you are looking for does not exist. Please check the URL or select another article from the sidebar.

![404 Article Not Found](/Designer.png){width=500 height=1000}

You can navigate back to the [button:Button Text](?article=Home).
        `;
        const html = markdownToHtml(notFoundMarkdown);
        contentDiv.innerHTML = html;
    }

    // Get the article from the URL parameter if it exists
    function getArticleFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('article');
    }

    // Example list of Markdown files
    const markdownFiles = ['Home.md', 'guide.md', 'Create Commands.md'];

    // Generate sidebar
    generateSidebar(markdownFiles);

    // Load article based on URL parameter or default to the first article
    const articleName = getArticleFromUrl();
    if (articleName) {
        const fileName = `${articleName}.md`;
        if (markdownFiles.includes(fileName)) {
            loadMarkdown(`markdown/${fileName}`);
        } else {
            loadArticleNotFound();
        }
    } else {
        loadMarkdown(`markdown/${markdownFiles[0]}`);
    }
});
