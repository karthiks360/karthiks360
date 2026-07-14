'use client';

import { useState } from 'react';
import { Check, Copy, Download, Eraser, Sparkles } from 'lucide-react';

/** Shared Tailwind class strings so every tool's controls look identical. */
export const labelClass =
    'block text-slate-700 dark:text-slate-200 font-medium';

export const inputClass =
    'w-full px-5 py-3 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

export const textareaClass = `${inputClass} resize-y`;

export const monoTextareaClass = `${textareaClass} font-mono text-sm`;

export const selectClass = `${inputClass} appearance-none cursor-pointer`;

export const readOnlyClass = `${monoTextareaClass} bg-slate-50 dark:bg-slate-900/60`;

export const primaryButtonClass =
    'w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed';

/** Trigger a client-side file download of some text content. */
export function download(filename: string, content: string, mime = 'text/plain') {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * A right-aligned row of small tool actions. Each button only renders when its
 * handler is provided, so tools opt into exactly the actions that make sense.
 */
export function ToolActions({
    onExample,
    onClear,
    onDownload,
    className = '',
}: {
    onExample?: () => void;
    onClear?: () => void;
    onDownload?: () => void;
    className?: string;
}) {
    const base =
        'inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors';
    return (
        <div className={`flex flex-wrap items-center gap-4 ${className}`}>
            {onExample && (
                <button type="button" onClick={onExample} className={base}>
                    <Sparkles className="w-4 h-4" />
                    Example
                </button>
            )}
            {onDownload && (
                <button type="button" onClick={onDownload} className={base}>
                    <Download className="w-4 h-4" />
                    Download
                </button>
            )}
            {onClear && (
                <button type="button" onClick={onClear} className={base}>
                    <Eraser className="w-4 h-4" />
                    Clear
                </button>
            )}
        </div>
    );
}

/** Muted placeholder shown inside a ResultCard before there's any output. */
export function EmptyHint({ text }: { text: string }) {
    return <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8 px-4">{text}</p>;
}

/** The standard bordered "result" panel used on the right side of a tool. */
export function ResultCard({
    label = 'Result',
    children,
    className = '',
}: {
    label?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-4 ${className}`}>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</span>
            {children}
        </div>
    );
}

/** A recent-items list with copy + clear, used by the link-generating tools. */
export function HistoryList({
    items,
    onClear,
    onPick,
}: {
    items: string[];
    onClear: () => void;
    onPick?: (value: string) => void;
}) {
    if (items.length === 0) return null;
    return (
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Recent</span>
                <button type="button" onClick={onClear} className="text-xs font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    Clear
                </button>
            </div>
            <ul className="space-y-1.5">
                {items.map((v) => (
                    <li key={v} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => onPick?.(v)}
                            className="flex-1 min-w-0 truncate text-left font-mono text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                            title={v}
                        >
                            {v}
                        </button>
                        <CopyButton value={v} label="" />
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** A pill-style segmented toggle used by tools with an encode/decode-type mode. */
export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
}: {
    options: readonly { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
}) {
    return (
        <div className="inline-flex flex-wrap rounded-xl border-2 border-slate-300 dark:border-slate-600 p-1 bg-slate-50 dark:bg-slate-900">
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        value === o.value
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

/** Inline error / hint line shown beneath a field. */
export function ToolError({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-red-600 dark:text-red-400 text-sm" role="alert">
            {children}
        </p>
    );
}

/** A copy-to-clipboard button that flips to a check for a beat after copying. */
export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard can be blocked (insecure context / denied permission);
            // fail quietly rather than throwing at the user.
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            disabled={!value}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
            {copied ? <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : label}
        </button>
    );
}
