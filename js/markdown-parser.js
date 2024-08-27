function markdownToHtml(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

    // Lists
    html = html.replace(/^\* (.*)$/gm, '<ul><li>$1</li></ul>');
    html = html.replace(/^\+ (.*)$/gm, '<ul><li>$1</li></ul>');
    html = html.replace(/^\- (.*)$/gm, '<ul><li>$1</li></ul>');
    
    // Buttons
    html = html.replace(/\[button:([^\]]+)\]\(([^)]+)\)/g, '<button class="button" onclick="window.location.href=\'$2\'">$1</button>');
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)\s*\{([^}]*)\}/g, function (match, alt, src, size) {
        let width = '';
        let height = '';

        const widthMatch = size.match(/width=(\d+)/);
        const heightMatch = size.match(/height=(\d+)/);

        if (widthMatch) {
            width = `width="${widthMatch[1]}" `;
        }
        if (heightMatch) {
            height = `height="${heightMatch[1]}" `;
        }

        return `<img src="${src}" alt="${alt}" ${width}${height}>`;
    });
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images

    // Code Blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, function (match, p1, p2) {
        // p1 is the language specifier, p2 is the code
        return '<pre class="code-block"><code class="' + p1 + '">' + p2 + '</code></pre>';
    });

    // Inline Code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

    // Italics
    html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');

    // Horizontal Rules
    html = html.replace(/^---$/gm, '<hr>');

    // Blockquotes
    html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');

    // Line Breaks
    html = html.replace(/\n/g, '<br>');

    // Remove empty <ul> tags
    html = html.replace(/<ul><\/ul>/g, '');

    return html;
}
