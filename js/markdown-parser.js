function markdownToHtml(markdown) {
    // Extract configuration section
    const configSectionMatch = markdown.match(/-----\n([\s\S]*?)\n-----/);
    let config = {};
    
    if (configSectionMatch) {
        // Parse the configuration
        const configText = configSectionMatch[1];
        configText.split('\n').forEach(line => {
            const [key, value] = line.split('=').map(part => part.trim());
            if (key && value) {
                config[key] = value;
            }
        });
        // Remove configuration section from markdown
        markdown = markdown.replace(configSectionMatch[0], '');
    }

    // Convert Markdown to HTML
    let html = markdown;

    // Tabs
    html = html.replace(/::: tabs\s*([\s\S]*?):::$/gm, function (match, content) {
        const tabs = content.split(/(?=###\s)/).map(tab => tab.trim());

        const tabButtons = tabs.map((tab, index) => {
            const title = tab.split('\n')[0].replace(/^###\s/, '');
            return `<button class="tab-button" data-tab="tab${index}">${title}</button>`;
        }).join('');

        const tabContents = tabs.map((tab, index) => {
            const content = tab.replace(/^###\s.*\n/, '');
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
            align = alignMatch[1];
        }

        let imgHtml = `<img src="${src}" alt="${alt}" ${width}${height}>`;

        if (align) {
            imgHtml = `<div class="img-${align}">${imgHtml}</div>`;
        }

        return imgHtml;
    });

    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Code Blocks
    html = html.replace(/\[mcode\](\w*)\n([\s\S]*?)\[\/mcode\]/g, function (match, p1, p2) {
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

    return { html, config };
}
