import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const sampleMarkdown = `# Welcome to my Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.
`;

function App() {
  const [markdownText, setMarkdownText] = useState<string>(sampleMarkdown);

  return (
    <div className="flex h-screen bg-gray-100">
      <textarea
        className="w-1/2 h-full p-4 text-base font-mono bg-white border-r border-gray-300 focus:outline-none"
        value={markdownText}
        onChange={(e) => setMarkdownText(e.target.value)}
      ></textarea>
      <div className="w-1/2 h-full p-4 overflow-y-auto">
        <article className="prose lg:prose-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownText}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

export default App;
