"use client";

import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        blockquote: ['className', 'lang', 'dir'],
        a: ['href', 'target', 'rel'],
        p: ['lang', 'dir'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        iframe: ['src', 'width', 'height', 'frameBorder', 'allowFullScreen'],
    },
    tagNames: [
        ...(defaultSchema.tagNames || []),
        'blockquote',
        'iframe',
    ],
};

interface SafeMarkdownProps {
    content: string;
    className?: string;
}

export default function SafeMarkdown({ content, className }: SafeMarkdownProps) {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="markdown-h1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="markdown-h2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="markdown-h3" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="markdown-h4" {...props} />,
                    h5: ({ node, ...props }) => <h5 className="markdown-h5" {...props} />,
                    h6: ({ node, ...props }) => <h6 className="markdown-h6" {...props} />,
                    p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}