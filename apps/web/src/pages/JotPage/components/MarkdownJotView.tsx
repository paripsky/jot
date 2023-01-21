import '@/github-markdown.css';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import CodeJot from './CodeJot';

type MarkdownJotViewProps = {
  type: string;
  data: unknown;
};

export const MarkdownJotView: React.FC<MarkdownJotViewProps> = ({ data, type }) => {
  return (
    <ReactMarkdown
      className="markdown-body"
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeJot,
        a({ ...props }) {
          return (
            <a target="_blank" {...props}>
              {props.children}
            </a>
          );
        },
      }}
    >
      {type === 'markdown' ? (data as string) : `~~~${type}\n${data as string}\n~~~`}
    </ReactMarkdown>
  );
};
