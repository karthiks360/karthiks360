'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import {
    CopyButton,
    ResultCard,
    SegmentedControl,
    ToolActions,
    ToolError,
    labelClass,
    monoTextareaClass,
    selectClass,
} from './shared';

/* ------------------------------------------------------------------ JWT ---- */

function base64UrlDecode(part: string): string {
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

const JWT_EXAMPLE =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkthcnRoaWsgUyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.signature';

export function JwtDecoder() {
    const [token, setToken] = useState('');
    const [now, setNow] = useState(0);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNow(Math.floor(Date.now() / 1000));
    }, []);

    const { header, payload, claims, error } = useMemo(() => {
        const t = token.trim();
        if (!t) return { header: '', payload: '', claims: [] as [string, string][], error: '' };
        const parts = t.split('.');
        if (parts.length < 2) return { header: '', payload: '', claims: [], error: 'A JWT has three dot-separated parts.' };
        try {
            const headerObj = JSON.parse(base64UrlDecode(parts[0]));
            const payloadObj = JSON.parse(base64UrlDecode(parts[1]));
            const h = JSON.stringify(headerObj, null, 2);
            const p = JSON.stringify(payloadObj, null, 2);
            const claims: [string, string][] = [];
            const timeClaim = (k: string, label: string) => {
                if (typeof payloadObj[k] === 'number') {
                    const when = new Date(payloadObj[k] * 1000).toLocaleString();
                    let note = '';
                    if (k === 'exp') note = payloadObj[k] < now ? ' — EXPIRED' : ' — valid';
                    if (k === 'nbf') note = payloadObj[k] > now ? ' — not yet valid' : '';
                    claims.push([label, when + note]);
                }
            };
            timeClaim('iat', 'Issued at');
            timeClaim('nbf', 'Not before');
            timeClaim('exp', 'Expires');
            return { header: h, payload: p, claims, error: '' };
        } catch {
            return { header: '', payload: '', claims: [], error: 'Could not decode — is this a valid JWT?' };
        }
    }, [token, now]);

    const expired = claims.some(([, v]) => v.includes('EXPIRED'));

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="jwt-input" className={labelClass}>JWT</label>
                    <ToolActions onExample={() => setToken(JWT_EXAMPLE)} onClear={token ? () => setToken('') : undefined} />
                </div>
                <textarea id="jwt-input" rows={8} value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.…" className={monoTextareaClass} />
                <p className="text-xs text-slate-400 dark:text-slate-500">Decode only — the signature is not verified.</p>
            </div>

            <ResultCard>
                {error && <ToolError>{error}</ToolError>}
                {!header && !error && <EmptyHint text="Paste a JWT to decode its header and payload." />}
                {header && (
                    <div className="space-y-4">
                        <ReadOnlyBlock title="Header" value={header} rows={4} />
                        <ReadOnlyBlock title="Payload" value={payload} rows={6} />
                        {claims.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Claims</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${expired ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'}`}>
                                        {expired ? 'Expired' : 'Valid'}
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-200 dark:divide-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                                    {claims.map(([k, v]) => (
                                        <div key={k} className="flex items-center gap-3 px-3 py-2">
                                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-20">{k}</span>
                                            <span className="flex-1 text-xs text-slate-800 dark:text-slate-100">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ResultCard>
        </div>
    );
}

function ReadOnlyBlock({ title, value, rows = 6 }: { title: string; value: string; rows?: number }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{title}</span>
                <CopyButton value={value} label="" />
            </div>
            <textarea rows={rows} readOnly value={value} className={`${monoTextareaClass} bg-white dark:bg-slate-800`} />
        </div>
    );
}

/* --------------------------------------------------------------- URL enc --- */

export function UrlEncoder() {
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [whole, setWhole] = useState(false);
    const [input, setInput] = useState('');

    const { output, error } = useMemo(() => {
        if (!input) return { output: '', error: '' };
        try {
            if (mode === 'encode') return { output: whole ? encodeURI(input) : encodeURIComponent(input), error: '' };
            return { output: whole ? decodeURI(input) : decodeURIComponent(input), error: '' };
        } catch {
            return { output: '', error: 'Malformed input — cannot decode.' };
        }
    }, [input, mode, whole]);

    return (
        <IoPair
            controls={
                <div className="flex flex-wrap items-center gap-4">
                    <SegmentedControl value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Encode' }, { value: 'decode', label: 'Decode' }]} />
                    <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={whole} onChange={(e) => setWhole(e.target.checked)} className="accent-blue-600" />
                        Whole URI
                    </label>
                </div>
            }
            inLabel="Input"
            input={input}
            setInput={setInput}
            output={error ? '' : output}
            error={error}
            example={mode === 'encode' ? 'name=Karthik S&city=Bengaluru' : 'name%3DKarthik%20S%26city%3DBengaluru'}
        />
    );
}

/* ------------------------------------------------------------------ Hash --- */

const HASH_ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

async function digestHex(algo: string, data: ArrayBuffer | Uint8Array): Promise<string> {
    const buf = await crypto.subtle.digest(algo, data as BufferSource);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function HashGenerator() {
    const [mode, setMode] = useState<'text' | 'file'>('text');
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const [hashes, setHashes] = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mode !== 'text' || !text) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (mode === 'text') setHashes({});
            return;
        }
        let cancelled = false;
        const data = new TextEncoder().encode(text);
        Promise.all(HASH_ALGOS.map((a) => digestHex(a, data).then((h) => [a, h] as const))).then((entries) => {
            if (!cancelled) setHashes(Object.fromEntries(entries));
        });
        return () => { cancelled = true; };
    }, [text, mode]);

    const handleFile = async (file: File | undefined) => {
        if (!file) return;
        setFileName(file.name);
        const buf = await file.arrayBuffer();
        const entries = await Promise.all(HASH_ALGOS.map((a) => digestHex(a, buf).then((h) => [a, h] as const)));
        setHashes(Object.fromEntries(entries));
    };

    const hasHashes = Object.keys(hashes).length > 0;

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <SegmentedControl
                    value={mode}
                    onChange={(m) => { setMode(m); setHashes({}); setFileName(''); }}
                    options={[{ value: 'text', label: 'Text' }, { value: 'file', label: 'File' }]}
                />
                {mode === 'text' ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                            <label htmlFor="hash-input" className={labelClass}>Text</label>
                            <ToolActions onExample={() => setText('The quick brown fox jumps over the lazy dog')} onClear={text ? () => setText('') : undefined} />
                        </div>
                        <textarea id="hash-input" rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Text to hash…" className={monoTextareaClass} />
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                        onDragOver={(e) => e.preventDefault()}
                        className="w-full flex flex-col items-center justify-center gap-2 py-12 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">{fileName || 'Click or drop a file to hash'}</span>
                        <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                    </button>
                )}
            </div>

            <ResultCard>
                {!hasHashes && <EmptyHint text="Enter text or choose a file to compute its hashes." />}
                {hasHashes && (
                    <div className="space-y-3">
                        {HASH_ALGOS.map((algo) => (
                            <div key={algo} className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{algo}</span>
                                    <CopyButton value={hashes[algo] ?? ''} label="" />
                                </div>
                                <code className="block w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs break-all text-slate-800 dark:text-slate-100">
                                    {hashes[algo] || '—'}
                                </code>
                            </div>
                        ))}
                    </div>
                )}
            </ResultCard>
        </div>
    );
}

