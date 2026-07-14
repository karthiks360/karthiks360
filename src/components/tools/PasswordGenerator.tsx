'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { CopyButton, labelClass } from './shared';

const SETS = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: '!@#$%^&*()-_=+[]{};:,.<>?',
};

type SetKey = keyof typeof SETS;

/** Cryptographically-random index in [0, max) with rejection sampling (unbiased). */
function randomIndex(max: number): number {
    const limit = Math.floor(0xffffffff / max) * max;
    const buf = new Uint32Array(1);
    let n: number;
    do {
        crypto.getRandomValues(buf);
        n = buf[0];
    } while (n >= limit);
    return n % max;
}

function generate(length: number, enabled: Record<SetKey, boolean>): string {
    const pool = (Object.keys(SETS) as SetKey[])
        .filter((k) => enabled[k])
        .map((k) => SETS[k])
        .join('');
    if (!pool) return '';
    let out = '';
    for (let i = 0; i < length; i++) out += pool[randomIndex(pool.length)];
    return out;
}

export function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [enabled, setEnabled] = useState<Record<SetKey, boolean>>({
        lower: true,
        upper: true,
        number: true,
        symbol: true,
    });
    const [password, setPassword] = useState('');

    const anyEnabled = Object.values(enabled).some(Boolean);

    const regenerate = useCallback(() => {
        setPassword(generate(length, enabled));
    }, [length, enabled]);

    // Generate on mount and whenever the options change. Generating here (rather
    // than in initial state) keeps the server-rendered markup deterministic and
    // avoids a hydration mismatch from crypto randomness.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        regenerate();
    }, [regenerate]);

    const options: { key: SetKey; label: string }[] = [
        { key: 'lower', label: 'a-z' },
        { key: 'upper', label: 'A-Z' },
        { key: 'number', label: '0-9' },
        { key: 'symbol', label: '!@#' },
    ];

    return (
        <div className="space-y-5">
            {/* Output */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className={labelClass}>Password</label>
                    <CopyButton value={password} />
                </div>
                <div className="flex items-center gap-2 px-5 py-3 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 rounded-xl">
                    <code className="flex-1 min-w-0 truncate font-mono text-slate-900 dark:text-white">
                        {password || <span className="text-slate-400">Select at least one character set</span>}
                    </code>
                    <button
                        type="button"
                        onClick={regenerate}
                        disabled={!anyEnabled}
                        aria-label="Regenerate password"
                        className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 disabled:opacity-40 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Length */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="pw-length" className={labelClass}>
                        Length
                    </label>
                    <span className="font-mono text-slate-900 dark:text-white tabular-nums">{length}</span>
                </div>
                <input
                    id="pw-length"
                    type="range"
                    min={6}
                    max={64}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-blue-600"
                />
            </div>

            {/* Character sets */}
            <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                    <label
                        key={o.key}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-all text-sm font-mono ${
                            enabled[o.key]
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                                : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        <input
                            type="checkbox"
                            checked={enabled[o.key]}
                            onChange={(e) => setEnabled((prev) => ({ ...prev, [o.key]: e.target.checked }))}
                            className="accent-blue-600"
                        />
                        {o.label}
                    </label>
                ))}
            </div>
        </div>
    );
}
