'use client';

import { useMemo, useState } from 'react';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import {
    CopyButton,
    EmptyHint,
    ResultCard,
    SegmentedControl,
    ToolActions,
    ToolError,
    download,
    inputClass,
    labelClass,
    monoTextareaClass,
} from './shared';

/* -------------------------------------------------------------- JSON fmt --- */

function sortKeys(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sortKeys);
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.keys(value as Record<string, unknown>).sort().map((k) => [k, sortKeys((value as Record<string, unknown>)[k])]),
        );
    }
    return value;
}

function queryPath(obj: unknown, path: string): unknown {
    const tokens = path.replace(/^\$\.?/, '').replace(/\[(\w+)\]/g, '.$1').split('.').filter(Boolean);
    let cur: unknown = obj;
    for (const t of tokens) {
        if (cur == null || typeof cur !== 'object') return undefined;
        cur = (cur as Record<string, unknown>)[t];
    }
    return cur;
}

const JSON_EXAMPLE = '{"name":"Karthik","roles":["dev","admin"],"active":true,"meta":{"age":29,"city":"Bengaluru"}}';

export function JsonFormatter() {
    const [mode, setMode] = useState<'pretty' | 'minify'>('pretty');
    const [sort, setSort] = useState(false);
    const [input, setInput] = useState('');
    const [path, setPath] = useState('');

    const { output, error, parsed } = useMemo(() => {
        if (!input.trim()) return { output: '', error: '', parsed: undefined as unknown };
        try {
            const p = JSON.parse(input);
            const shaped = sort ? sortKeys(p) : p;
            return { output: JSON.stringify(shaped, null, mode === 'pretty' ? 2 : 0), error: '', parsed: p };
        } catch (e) {
            return { output: '', error: e instanceof Error ? e.message : 'Invalid JSON.', parsed: undefined };
        }
    }, [input, mode, sort]);

    const pathResult = useMemo(() => {
        if (parsed === undefined || !path.trim()) return '';
        const r = queryPath(parsed, path.trim());
        return r === undefined ? '(no match)' : JSON.stringify(r, null, 2);
    }, [parsed, path]);

    return (
        <FieldPair
            controls={
                <div className="flex flex-wrap items-center gap-4">
                    <SegmentedControl value={mode} onChange={setMode} options={[{ value: 'pretty', label: 'Pretty' }, { value: 'minify', label: 'Minify' }]} />
                    <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} className="accent-blue-600" />
                        Sort keys
                    </label>
                </div>
            }
            belowInput={
                parsed !== undefined ? (
                    <div className="space-y-2">
                        <label htmlFor="json-path" className={labelClass}>Query <span className="text-slate-400 font-normal">(e.g. $.meta.city)</span></label>
                        <input id="json-path" type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="$.meta.city" className={`${inputClass} font-mono`} />
                        {path.trim() && (
                            <pre className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-800 dark:text-slate-100 overflow-x-auto">{pathResult}</pre>
                        )}
                    </div>
                ) : undefined
            }
            input={input}
            setInput={setInput}
            output={output}
            error={error}
            inLabel="JSON"
            outLabel="Formatted"
            example={JSON_EXAMPLE}
            downloadName="formatted.json"
        />
    );
}

/* ------------------------------------------------------------- JSON<>YAML -- */

export function YamlConverter() {
    const [dir, setDir] = useState<'json2yaml' | 'yaml2json'>('json2yaml');
    const [input, setInput] = useState('');

    const { output, error } = useMemo(() => {
        if (!input.trim()) return { output: '', error: '' };
        try {
            if (dir === 'json2yaml') return { output: yamlDump(JSON.parse(input)), error: '' };
            return { output: JSON.stringify(yamlLoad(input), null, 2), error: '' };
        } catch (e) {
            return { output: '', error: e instanceof Error ? e.message : 'Conversion failed.' };
        }
    }, [input, dir]);

    return (
        <FieldPair
            controls={<SegmentedControl value={dir} onChange={setDir} options={[{ value: 'json2yaml', label: 'JSON → YAML' }, { value: 'yaml2json', label: 'YAML → JSON' }]} />}
            input={input}
            setInput={setInput}
            output={output}
            error={error}
            inLabel={dir === 'json2yaml' ? 'JSON' : 'YAML'}
            outLabel={dir === 'json2yaml' ? 'YAML' : 'JSON'}
            example={dir === 'json2yaml' ? JSON_EXAMPLE : 'name: Karthik\nroles:\n  - dev\n  - admin\nactive: true'}
            downloadName={dir === 'json2yaml' ? 'data.yaml' : 'data.json'}
        />
    );
}

/* -------------------------------------------------------------- CSV<>JSON -- */