/* ---------------------------------------------------------- HTML entities -- */

export function HtmlEntities() {
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [input, setInput] = useState('');

    const output = useMemo(() => {
        if (!input) return '';
        if (mode === 'encode') {
            return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }
        const el = document.createElement('textarea');
        el.innerHTML = input;
        return el.value;
    }, [input, mode]);

    return (
        <IoPair
            controls={<SegmentedControl value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Encode' }, { value: 'decode', label: 'Decode' }]} />}
            inLabel="Input"
            input={input}
            setInput={setInput}
            output={output}
            example={mode === 'encode' ? '<a href="?x=1&y=2">Tom & Jerry</a>' : '&lt;a href=&quot;?x=1&amp;y=2&quot;&gt;Tom &amp; Jerry&lt;/a&gt;'}
        />
    );
}

/* ----------------------------------------------------------- Hex / binary -- */

export function HexBinary() {
    const [base, setBase] = useState<'hex' | 'binary'>('hex');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [input, setInput] = useState('');

    const { output, error } = useMemo(() => {
        if (!input) return { output: '', error: '' };
        try {
            const bytes = () => new TextEncoder().encode(input);
            if (mode === 'encode') {
                const arr = Array.from(bytes());
                if (base === 'hex') return { output: arr.map((b) => b.toString(16).padStart(2, '0')).join(' '), error: '' };
                return { output: arr.map((b) => b.toString(2).padStart(8, '0')).join(' '), error: '' };
            }
            const tokens = input.trim().split(/\s+/);
            const nums = tokens.map((t) => parseInt(t, base === 'hex' ? 16 : 2));
            if (nums.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return { output: '', error: `Not valid ${base} bytes.` };
            return { output: new TextDecoder().decode(Uint8Array.from(nums)), error: '' };
        } catch {
            return { output: '', error: 'Conversion failed.' };
        }
    }, [input, base, mode]);

    const example = mode === 'encode' ? 'Hi!' : base === 'hex' ? '48 69 21' : '01001000 01101001 00100001';

    return (
        <IoPair
            controls={
                <div className="flex flex-wrap items-center gap-4">
                    <SegmentedControl value={base} onChange={setBase} options={[{ value: 'hex', label: 'Hex' }, { value: 'binary', label: 'Binary' }]} />
                    <SegmentedControl value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Text →' }, { value: 'decode', label: '→ Text' }]} />
                </div>
            }
            inLabel={mode === 'encode' ? 'Text' : base === 'hex' ? 'Hex' : 'Binary'}
            input={input}
            setInput={setInput}
            output={error ? '' : output}
            error={error}
            example={example}
        />
    );
}

/* --------------------------------------------------------------- Escape ---- */

type EscapeKind = 'json' | 'backslash' | 'regex';

export function EscapeTool() {
    const [kind, setKind] = useState<EscapeKind>('json');
    const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
    const [input, setInput] = useState('');

    const { output, error } = useMemo(() => {
        if (!input) return { output: '', error: '' };
        try {
            if (mode === 'escape') {
                if (kind === 'json') return { output: JSON.stringify(input).slice(1, -1), error: '' };
                if (kind === 'regex') return { output: input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), error: '' };
                return { output: input.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r'), error: '' };
            }
            if (kind === 'json') return { output: JSON.parse(`"${input.replace(/"/g, '\\"')}"`), error: '' };
            if (kind === 'regex') return { output: input.replace(/\\([.*+?^${}()|[\]\\])/g, '$1'), error: '' };
            return { output: input.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\\\/g, '\\'), error: '' };
        } catch {
            return { output: '', error: 'Could not process input.' };
        }
    }, [input, kind, mode]);

    return (
        <IoPair
            controls={
                <div className="flex flex-wrap items-center gap-4">
                    <select value={kind} onChange={(e) => setKind(e.target.value as EscapeKind)} className={`${selectClass} !w-auto py-2`}>
                        <option value="json">JSON string</option>
                        <option value="backslash">Backslash</option>
                        <option value="regex">Regex</option>
                    </select>
                    <SegmentedControl value={mode} onChange={setMode} options={[{ value: 'escape', label: 'Escape' }, { value: 'unescape', label: 'Unescape' }]} />
                </div>
            }
            inLabel="Input"
            input={input}
            setInput={setInput}
            output={error ? '' : output}
            error={error}
            example={'Line one\nSaid "hi" to a.b+c'}
        />
    );
}

/* ------------------------------------------------------- shared UI bits ---- */

function EmptyHint({ text }: { text: string }) {
    return <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8 px-4">{text}</p>;
}

/**
 * Two-column input/output layout: controls + input on the left, a RESULT card
 * with the output on the right. Shared by the encode/decode tools.
 */
function IoPair({
    controls,
    inLabel,
    input,
    setInput,
    output,
    error,
    example,
}: {
    controls?: React.ReactNode;
    inLabel: string;
    input: string;
    setInput: (v: string) => void;
    output: string;
    error?: string;
    example?: string;
}) {
    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                {controls}
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <label className={labelClass}>{inLabel}</label>
                        <ToolActions
                            onExample={example ? () => setInput(example) : undefined}
                            onClear={input ? () => setInput('') : undefined}
                        />
                    </div>
                    <textarea rows={6} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Input…" className={monoTextareaClass} />
                </div>
            </div>

            <ResultCard>
                {output ? (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Output</span>
                            <CopyButton value={output} label="" />
                        </div>
                        <textarea rows={6} readOnly value={output} className={`${monoTextareaClass} bg-white dark:bg-slate-800`} />
                    </>
                ) : error ? (
                    <ToolError>{error}</ToolError>
                ) : (
                    <EmptyHint text="The converted output appears here." />
                )}
            </ResultCard>
        </div>
    );
}
