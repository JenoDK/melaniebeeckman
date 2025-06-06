import { Marked, Parser, Renderer } from 'marked';

const marked = new Marked();
const originalRenderer = new Renderer();
originalRenderer.parser = new Parser();

marked.use({
    breaks: true,
    renderer: {
        link(link) {
            const oldLink = originalRenderer.link(link);
            return oldLink.replace("<a","<a target='_blank' rel='noreferrer' ");
        },
    },
});

export function markdownAsHtml(markdown: string) {
    return marked.parse(markdown);
}