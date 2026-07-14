'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    CopyButton,
    EmptyHint,
    ResultCard,
    ToolActions,
    ToolError,
    inputClass,
    labelClass,
    monoTextareaClass,
} from './shared';

/* ----------------------------------------------------------- Regex tester -- */

export function RegexTester() {
    const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
    const [flags, setFlags] = useState('g');
    const [text, setText] = useState('Contact me at hi@karthiks360.com or test@example.com.');
    const [replacement, setReplacement] = useState('');

    const { matches, error, re } = useMemo(() => {
        if (!pattern) return { matches: [] as RegExpMatchArray[], error: '', re: null as RegExp | null };
        try {
            const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
            return { matches: Array.from(text.matchAll(re)), error: '', re };
        } catch (e) {
            return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex.', re: null };
        }
    }, [pattern, flags, text]);

    const segments = useMemo(() => {
        if (error || matches.length === 0) return [{ text, hit: false }];
        const out: { text: string; hit: boolean }[] = [];
        let last = 0;
        for (const m of matches) {
            const start = m.index ?? 0;
            if (start > last) out.push({ text: text.slice(last, start), hit: false });
            out.push({ text: m[0], hit: true });
            last = start + m[0].length;
        }
        if (last < text.length) out.push({ text: text.slice(last), hit: false });
        return out;
    }, [matches, text, error]);

    const replaced = useMemo(() => {
        if (!re || error) return '';
        try { return text.replace(re, replacement); } catch { return ''; }
    }, [re, text, replacement, error]);

    const loadExample = () => { setPattern('(\\w+)@(\\w+)'); setFlags('g'); setText('Emails: hi@karthiks360, test@example, dev@sisa'); setReplacement('$1 [at] $2'); };
    const clear = () => { setPattern(''); setText(''); setReplacement(''); };

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <div className="flex justify-end">
                    <ToolActions onExample={loadExample} onClear={pattern || text ? clear : undefined} />
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                        <label htmlFor="re-pattern" className={labelClass}>Pattern</label>
                        <input id="re-pattern" type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className={`${inputClass} font-mono`} />
                    </div>
                    <div className="w-20 space-y-2">
                        <label htmlFor="re-flags" className={labelClass}>Flags</label>
                        <input id="re-flags" type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="gi" className={`${inputClass} font-mono`} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="re-text" className={labelClass}>Test string</label>
                    <textarea id="re-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} className={monoTextareaClass} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="re-replace" className={labelClass}>Replace with <span className="text-slate-400 font-normal">($1, $2 for groups)</span></label>
                    <input id="re-replace" type="text" value={replacement} onChange={(e) => setReplacement(e.target.value)} placeholder="replacement…" className={`${inputClass} font-mono`} />
                </div>
            </div>

            <ResultCard>
                {error ? (
                    <ToolError>{error}</ToolError>
                ) : (
                    <>
                        <div className="space-y-1.5">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{matches.length} match{matches.length === 1 ? '' : 'es'}</span>
                            <p className="px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300">
                                {segments.map((s, i) => s.hit ? (
                                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/40 text-slate-900 dark:text-white rounded px-0.5">{s.text}</mark>
                                ) : (<span key={i}>{s.text}</span>))}
                            </p>
                        </div>
                        {matches.some((m) => m.length > 1) && (
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Capture groups (first match)</span>
                                <ul className="space-y-1">
                                    {matches[0].slice(1).map((g, i) => (<li key={i} className="font-mono text-sm text-slate-700 dark:text-slate-300"><span className="text-slate-400">${i + 1}:</span> {g ?? '—'}</li>))}
                                </ul>
                            </div>
                        )}
                        {replacement && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Result</span>
                                    <CopyButton value={replaced} label="" />
                                </div>
                                <textarea rows={2} readOnly value={replaced} className={`${monoTextareaClass} bg-white dark:bg-slate-800`} />
                            </div>
                        )}
                    </>
                )}
            </ResultCard>
        </div>
    );
}

/* --------------------------------------------------------------- CIDR ------ */

function ipToInt(ip: string): number | null {
    const parts = ip.split('.');
    if (parts.length !== 4) return null;
    let n = 0;
    for (const p of parts) {
        const v = Number(p);
        if (!/^\d+$/.test(p) || v < 0 || v > 255) return null;
        n = (n << 8) | v;
    }
    return n >>> 0;
}
const intToIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');