/**
 * RFC 4180-style parser over the whole string, so a quoted field can hold
 * commas, doubled quotes ("") and line breaks. Handles \n, \r\n and a BOM.
 */
export function parseCsv(csv: string): string[][] {
    const src = csv.replace(/^﻿/, '');
    const rows: string[][] = [];
    let row: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if (inQ) {
            if (c === '"') {
                if (src[i + 1] === '"') { cur += '"'; i++; }
                else inQ = false;
            } else cur += c;
        } else if (c === '"') inQ = true;
        else if (c === ',') { row.push(cur); cur = ''; }
        else if (c === '\n' || c === '\r') {
            if (c === '\r' && src[i + 1] === '\n') i++;
            row.push(cur); cur = '';
            rows.push(row); row = [];
        } else cur += c;
    }
    if (cur !== '' || row.length > 0) { row.push(cur); rows.push(row); }
    // Blank lines (e.g. a trailing newline) are not records.
    return rows.filter((r) => r.length > 1 || r[0] !== '');
}

export function csvToJson(csv: string): string {
    const [head, ...body] = parseCsv(csv);
    if (!head) return '[]';
    return JSON.stringify(body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? '']))), null, 2);
}

export function jsonToCsv(json: string): string {
    const data = JSON.parse(json);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return '';
    const headers = Array.from(new Set(arr.flatMap((o) => Object.keys(o ?? {}))));
    const esc = (v: unknown) => {
        const s = v == null ? '' : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return [headers.join(','), ...arr.map((o) => headers.map((h) => esc(o?.[h])).join(','))].join('\n');
}

export function CsvJsonConverter() {
    const [dir, setDir] = useState<'csv2json' | 'json2csv'>('csv2json');
    const [input, setInput] = useState('');

    const { output, error } = useMemo(() => {
        if (!input.trim()) return { output: '', error: '' };
        try {
            return { output: dir === 'csv2json' ? csvToJson(input) : jsonToCsv(input), error: '' };
        } catch (e) {
            return { output: '', error: e instanceof Error ? e.message : 'Conversion failed.' };
        }
    }, [input, dir]);

    return (
        <FieldPair
            controls={<SegmentedControl value={dir} onChange={setDir} options={[{ value: 'csv2json', label: 'CSV → JSON' }, { value: 'json2csv', label: 'JSON → CSV' }]} />}
            input={input}
            setInput={setInput}
            output={output}
            error={error}
            inLabel={dir === 'csv2json' ? 'CSV' : 'JSON'}
            outLabel={dir === 'csv2json' ? 'JSON' : 'CSV'}
            example={dir === 'csv2json' ? 'name,role,active\nKarthik,dev,true\nAsha,admin,false' : '[{"name":"Karthik","role":"dev"},{"name":"Asha","role":"admin"}]'}
            downloadName={dir === 'csv2json' ? 'data.json' : 'data.csv'}
        />
    );
}

/* -------------------------------------------------------------- JSON→TS ---- */

/**
 * Infers interfaces from a JSON sample. Every element of an array is looked
 * at (not just the first): primitives become a union, and objects are merged
 * into one interface where a key missing from some elements is optional.
 */
export function jsonToTs(value: unknown, name = 'Root'): string {
    const interfaces: string[] = [];
    const used = new Set<string>();
    const pascal = (s: string) => s.replace(/(^|_|-|\s)(\w)/g, (_, __, c) => c.toUpperCase());
    const uniqueName = (base: string) => {
        const root = base || 'Item';
        let n = root;
        for (let i = 2; used.has(n); i++) n = `${root}${i}`;
        used.add(n);
        return n;
    };
    const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
    const wrapArray = (t: string) => (t.includes(' | ') ? `(${t})[]` : `${t}[]`);

    // The type for a set of values that share a key (or are elements of one array).
    function typeOfMany(values: unknown[], key: string): string {
        const types = new Set<string>();
        const objs = values.filter(isObj);
        if (objs.length > 0) types.add(buildMerged(objs, key));
        for (const v of values) {
            if (isObj(v)) continue;
            if (v === null) types.add('null');
            else if (Array.isArray(v)) types.add(v.length === 0 ? 'unknown[]' : wrapArray(typeOfMany(v, key)));
            else types.add(typeof v);
        }
        return types.size === 0 ? 'unknown' : [...types].join(' | ');
    }
    function buildMerged(objs: Record<string, unknown>[], key: string): string {
        const iName = uniqueName(pascal(key));
        const keys = Array.from(new Set(objs.flatMap((o) => Object.keys(o))));
        const lines = keys.map((k) => {
            const present = objs.filter((o) => k in o);
            const optional = present.length < objs.length;
            const safeKey = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
            return `  ${safeKey}${optional ? '?' : ''}: ${typeOfMany(present.map((o) => o[k]), k)};`;
        });
        interfaces.push(`interface ${iName} {\n${lines.join('\n')}\n}`);
        return iName;
    }

    const rootName = pascal(name) || 'Root';
    if (isObj(value)) {
        buildMerged([value], rootName);
        return interfaces.reverse().join('\n\n');
    }
    used.add(rootName);
    const t = Array.isArray(value)
        ? (value.length === 0 ? 'unknown[]' : wrapArray(typeOfMany(value, `${rootName}Item`)))
        : typeOfMany([value], rootName);
    return [`type ${rootName} = ${t};`, ...interfaces.reverse()].join('\n\n');
}

export function JsonToTs() {
    const [input, setInput] = useState('');
    const { output, error } = useMemo(() => {
        if (!input.trim()) return { output: '', error: '' };
        try {
            return { output: jsonToTs(JSON.parse(input)), error: '' };
        } catch (e) {
            return { output: '', error: e instanceof Error ? e.message : 'Invalid JSON.' };
        }
    }, [input]);

    return <FieldPair input={input} setInput={setInput} output={output} error={error} inLabel="JSON" outLabel="TypeScript" example={JSON_EXAMPLE} downloadName="types.ts" />;
}

/* --------------------------------------------------------------- SQL fmt --- */

// Longest phrases first: the alternation is leftmost-first, so "INNER JOIN"
// must win over "JOIN" and "DELETE FROM" over "FROM" at the same position.
const SQL_KEYWORDS = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INSERT INTO', 'DELETE FROM', 'GROUP BY', 'ORDER BY', 'SELECT', 'FROM', 'WHERE', 'JOIN', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'VALUES', 'UPDATE', 'SET', 'AND', 'OR', 'ON'];
const SQL_KEYWORD_RE = new RegExp(`\\s*\\b(${SQL_KEYWORDS.join('|')})\\b`, 'gi');
const SQL_INDENTED = new Set(['AND', 'OR', 'ON']);
// Single-, double- and backtick-quoted literals ('' and \ escapes included).
// Splitting on this leaves literals at the odd indices so they are never
// touched: `WHERE name = 'on sale'` must keep its value intact.
const SQL_LITERAL_RE = /('(?:[^'\\]|\\.|'')*'|"(?:[^"\\]|\\.)*"|`[^`]*`)/;

