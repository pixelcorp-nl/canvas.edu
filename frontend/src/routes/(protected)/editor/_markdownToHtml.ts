// Generate a html file in the gernated folder from the passed markdown file
import type { CustomHtmlElements } from '$lib/sharedTypes'
import markdownit from 'markdown-it'
import markdownItContainer from 'markdown-it-container'

const md = markdownit({
	breaks: true
	// highlight: function (str: string) {
	// 	return `<Codeblock code="${md.utils.escapeHtml(str).trim()}" />`
	// }
})

export const htmlElementToMarkdownKey = {
	'md-exercise': 'exercise',
	'md-codeblock': 'python'
} as const satisfies Record<CustomHtmlElements, string>

for (const [htmlElement, markdownTag] of Object.entries(htmlElementToMarkdownKey)) {
	md.use(markdownItContainer, markdownTag, {
		render: (tokens: any, idx: any) => {
			if (tokens[idx].nesting === 1) {
				// opening tag
				return `<${htmlElement}>\n`
			} else {
				// closing tag
				return `</${htmlElement}>\n`
			}
		}
	})
}

export function markdownToHtml(markdown: string) {
	try {
		return md.render(markdown)
	} catch (err) {
		return `Error reading file:${err}`
	}
}
