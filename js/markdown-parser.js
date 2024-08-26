function markdownToHtml(markdown) {
    // Normalize newlines
    markdown = markdown.replace(/\r\n/g, '\n');

    // Handle code blocks with triple backticks (``` ... ```)
    markdown = markdown.replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code class="$1">$2</code></pre>');

    // Handle code blocks with triple tildes (~~~ ... ~~~)
    markdown = markdown.replace(/~~~(\w+)?\n([\s\S]*?)\n~~~\/g, '<pre><code class="$1">$2</code></pre>');

    // Split by `</pre>` to process code blocks and normal text separately
    var html = '';
    var parts = markdown.split('</pre>');

    for (var i = 0; i < parts.length; i++) {
        if (parts[i].endsWith('</code>')) {
            html += '<pre>' + parts[i] + '</pre>';
        } else {
            html += parts[i]
                .replace(/^##### (.*?)$/gm, '<h5>$1</h5>')
                .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
                .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
                .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
                .replace(/^\* (.*?)$/gm, '<ul><li>$1</li></ul>')
                .replace(/^\+ (.*?)$/gm, '<ul><li>$1</li></ul>')
                .replace(/^\- (.*?)$/gm, '<ul><li>$1</li></ul>')
                .replace(/^\d+\. (.*?)$/gm, '<ol><li>$1</li></ol>')
                .replace(/^\> (.*?)$/gm, '<blockquote>$1</blockquote>')
                .replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" />')
                .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
                .replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
                .replace(/\*([^\*]+)\*/gm, '<em>$1</em>')
                .replace(/`([^`]+)`/gm, '<code>$1</code>')
                .replace(/~~([^~]+)~~/gm, '<del>$1</del>')
                .replace(/\\([`*_{}\[\]()#+\-.!])/g, '$1') // Escape Markdown special characters
                .replace(/\n\n+/g, '</p><p>') // Replace multiple newlines with paragraph breaks
                .replace(/^\n+|\n+$/g, ''); // Trim leading and trailing newlines
        }
    }

    return html.trim();
}
