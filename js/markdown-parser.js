function markdownToHtml(markdown) {
    const config = {};
    let content = markdown;

    // Extract configuration section if it exists, between the lines with -----
    const configSection = markdown.match(/-----\s*([\s\S]*?)\s*-----/);
    if (configSection) {
        configSection[1].split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) config[key.trim()] = value.trim();
        });
        // Remove the config section from the content
        content = content.replace(configSection[0], '');
    }

    // Here you can use your Markdown parser or convert Markdown to HTML
    let html = parseMarkdown(content);

    // Return both HTML and config object
    return { htmlContent: html, config };
}

// A simple Markdown parser example (using previously provided regexes or an external library like marked.js)
function parseMarkdown(content) {
    let html = content;

    // Add your Markdown parsing logic here (headers, lists, links, etc.)
    html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

    // Convert lists
    html = html.replace(/^\* (.*)$/gm, '<ul><li>$1</li></ul>');
    html = html.replace(/^\+ (.*)$/gm, '<ul><li>$1</li></ul>');
    html = html.replace(/^\- (.*)$/gm, '<ul><li>$1</li></ul>');

    // Inline code, links, bold, italic, etc.
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Additional parsing as needed...

    return html;
}