export function CidrCalculator() {
    const [cidr, setCidr] = useState('192.168.1.0/24');

    const { rows, error } = useMemo(() => {
        const [ip, bitsStr] = cidr.trim().split('/');
        const base = ipToInt(ip ?? '');
        const bits = Number(bitsStr);
        if (base === null || !/^\d+$/.test(bitsStr ?? '') || bits < 0 || bits > 32) {
            return { rows: [] as [string, string][], error: 'Enter a valid CIDR, e.g. 192.168.1.0/24.' };
        }
        const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
        const network = (base & mask) >>> 0;
        const broadcast = (network | (~mask >>> 0)) >>> 0;
        const total = 2 ** (32 - bits);
        const usable = bits >= 31 ? total : total - 2;
        return {
            rows: [
                ['Network', intToIp(network)],
                ['Broadcast', intToIp(broadcast)],
                ['Netmask', intToIp(mask)],
                ['First host', intToIp(bits >= 31 ? network : network + 1)],
                ['Last host', intToIp(bits >= 31 ? broadcast : broadcast - 1)],
                ['Total addresses', total.toLocaleString()],
                ['Usable hosts', Math.max(usable, 0).toLocaleString()],
            ] as [string, string][],
            error: '',
        };
    }, [cidr]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cidr-input" className={labelClass}>CIDR block</label>
                    <ToolActions onExample={() => setCidr('10.0.0.0/16')} onClear={cidr ? () => setCidr('') : undefined} />
                </div>
                <input id="cidr-input" type="text" value={cidr} onChange={(e) => setCidr(e.target.value)} className={`${inputClass} font-mono`} />
            </div>

            <ResultCard>
                {error ? (
                    <ToolError>{error}</ToolError>
                ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                        {rows.map(([k, v]) => (
                            <div key={k} className="flex items-center gap-3 px-4 py-2.5">
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-32">{k}</span>
                                <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-100">{v}</code>
                            </div>
                        ))}
                    </div>
                )}
            </ResultCard>
        </div>
    );
}

/* ----------------------------------------------------------- UA parser ----- */

function parseUa(ua: string) {
    const browser =
        /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' :
        /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Unknown';
    const os =
        /Windows NT/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' :
        /(iPhone|iPad|iOS)/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown';
    const engine = /Gecko\/\d/.test(ua) && /Firefox/.test(ua) ? 'Gecko' : /AppleWebKit/.test(ua) ? 'WebKit / Blink' : 'Unknown';
    const mobile = /Mobi|Android|iPhone/.test(ua) ? 'Yes' : 'No';
    return { browser, os, engine, mobile };
}

export function UaParser() {
    const [ua, setUa] = useState('');
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUa(navigator.userAgent);
    }, []);
    const info = useMemo(() => parseUa(ua), [ua]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="ua-input" className={labelClass}>User-Agent</label>
                    <ToolActions onExample={() => setUa(navigator.userAgent)} onClear={ua ? () => setUa('') : undefined} />
                </div>
                <textarea id="ua-input" rows={6} value={ua} onChange={(e) => setUa(e.target.value)} className={monoTextareaClass} />
            </div>

            <ResultCard>
                <div className="grid grid-cols-2 gap-3">
                    {([['Browser', info.browser], ['OS', info.os], ['Engine', info.engine], ['Mobile', info.mobile]] as const).map(([k, v]) => (
                        <div key={k} className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <div className="text-xs font-medium text-slate-400 dark:text-slate-500">{k}</div>
                            <div className="text-slate-900 dark:text-white font-medium">{v}</div>
                        </div>
                    ))}
                </div>
            </ResultCard>
        </div>
    );
}

/* -------------------------------------------------------- HTTP status ------ */

const STATUSES: [number, string][] = [
    [200, 'OK'], [201, 'Created'], [202, 'Accepted'], [204, 'No Content'],
    [301, 'Moved Permanently'], [302, 'Found'], [304, 'Not Modified'], [307, 'Temporary Redirect'], [308, 'Permanent Redirect'],
    [400, 'Bad Request'], [401, 'Unauthorized'], [403, 'Forbidden'], [404, 'Not Found'], [405, 'Method Not Allowed'],
    [409, 'Conflict'], [410, 'Gone'], [418, "I'm a teapot"], [422, 'Unprocessable Entity'], [429, 'Too Many Requests'],
    [500, 'Internal Server Error'], [501, 'Not Implemented'], [502, 'Bad Gateway'], [503, 'Service Unavailable'], [504, 'Gateway Timeout'],
];

const statusColor = (code: number) =>
    code < 300 ? 'text-green-600 dark:text-green-400' : code < 400 ? 'text-blue-600 dark:text-blue-400' :
    code < 500 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';

export function HttpStatusLookup() {
    const [q, setQ] = useState('');
    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return STATUSES;
        return STATUSES.filter(([c, t]) => String(c).includes(s) || t.toLowerCase().includes(s));
    }, [q]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-3">
                <div className="space-y-2">
                    <label htmlFor="http-q" className={labelClass}>Search</label>
                    <input id="http-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="404, forbidden, gateway…" className={inputClass} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Search by status number or name to find its meaning.</p>
            </div>

            <ResultCard>
                <div className="max-h-[24rem] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    {filtered.map(([code, text]) => (
                        <div key={code} className="flex items-center gap-4 px-4 py-2.5">
                            <span className={`font-mono font-bold w-12 ${statusColor(code)}`}>{code}</span>
                            <span className="text-slate-800 dark:text-slate-100">{text}</span>
                        </div>
                    ))}
                    {filtered.length === 0 && <div className="px-4 py-3 text-slate-400 text-sm">No matching status codes.</div>}
                </div>
            </ResultCard>
        </div>
    );
}

