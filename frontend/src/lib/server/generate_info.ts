// Generate a html file in the gernated folder from the passed markdown file

const markdownit = require('markdown-it');
const hljs = require('highlight.js');

const fs = require('fs');
const md = markdownit({
    highlight: function (str: any, lang: any) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
  
      return ''; // use external default escaping
    }
  });

export function generateInfoFromMarkdown(filePath: string) {
    md.use(require('markdown-it-container'), 'exercise', {  
        render: function (tokens: any, idx: any) {
    
          if (tokens[idx].nesting === 1) {
            // opening tag
            return '<exercise>\n';
      
          } else {
            // closing tag
            return '</exercise>\n';
          }
        }
    });
    
    // Read the contents of the file synchronously and store it in a variable
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        // console.log('File contents:', fileContent);
    
        // Now you can use the 'fileContent' variable in another routine
        var result = md.render(fileContent);
        // write result to a file called info.html
        fs.writeFileSync('generated/info.svelte', result);
    } catch (err) {
        console.error('Error reading file:', err);
    }
}
// var md = require('markdown-it')();



