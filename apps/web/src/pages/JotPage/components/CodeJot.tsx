import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@jot/ui';
import sdk, { VM } from '@stackblitz/sdk';
import { useRef, useState } from 'react';
import { FaPlay, FaTimes } from 'react-icons/fa';
import { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export type CodeJotProps = ReactMarkdownProps & {
  inline?: boolean;
  className?: string;
};

const languageToShortName = {
  javascript: 'js',
  typescript: 'ts',
  html: 'html',
};

const shortNameToLanguage: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  html: 'html',
};

const runnableJotLanguages = ['js', 'ts', 'html'];

function CodeJot({ inline, className, children, ...props }: CodeJotProps) {
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const embedVMRef = useRef<VM | null>(null);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const matchLang = match?.[1] || 'javascript';
  const language = (shortNameToLanguage[matchLang] || matchLang) as
    | 'html'
    | 'javascript'
    | 'typescript';
  const isValidJotLanguage = runnableJotLanguages.includes(language);

  const removeEmbed = () => {
    if (!embedContainerRef.current) return;
    embedVMRef.current = null;
    embedContainerRef.current.replaceChildren();
    setIsEmbedOpen(false);
  };

  const runCode = async () => {
    if (!embedContainerRef.current) return;
    const fileName = `index.${languageToShortName[language]}`;
    embedContainerRef.current.appendChild(document.createElement('div'));
    setIsEmbedOpen(true);

    embedVMRef.current = await sdk.embedProject(
      embedContainerRef.current.firstChild as HTMLDivElement,
      {
        title: 'embed',
        description: `Your ${language} jot`,
        template: language,
        files: {
          'index.html': 'See console',
          [fileName]: String(children),
        },
      },
      {
        // clickToLoad: true,
        openFile: fileName,
        terminalHeight: 50,
        devToolsHeight: 50,
        // hideExplorer: true,
        hideNavigation: true,
        view: 'preview',
      },
    );
  };

  const openInStackblitz = () => {
    if (!embedContainerRef.current) return;
    const fileName = `index.${languageToShortName[language]}`;

    sdk.openProject(
      {
        title: 'My Jot',
        description: `Your ${language} jot`,
        template: language,
        files: {
          'index.html': 'See console',
          [fileName]: String(children),
        },
      },
      {
        // newWindow: true,
        openFile: [fileName],
      },
    );
  };

  return !inline && match ? (
    <Box>
      <Box ref={embedContainerRef} />
      <Box position="relative">
        {isValidJotLanguage && (
          <>
            <Flex position="absolute" right="2" top="2" gap="2">
              <IconButton
                size="xs"
                icon={<ExternalLinkIcon />}
                onClick={openInStackblitz}
                aria-label="Open In StackBlitz"
              />
              <IconButton
                size="xs"
                icon={isEmbedOpen ? <FaTimes color="red" /> : <FaPlay color="green" />}
                onClick={isEmbedOpen ? removeEmbed : runCode}
                aria-label="Run Code"
              />
            </Flex>
          </>
        )}
        <SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </Box>
    </Box>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

export default CodeJot;
