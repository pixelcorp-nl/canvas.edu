// Generate a html file in the gernated folder from the passed markdown file
import markdownit from 'markdown-it'
import markdownItContainer from 'markdown-it-container'

const md = markdownit({
	highlight: function (str: string) {
		return `<Codeblock code="${md.utils.escapeHtml(str).trim()}" />`
	}
})

md.use(markdownItContainer, 'exercise', {
	render: (tokens: any, idx: any) => {
		if (tokens[idx].nesting === 1) {
			// opening tag
			return '<exercise>\n'
		} else {
			// closing tag
			return '</exercise>\n'
		}
	}
})

export function markdownToHtml(markdown: string) {
	try {
		return md.render(markdown)
	} catch (err) {
		return `Error reading file:${err}`
	}
}
