'use client';

import { useMemo, useState } from 'react';
import { CopyButton, ResultCard, ToolActions, labelClass, textareaClass } from './shared';

/** Split arbitrary text into words, handling camelCase and separators. */
function toWords(s: string): string[] {
    return s
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_\-]+/g, ' ')
        .replace(/[^a-zA-Z0-9 ]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

function conversions(text: string): { label: string; value: string }[] {
    const words = toWords(text);
    return [
        { label: 'UPPERCASE', value: text.toUpperCase() },
        { label: 'lowercase', value: text.toLowerCase() },
        { label: 'Title Case', value: text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) },
        {
            label: 'Sentence case',
            value: text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
        },
        { label: 'camelCase', value: words.map((w, i) => (i === 0 ? w.toLowerCase() : cap(w))).join('') },
        { label: 'PascalCase', value: words.map(cap).join('') },
        { label: 'snake_case', value: words.map((w) => w.toLowerCase()).join('_') },
        { label: 'kebab-case', value: words.map((w) => w.toLowerCase()).join('-') },
        { label: 'CONSTANT_CASE', value: words.map((w) => w.toUpperCase()).join('_') },
    ];
}

export function CaseConverter() {
    const [text, setText] = useState('');
    const results = useMemo(() => conversions(text), [text]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="case-input" className={labelClass}>Text</label>
                    <ToolActions
                        onExample={() => setText('the quick brown fox')}
                        onClear={text ? () => setText('') : undefined}
                    />
                </div>
                <textarea
                    id="case-input"
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste text to convert…"
                    className={textareaClass}
                />
            </div>

            <ResultCard>
                <ul className="divide-y divide-slate-200 dark:divide-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                    {results.map((r) => (
                        <li key={r.label} className="flex items-center gap-3 px-4 py-2.5">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-28 shrink-0">{r.label}</span>
                            <span className="flex-1 min-w-0 truncate text-sm text-slate-800 dark:text-slate-100">
                                {r.value || <span className="text-slate-400">—</span>}
                            </span>
                            <CopyButton value={r.value} label="" />
                        </li>
                    ))}
                </ul>
            </ResultCard>
        </div>
    );
}
