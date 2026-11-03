'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Maximize2, X } from 'lucide-react';
import { CopyButton, ResultCard, ToolActions, download, inputClass, labelClass, monoTextareaClass, textareaClass } from './shared';

/* -------------------------------------------------------------- Slugify ---- */

/**
 * Unicode-aware: letters, marks and digits from any script are kept (so a
 * Kannada or Hindi title still yields a slug); only Latin combining accents
 * are stripped after NFKD so "café" → "cafe".
 */
export function slugify(s: string): string {
    return s
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '') // strip Latin diacritics
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function Slugify() {
    const [text, setText] = useState('');
    const slug = useMemo(() => slugify(text), [text]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="slug-input" className={labelClass}>Title</label>
                    <ToolActions
                        onExample={() => setText('10 Things I Learned Building a Portfolio!')}
                        onClear={text ? () => setText('') : undefined}
                    />
                </div>
                <input
                    id="slug-input"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="My Awesome Blog Post!"
                    className={inputClass}
                />
            </div>

            <ResultCard>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <code className="flex-1 min-w-0 break-all font-mono text-slate-900 dark:text-white">
                        {slug || <span className="text-slate-400">your-slug-here</span>}
                    </code>
                    <CopyButton value={slug} label="" />
                </div>
            </ResultCard>
        </div>
    );
}

/* --------------------------------------------------------------- Counter --- */

export function TextCounter() {
    const [text, setText] = useState('');

    const stats = useMemo(() => {
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
        const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
        const bytes = new TextEncoder().encode(text).length;
        const readingMins = Math.max(1, Math.round(words / 200));
        return { chars, charsNoSpaces, words, lines, sentences, bytes, readingMins };
    }, [text]);

    const tiles: [string, string | number][] = [
        ['Words', stats.words],
        ['Characters', stats.chars],
        ['No spaces', stats.charsNoSpaces],
        ['Lines', stats.lines],
        ['Sentences', stats.sentences],
        ['Bytes (UTF-8)', stats.bytes],
    ];

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="counter-input" className={labelClass}>Text</label>
                    <ToolActions
                        onExample={() => setText('The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.')}
                        onClear={text ? () => setText('') : undefined}
                    />
                </div>
                <textarea
                    id="counter-input"
                    rows={8}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste text…"
                    className={textareaClass}
                />
            </div>

            <ResultCard>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tiles.map(([label, value]) => (
                        <div key={label} className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                            <div className="font-mono text-2xl text-slate-900 dark:text-white tabular-nums">{value}</div>
                            <div className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</div>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">~{stats.readingMins} min read</p>
            </ResultCard>
        </div>
    );
}

/* --------------------------------------------------------- Markdown prev --- */

export function renderMarkdown(md: string): string {
    return DOMPurify.sanitize(marked.parse(md, { async: false }) as string);
}

export function MarkdownPreview() {
    const [md, setMd] = useState('# Hello\n\nType **Markdown** on the left and see it _rendered_ here.\n\n- Lists\n- `code`\n- [links](https://karthiks360.com)');
    const [full, setFull] = useState(false);

    // marked does not sanitise. Today the only input is this textarea (self-XSS
    // at worst), but the preview is injected via dangerouslySetInnerHTML and
    // the HTML is exported, so it is always passed through DOMPurify — and any
    // future input from the URL/hash/storage must stay behind this line.
    const html = useMemo(() => renderMarkdown(md), [md]);

    // Close the fullscreen overlay on Escape and lock body scroll while open.
    useEffect(() => {
        if (!full) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFull(false);
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [full]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="md-input" className={labelClass}>Markdown</label>
                    <ToolActions
                        onClear={md ? () => setMd('') : undefined}
                        onDownload={html ? () => download('preview.html', html, 'text/html') : undefined}
                    />
                </div>
                <textarea id="md-input" rows={13} value={md} onChange={(e) => setMd(e.target.value)} className={monoTextareaClass} />
            </div>

            <ResultCard label="Preview">
                <div className="flex justify-end items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setFull(true)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <Maximize2 className="w-4 h-4" />
                        Fullscreen
                    </button>
                    <CopyButton value={html} label="Copy HTML" />
                </div>
                <div
                    className="prose-tool px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-h-[15rem] max-h-[24rem] overflow-auto text-slate-800 dark:text-slate-100"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </ResultCard>

            {full && createPortal(
                <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">Markdown Preview</span>
                        <div className="flex items-center gap-4">
                            <CopyButton value={html} label="Copy HTML" />
                            <button
                                type="button"
                                onClick={() => setFull(false)}
                                aria-label="Exit fullscreen"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <div
                            className="prose-tool max-w-3xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}
