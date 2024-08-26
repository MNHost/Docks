document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const navList = document.getElementById('nav-list');
    
    // Function to load Markdown files
    async function loadMarkdown(file) {
        try {
            const response = await fetch(file);
            const text = await response.text();
            const html = marked.parse(text);
            contentDiv.innerHTML = html;
            hljs.highlightAll(); // Highlight code blocks
        } catch (error) {
            contentDiv.innerHTML = `<p>Error loading file: ${error.message}</p>`;
        }
    }

    // Function to generate the sidebar
    function generateSidebar(files) {
        files.forEach(file => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = file.replace('.md', '');
            link.addEventListener('click', () => loadMarkdown(`markdown/${file}`));
            listItem.appendChild(link);
            navList.appendChild(listItem);
        });
    }

    // Example list of Markdown files
    const markdownFiles = ['index.md', 'guide.md'];

    // Generate sidebar and load default content
    generateSidebar(markdownFiles);
    loadMarkdown(`markdown/${markdownFiles[0]}`);
});
