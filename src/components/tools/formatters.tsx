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

function csvToJson(csv: string): string {
    const rows = csv.trim().split(/\r?\n/).map((line) => {
        const out: string[] = [];
        let cur = '';
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (inQ) {
                if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
                else if (c === '"') inQ = false;
                else cur += c;
            } else if (c === '"') inQ = true;
            else if (c === ',') { out.push(cur); cur = ''; }
            else cur += c;
        }
        out.push(cur);
        return out;
    });
    const [head, ...body] = rows;
    return JSON.stringify(body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? '']))), null, 2);
}

function jsonToCsv(json: string): string {
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

function jsonToTs(value: unknown, name = 'Root'): string {
    const interfaces: string[] = [];
    const pascal = (s: string) => s.replace(/(^|_|-|\s)(\w)/g, (_, __, c) => c.toUpperCase());

    function typeOf(v: unknown, key: string): string {
        if (v === null) return 'null';
        if (Array.isArray(v)) return v.length === 0 ? 'unknown[]' : `${typeOf(v[0], key)}[]`;
        if (typeof v === 'object') {
            const iName = pascal(key);
            build(v as Record<string, unknown>, iName);
            return iName;
        }
        return typeof v as string;
    }
    function build(obj: Record<string, unknown>, iName: string) {
        const lines = Object.entries(obj).map(([k, v]) => {
            const safeKey = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
            return `  ${safeKey}: ${typeOf(v, k)};`;
        });
        interfaces.push(`interface ${iName} {\n${lines.join('\n')}\n}`);
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) build(value as Record<string, unknown>, pascal(name));
    else return `type ${pascal(name)} = ${typeOf(value, name)};`;
    return interfaces.reverse().join('\n\n');
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

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'VALUES', 'INSERT INTO', 'UPDATE', 'SET', 'DELETE FROM', 'AND', 'OR', 'ON'];

function formatSql(sql: string): string {
    let s = sql.replace(/\s+/g, ' ').trim();
    for (const kw of SQL_KEYWORDS) {
        const re = new RegExp(`\\s*\\b${kw}\\b`, 'gi');
        s = s.replace(re, (kw === 'AND' || kw === 'OR' || kw === 'ON' ? '\n  ' : '\n') + kw.toUpperCase());
    }
    return s.replace(/,\s*/g, ',\n  ').replace(/^\n/, '').trim();
}

export function SqlFormatter() {
    const [input, setInput] = useState('');
    const output = useMemo(() => (input.trim() ? formatSql(input) : ''), [input]);
    return <FieldPair input={input} setInput={setInput} output={output} error="" inLabel="SQL" outLabel="Formatted" example="select id, name, email from users u join orders o on o.user_id = u.id where u.active = 1 order by name limit 10" downloadName="query.sql" />;
}

/* --------------------------------------------------------------- XML fmt --- */

function formatXml(xml: string): string {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid XML.');
    const PADDING = '  ';
    let formatted = '';
    let pad = 0;
    xml.replace(/>\s*</g, '><').replace(/</g, '\n<').split('\n').filter(Boolean).forEach((node) => {
        if (/^<\/\w/.test(node)) pad -= 1;
        formatted += PADDING.repeat(Math.max(pad, 0)) + node + '\n';
        if (/^<\w[^>]*[^/]>$/.test(node) && !/^<.*<\/.*>$/.test(node)) pad += 1;
    });
    return formatted.trim();
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