export function formatSql(sql: string): string {
    const out = sql
        .split(SQL_LITERAL_RE)
        .map((part, i) => {
            if (i % 2 === 1) return part;
            return part
                .replace(/\s+/g, ' ')
                .replace(SQL_KEYWORD_RE, (_, kw: string) => {
                    const up = kw.toUpperCase().replace(/\s+/g, ' ');
                    return (SQL_INDENTED.has(up) ? '\n  ' : '\n') + up;
                })
                .replace(/,\s*/g, ',\n  ');
        })
        .join('');
    return out.replace(/^\s*\n/, '').trim();
}

export function SqlFormatter() {
    const [input, setInput] = useState('');
    const output = useMemo(() => (input.trim() ? formatSql(input) : ''), [input]);
    return <FieldPair input={input} setInput={setInput} output={output} error="" inLabel="SQL" outLabel="Formatted" example="select id, name, email from users u join orders o on o.user_id = u.id where u.active = 1 order by name limit 10" downloadName="query.sql" />;
}

/* --------------------------------------------------------------- XML fmt --- */

const ELEMENT_NODE = 1, TEXT_NODE = 3, CDATA_NODE = 4, PI_NODE = 7, COMMENT_NODE = 8;

/** Pretty-prints by walking the parsed DOM, so comments, CDATA and `<` inside text survive. */
export function formatXml(xml: string): string {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid XML.');
    const PADDING = '  ';
    const lines: string[] = [];
    const decl = xml.match(/^\s*<\?xml[^>]*\?>/);
    if (decl) lines.push(decl[0].trim());

    const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const attrs = (el: Element) =>
        Array.from(el.attributes).map((a) => ` ${a.name}="${escText(a.value).replace(/"/g, '&quot;')}"`).join('');

    const walk = (node: Node, depth: number) => {
        const indent = PADDING.repeat(depth);
        switch (node.nodeType) {
            case ELEMENT_NODE: {
                const el = node as Element;
                const tag = el.nodeName;
                const kids = Array.from(el.childNodes).filter((n) => !(n.nodeType === TEXT_NODE && !(n.textContent ?? '').trim()));
                if (kids.length === 0) {
                    lines.push(`${indent}<${tag}${attrs(el)}/>`);
                } else if (kids.length === 1 && kids[0].nodeType === TEXT_NODE) {
                    lines.push(`${indent}<${tag}${attrs(el)}>${escText((kids[0].textContent ?? '').trim())}</${tag}>`);
                } else {
                    lines.push(`${indent}<${tag}${attrs(el)}>`);
                    kids.forEach((k) => walk(k, depth + 1));
                    lines.push(`${indent}</${tag}>`);
                }
                return;
            }
            case TEXT_NODE: lines.push(indent + escText((node.textContent ?? '').trim())); return;
            case CDATA_NODE: lines.push(`${indent}<![CDATA[${node.textContent ?? ''}]]>`); return;
            case COMMENT_NODE: lines.push(`${indent}<!--${node.textContent ?? ''}-->`); return;
            case PI_NODE: lines.push(`${indent}<?${(node as ProcessingInstruction).target} ${node.textContent ?? ''}?>`); return;
            default: return; // doctype etc.
        }
    };
    Array.from(doc.childNodes).forEach((n) => walk(n, 0));
    return lines.join('\n');
}

