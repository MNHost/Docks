function markdownToHtml(markdown) {
    let html = markdown;
 // Tabs
    html = html.replace(/::: tabs\s*([\s\S]*?):::$/gm, function (match, content) {
        // Extract tab titles and contents
        const tabs = content.split(/(?=###\s)/).map(tab => tab.trim());

        // Generate HTML for tabs
        const tabButtons = tabs.map((tab, index) => {
            const title = tab.split('\n')[0].replace(/^###\s/, '');
            return `<button class="tab-button" data-tab="tab${index}">${title}</button>`;
        }).join('');

        const tabContents = tabs.map((tab, index) => {
            const content = tab.replace(/^###\s.*\n/, ''); // Remove title line
            return `<div class="tab-content" data-tab="tab${index}">${markdownToHtml(content)}</div>`;
        }).join('');

        return `<div class="tabs-container">
                    <div class="tab-buttons">${tabButtons}</div>
                    <div class="tab-contents">${tabContents}</div>
                </div>`;
    });
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
       // Images with size and alignment control
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)\s*\{([^}]*)\}/g, function (match, alt, src, properties) {
        let width = '';
        let height = '';
        let align = '';

        const widthMatch = properties.match(/width=(\d+)/);
        const heightMatch = properties.match(/height=(\d+)/);
        const alignMatch = properties.match(/align=(left|center|right)/);

        if (widthMatch) {
            width = `width="${widthMatch[1]}" `;
        }
        if (heightMatch) {
            height = `height="${heightMatch[1]}" `;
        }
        if (alignMatch) {
            align = alignMatch[1]; // Get the alignment value
        }

        // Create the image HTML with alignment
        let imgHtml = `<img src="${src}" alt="${alt}" ${width}${height}>`;

        // Wrap the image in a div with an alignment class
        if (align) {
            imgHtml = `<div class="img-${align}">${imgHtml}</div>`;
        }

        return imgHtml;
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
