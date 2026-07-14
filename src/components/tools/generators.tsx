'use client';

import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';
import {
    CopyButton,
    EmptyHint,
    ResultCard,
    ToolActions,
    ToolError,
    inputClass,
    labelClass,
    readOnlyClass,
    selectClass,
} from './shared';

/* ------------------------------------------------------------------ UUID --- */

export function UuidGenerator() {
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState<string[]>([]);

    const generate = () => setUuids(Array.from({ length: count }, () => crypto.randomUUID()));

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
    }, [count]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="uuid-count" className={labelClass}>How many</label>
                    <select id="uuid-count" value={count} onChange={(e) => setCount(Number(e.target.value))} className={selectClass}>
                        {[1, 5, 10, 25, 50].map((n) => (<option key={n} value={n}>{n}</option>))}
                    </select>
                </div>
                <button type="button" onClick={generate} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
            </div>

            <ResultCard>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{uuids.length} UUIDs</span>
                    <CopyButton value={uuids.join('\n')} label="Copy all" />
                </div>
                <ul className="space-y-1.5 max-h-[22rem] overflow-y-auto">
                    {uuids.map((u, i) => (
                        <li key={`${u}-${i}`} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <code className="flex-1 min-w-0 truncate font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-100">{u}</code>
                            <CopyButton value={u} label="" />
                        </li>
                    ))}
                </ul>
            </ResultCard>
        </div>
    );
}

/* ---------------------------------------------------------------- Lorem ---- */

const LOREM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export function LoremIpsum() {
    const [paras, setParas] = useState(3);
    const output = useMemo(() => Array.from({ length: paras }, () => LOREM).join('\n\n'), [paras]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="lorem-count" className={labelClass}>Paragraphs</label>
                    <span className="font-mono text-slate-900 dark:text-white tabular-nums">{paras}</span>
                </div>
                <input id="lorem-count" type="range" min={1} max={10} value={paras} onChange={(e) => setParas(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <ResultCard>
                <div className="flex justify-end"><CopyButton value={output} /></div>
                <textarea rows={10} readOnly value={output} className={`${readOnlyClass} font-sans bg-white dark:bg-slate-800`} />
            </ResultCard>
        </div>
    );
}

/* ------------------------------------------------------------------ Cron --- */

export function CronHelper() {
    const [expr, setExpr] = useState('*/5 * * * *');

    const { human, runs, error } = useMemo(() => {
        const e = expr.trim();
        if (!e) return { human: '', runs: [] as string[], error: '' };
        try {
            const human = cronstrue.toString(e, { verbose: true });
            const interval = CronExpressionParser.parse(e);
            const runs = Array.from({ length: 5 }, () => interval.next().toDate().toLocaleString());
            return { human, runs, error: '' };
        } catch {
            return { human: '', runs: [], error: 'Invalid cron expression.' };
        }
    }, [expr]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cron-input" className={labelClass}>Cron expression</label>
                    <ToolActions onExample={() => setExpr('30 9 * * 1-5')} onClear={expr ? () => setExpr('') : undefined} />
                </div>
                <input id="cron-input" type="text" value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="*/5 * * * *" className={`${inputClass} font-mono`} />
                <p className="text-xs text-slate-400 dark:text-slate-500">Format: minute hour day-of-month month day-of-week</p>
            </div>

            <ResultCard>
                {error && <ToolError>{error}</ToolError>}
                {!human && !error && <EmptyHint text="Enter a cron expression to see its schedule." />}
                {human && (
                    <>
                        <p className="text-slate-800 dark:text-slate-100 font-medium">{human}</p>
                        <div className="space-y-1.5">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Next 5 runs</span>
                            <ul className="space-y-1">
                                {runs.map((r, i) => (<li key={i} className="font-mono text-sm text-slate-700 dark:text-slate-300">{r}</li>))}
                            </ul>
                        </div>
                    </>
                )}
            </ResultCard>
        </div>
    );
}

/* ---------------------------------------------------------- Snippet builder */

const SNIPPETS: Record<string, string> = {
    'Node (.gitignore)': 'node_modules/\ndist/\n.next/\nout/\n.env\n.env.local\nnpm-debug.log*\n.DS_Store\ncoverage/\n*.log',
    'Python (.gitignore)': '__pycache__/\n*.py[cod]\n.venv/\nvenv/\n.env\n*.egg-info/\ndist/\nbuild/\n.pytest_cache/\n.mypy_cache/',
    'robots.txt (allow all)': 'User-agent: *\nDisallow:\n\nSitemap: https://example.com/sitemap.xml',
    'robots.txt (block all)': 'User-agent: *\nDisallow: /',
    '.editorconfig': 'root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\ntrim_trailing_whitespace = true\nindent_style = space\nindent_size = 2',
};

export function SnippetBuilder() {
    const [key, setKey] = useState(Object.keys(SNIPPETS)[0]);
    const output = SNIPPETS[key];

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <label htmlFor="snippet-select" className={labelClass}>Template</label>
                <select id="snippet-select" value={key} onChange={(e) => setKey(e.target.value)} className={selectClass}>
                    {Object.keys(SNIPPETS).map((k) => (<option key={k} value={k}>{k}</option>))}
                </select>
            </div>

            <ResultCard>
                <div className="flex justify-end"><CopyButton value={output} /></div>
                <textarea rows={9} readOnly value={output} className={`${readOnlyClass} bg-white dark:bg-slate-800`} />
            </ResultCard>
        </div>
    );
}

/* -------------------------------------------------------------- Mock data -- */

const FIRST = ['Ava', 'Liam', 'Noah', 'Maya', 'Ravi', 'Sara', 'Kai', 'Zoe', 'Omar', 'Nina'];
const LAST = ['Smith', 'Patel', 'Kim', 'Garcia', 'Khan', 'Nair', 'Lopez', 'Chen', 'Ali', 'Roy'];
const DOMAINS = ['example.com', 'mail.com', 'test.dev', 'inbox.io'];

function randInt(max: number): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % max;
}
const pick = <T,>(arr: T[]): T => arr[randInt(arr.length)];

function makeRecords(n: number) {
    return Array.from({ length: n }, () => {
        const first = pick(FIRST);
        const last = pick(LAST);
        return {
            id: crypto.randomUUID(),
            name: `${first} ${last}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(DOMAINS)}`,
            age: 18 + randInt(50),
            active: randInt(2) === 1,
        };
    });
}

export function MockData() {
    const [count, setCount] = useState(5);
    const [json, setJson] = useState('');

    const generate = () => setJson(JSON.stringify(makeRecords(count), null, 2));

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setJson(JSON.stringify(makeRecords(count), null, 2));
    }, [count]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="mock-count" className={labelClass}>Records</label>
                    <select id="mock-count" value={count} onChange={(e) => setCount(Number(e.target.value))} className={selectClass}>
                        {[1, 5, 10, 25].map((n) => (<option key={n} value={n}>{n}</option>))}
                    </select>
                </div>
                <button type="button" onClick={generate} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
            </div>

            <ResultCard>
                <div className="flex justify-end"><CopyButton value={json} /></div>
                <textarea rows={12} readOnly value={json} className={`${readOnlyClass} bg-white dark:bg-slate-800`} />
            </ResultCard>
        </div>
    );
}
