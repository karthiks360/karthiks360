'use client';

import { useMemo, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { CopyButton, SegmentedControl, ToolActions, labelClass, monoTextareaClass } from './shared';

// Unicode-safe Base64 via TextEncoder/TextDecoder (btoa/atob are byte-only).
function encode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
}

function decode(b64: string): string {
    const bin = atob(b64.trim());
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

export function Base64Tool() {
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [input, setInput] = useState('');

    const { output, error } = useMemo(() => {
        if (!input) return { output: '', error: '' };
        try {
            return { output: mode === 'encode' ? encode(input) : decode(input), error: '' };
        } catch {
            return { output: '', error: 'That doesn’t look like valid Base64.' };
        }
    }, [input, mode]);

    const example = mode === 'encode' ? 'Hello 👋 Karthik' : 'SGVsbG8g8J+RiyBLYXJ0aGlr';

    return (
        <div className="space-y-5">
            <SegmentedControl
                value={mode}
                onChange={setMode}
                options={[
                    { value: 'encode', label: 'Encode' },
                    { value: 'decode', label: 'Decode' },
                ]}
            />

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <label htmlFor="b64-input" className={labelClass}>
                        {mode === 'encode' ? 'Plain text' : 'Base64'}
                    </label>
                    <ToolActions
                        onExample={() => setInput(example)}
                        onClear={input ? () => setInput('') : undefined}
                    />
                </div>
                <textarea
                    id="b64-input"
                    rows={3}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'encode' ? 'Text to encode…' : 'Base64 to decode…'}
                    className={monoTextareaClass}
                />
            </div>

            <div className="flex justify-center text-slate-400">
                <ArrowLeftRight className="w-5 h-5" />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="b64-output" className={labelClass}>
                        {mode === 'encode' ? 'Base64' : 'Plain text'}
                    </label>
                    <CopyButton value={output} />
                </div>
                <textarea
                    id="b64-output"
                    rows={3}
                    readOnly
                    value={error ? '' : output}
                    placeholder="Result…"
                    className={`${monoTextareaClass} bg-slate-50 dark:bg-slate-900/60`}
                />
                {error && (
                    <p className="text-red-600 dark:text-red-400 text-sm" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