/* ---------------------------------------------------------- Timestamp ------ */

export function TimestampConverter() {
    const [input, setInput] = useState('');
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNow(Date.now());
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, []);

    const { local, utc, iso, error } = useMemo(() => {
        const v = input.trim();
        if (!v) return { local: '', utc: '', iso: '', error: '' };
        let date: Date;
        if (/^\d+$/.test(v)) date = new Date(v.length <= 10 ? Number(v) * 1000 : Number(v));
        else date = new Date(v);
        if (Number.isNaN(date.getTime())) return { local: '', utc: '', iso: '', error: 'Unrecognized date or timestamp.' };
        return { local: date.toLocaleString(), utc: date.toUTCString(), iso: date.toISOString(), error: '' };
    }, [input]);

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                {now !== null && (
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Now</span>
                        <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-100">{Math.floor(now / 1000)}</code>
                        <button type="button" onClick={() => setInput(String(Math.floor(now / 1000)))} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">Use</button>
                    </div>
                )}
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <label htmlFor="ts-input" className={labelClass}>Timestamp or date</label>
                        <ToolActions onExample={() => setInput('1700000000')} onClear={input ? () => setInput('') : undefined} />
                    </div>
                    <input id="ts-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="1700000000 or 2026-07-10" className={`${inputClass} font-mono`} />
                    <p className="text-xs text-slate-400 dark:text-slate-500">10-digit = seconds, 13-digit = milliseconds.</p>
                </div>
            </div>

            <ResultCard>
                {error && <ToolError>{error}</ToolError>}
                {!iso && !error && <EmptyHint text="Enter a timestamp or date to convert it." />}
                {iso && (
                    <div className="space-y-2">
                        {([['Local', local], ['UTC', utc], ['ISO 8601', iso]] as const).map(([k, v]) => (
                            <div key={k} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-16">{k}</span>
                                <code className="flex-1 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-100 break-all">{v}</code>
                                <CopyButton value={v} label="" />
                            </div>
                        ))}
                    </div>
                )}
            </ResultCard>
        </div>
    );
}

/* ------------------------------------------------------------ Diff viewer -- */

type DiffLine = { type: 'same' | 'add' | 'remove'; text: string };

function diffLines(a: string[], b: string[]): DiffLine[] {
    const n = a.length, m = b.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--)
        for (let j = m - 1; j >= 0; j--)
            dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const out: DiffLine[] = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
        if (a[i] === b[j]) { out.push({ type: 'same', text: a[i] }); i++; j++; }
        else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: 'remove', text: a[i] }); i++; }
        else { out.push({ type: 'add', text: b[j] }); j++; }
    }
    while (i < n) out.push({ type: 'remove', text: a[i++] });
    while (j < m) out.push({ type: 'add', text: b[j++] });
    return out;
}

export function DiffViewer() {
    const [left, setLeft] = useState('');
    const [right, setRight] = useState('');

    const lines = useMemo(() => {
        if (!left && !right) return [] as DiffLine[];
        return diffLines(left.split('\n'), right.split('\n'));
    }, [left, right]);

    const added = lines.filter((l) => l.type === 'add').length;
    const removed = lines.filter((l) => l.type === 'remove').length;

    const loadExample = () => {
        setLeft('const a = 1;\nconst b = 2;\nconsole.log(a + b);');
        setRight('const a = 1;\nconst b = 3;\nconst c = 4;\nconsole.log(a + b + c);');
    };

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <div className="flex justify-end">
                    <ToolActions onExample={loadExample} onClear={left || right ? () => { setLeft(''); setRight(''); } : undefined} />
                </div>
                <div className="space-y-2">
                    <label className={labelClass}>Original</label>
                    <textarea rows={5} value={left} onChange={(e) => setLeft(e.target.value)} className={monoTextareaClass} placeholder="Paste text…" />
                </div>
                <div className="space-y-2">
                    <label className={labelClass}>Changed</label>
                    <textarea rows={5} value={right} onChange={(e) => setRight(e.target.value)} className={monoTextareaClass} placeholder="Paste text…" />
                </div>
            </div>

            <ResultCard>
                {lines.length === 0 ? (
                    <EmptyHint text="Paste text in both boxes to see the differences." />
                ) : (
                    <>
                        <div className="flex gap-4 text-sm">
                            <span className="text-green-600 dark:text-green-400 font-medium">+{added} added</span>
                            <span className="text-red-600 dark:text-red-400 font-medium">−{removed} removed</span>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-auto max-h-[22rem] font-mono text-sm bg-white dark:bg-slate-800">
                            {lines.map((l, i) => (
                                <div key={i} className={l.type === 'add' ? 'bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300' : l.type === 'remove' ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300' : 'text-slate-600 dark:text-slate-400'}>
                                    <span className="inline-block w-6 select-none text-center opacity-60">{l.type === 'add' ? '+' : l.type === 'remove' ? '-' : ' '}</span>
                                    <span className="whitespace-pre-wrap break-words">{l.text || ' '}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </ResultCard>
        </div>
    );
}