export function XmlFormatter() {
    const [input, setInput] = useState('');
    const { output, error } = useMemo(() => {
        if (!input.trim()) return { output: '', error: '' };
        try {
            return { output: formatXml(input), error: '' };
        } catch (e) {
            return { output: '', error: e instanceof Error ? e.message : 'Invalid XML.' };
        }
    }, [input]);
    return <FieldPair input={input} setInput={setInput} output={output} error={error} inLabel="XML" outLabel="Formatted" example='<note><to>Karthik</to><from>Asha</from><body>Hi there</body></note>' downloadName="formatted.xml" />;
}

/* ----------------------------------------------------------- query-string -- */

export function QueryStringTool() {
    const [dir, setDir] = useState<'qs2json' | 'json2qs'>('qs2json');
    const [input, setInput] = useState('');

    const { output, error } = useMemo(() => {
        if (!input.trim()) return { output: '', error: '' };
        try {
            if (dir === 'qs2json') {
                const obj: Record<string, string> = {};
                new URLSearchParams(input.trim().replace(/^[?]/, '')).forEach((v, k) => (obj[k] = v));
                return { output: JSON.stringify(obj, null, 2), error: '' };
            }
            const obj = JSON.parse(input) as Record<string, string>;
            const p = new URLSearchParams();
            Object.entries(obj).forEach(([k, v]) => p.set(k, String(v)));
            return { output: p.toString(), error: '' };
        } catch (e) {
            return { output: '', error: e instanceof Error ? e.message : 'Conversion failed.' };
        }
    }, [input, dir]);

    return (
        <FieldPair
            controls={<SegmentedControl value={dir} onChange={setDir} options={[{ value: 'qs2json', label: 'Query → JSON' }, { value: 'json2qs', label: 'JSON → Query' }]} />}
            input={input}
            setInput={setInput}
            output={output}
            error={error}
            inLabel={dir === 'qs2json' ? 'Query string' : 'JSON'}
            outLabel={dir === 'qs2json' ? 'JSON' : 'Query string'}
            example={dir === 'qs2json' ? '?q=tools&page=2&sort=new' : '{"q":"tools","page":"2","sort":"new"}'}
        />
    );
}

/* ----------------------------------------------------- shared 2-col layout - */

function FieldPair({
    controls,
    belowInput,
    input,
    setInput,
    output,
    error,
    inLabel,
    outLabel,
    example,
    downloadName,
}: {
    controls?: React.ReactNode;
    belowInput?: React.ReactNode;
    input: string;
    setInput: (v: string) => void;
    output: string;
    error: string;
    inLabel: string;
    outLabel: string;
    example?: string;
    downloadName?: string;
}) {
    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                {controls}
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <label className={labelClass}>{inLabel}</label>
                        <ToolActions onExample={example ? () => setInput(example) : undefined} onClear={input ? () => setInput('') : undefined} />
                    </div>
                    <textarea rows={7} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste here…" className={monoTextareaClass} />
                </div>
                {belowInput}
            </div>

            <ResultCard>
                {output ? (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{outLabel}</span>
                            <div className="flex items-center gap-4">
                                {downloadName && <ToolActions onDownload={() => download(downloadName, output)} />}
                                <CopyButton value={output} label="" />
                            </div>
                        </div>
                        <textarea rows={9} readOnly value={output} className={`${monoTextareaClass} bg-white dark:bg-slate-800`} />
                    </>
                ) : error ? (
                    <ToolError>{error}</ToolError>
                ) : (
                    <EmptyHint text="The result appears here." />
                )}
            </ResultCard>
        </div>
    );
}
