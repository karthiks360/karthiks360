'use client';

import { useMemo, useState } from 'react';
import { QrCode } from 'lucide-react';
import { QrInline } from './QrInline';
import { useLinkHistory } from './useLinkHistory';
import { CopyButton, HistoryList, ToolActions, ToolError, download, inputClass, labelClass } from './shared';

const PARAMS = [
    { key: 'utm_source', label: 'Source', placeholder: 'google, newsletter', required: true },
    { key: 'utm_medium', label: 'Medium', placeholder: 'cpc, email, social', required: true },
    { key: 'utm_campaign', label: 'Campaign', placeholder: 'summer_launch', required: true },
    { key: 'utm_term', label: 'Term', placeholder: 'paid keywords', required: false },
    { key: 'utm_content', label: 'Content', placeholder: 'logo_link', required: false },
] as const;

// Channel presets fill source + medium together (the common GA4 pairings).
const PRESETS: { label: string; source: string; medium: string }[] = [
    { label: 'Google Ads', source: 'google', medium: 'cpc' },
    { label: 'Facebook', source: 'facebook', medium: 'social' },
    { label: 'Instagram', source: 'instagram', medium: 'social' },
    { label: 'LinkedIn', source: 'linkedin', medium: 'social' },
    { label: 'Email', source: 'newsletter', medium: 'email' },
    { label: 'TikTok', source: 'tiktok', medium: 'social' },
];

const normalize = (v: string) => v.trim().toLowerCase().replace(/\s+/g, '_');

export function UtmBuilder() {
    const [base, setBase] = useState('');
    const [values, setValues] = useState<Record<string, string>>({});
    const [norm, setNorm] = useState(true);
    const { items, add, clear } = useLinkHistory('utm');

    const { url, error } = useMemo(() => {
        const trimmed = base.trim();
        if (!trimmed) return { url: '', error: '' };
        try {
            const u = new URL(trimmed);
            if (u.protocol !== 'http:' && u.protocol !== 'https:') {
                return { url: '', error: 'Enter an http(s) URL.' };
            }
            for (const p of PARAMS) {
                const raw = values[p.key]?.trim();
                if (raw) u.searchParams.set(p.key, norm ? normalize(raw) : raw);
            }
            return { url: u.toString(), error: '' };
        } catch {
            return { url: '', error: 'That doesn’t look like a valid URL (include https://).' };
        }
    }, [base, values, norm]);

    // Warn about values that GA4 will treat as distinct sources when not normalizing.
    const warnings = useMemo(() => {
        if (norm) return [];
        return PARAMS.filter((p) => {
            const v = values[p.key];
            return v && (/[A-Z]/.test(v) || /\s/.test(v));
        }).map((p) => p.label);
    }, [values, norm]);

    const set = (key: string, v: string) => setValues((prev) => ({ ...prev, [key]: v }));
    const applyPreset = (p: (typeof PRESETS)[number]) => setValues((prev) => ({ ...prev, utm_source: p.source, utm_medium: p.medium }));

    const loadExample = () => {
        setBase('https://karthiks360.com');
        setValues({ utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'summer_launch' });
    };

    const exportCsv = () => {
        const rows = items.length ? items : url ? [url] : [];
        if (!rows.length) return;
        const header = ['url', ...PARAMS.map((p) => p.key)];
        const lines = rows.map((link) => {
            const u = new URL(link);
            const cells = [u.origin + u.pathname, ...PARAMS.map((p) => u.searchParams.get(p.key) ?? '')];
            return cells.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',');
        });
        download('utm-campaigns.csv', [header.join(','), ...lines].join('\n'), 'text/csv');
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <ToolActions
                    onExample={loadExample}
                    onClear={base || Object.keys(values).length ? () => { setBase(''); setValues({}); } : undefined}
                />
            </div>

            <div className="grid gap-5 lg:gap-6 lg:grid-cols-2">
                {/* Left: inputs */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="utm-base" className={labelClass}>Website URL</label>
                        <input id="utm-base" type="url" inputMode="url" value={base} onChange={(e) => setBase(e.target.value)} placeholder="https://example.com/page" className={inputClass} />
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Quick presets</span>
                        <div className="flex flex-wrap gap-2">
                            {PRESETS.map((p) => (
                                <button key={p.label} type="button" onClick={() => applyPreset(p)} className="px-3 py-1.5 rounded-lg text-sm border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {PARAMS.map((p) => (
                            <div key={p.key} className="space-y-1.5">
                                <label htmlFor={p.key} className={labelClass}>
                                    {p.label} {!p.required && <span className="text-slate-400 font-normal">(opt.)</span>}
                                </label>
                                <input id={p.key} type="text" value={values[p.key] ?? ''} onChange={(e) => set(p.key, e.target.value)} placeholder={p.placeholder} className={inputClass} />
                            </div>
                        ))}
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={norm} onChange={(e) => setNorm(e.target.checked)} className="accent-blue-600" />
                        Normalize (lowercase + underscores)
                    </label>

                    {warnings.length > 0 && (
                        <ToolError>Uppercase/spaces in {warnings.join(', ')} — GA4 treats these as separate values. Enable Normalize.</ToolError>
                    )}
                </div>

                {/* Right: result */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-4">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Result</span>

                        {url ? (
                            <>
                                <QrInline value={url} />
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="utm-output" className="text-xs font-medium text-slate-400 dark:text-slate-500">Campaign URL</label>
                                        <CopyButton value={url} label="" />
                                    </div>
                                    <textarea id="utm-output" rows={3} readOnly value={url} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-y font-mono text-xs text-slate-700 dark:text-slate-300" />
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                    <button type="button" onClick={() => add(url)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Save to recent</button>
                                    <ToolActions onDownload={exportCsv} />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500">
                                <QrCode className="w-8 h-8" />
                                <span className="text-sm text-center px-6">Add a URL and campaign details to generate the tagged link and QR code.</span>
                            </div>
                        )}
                        {error && <ToolError>{error}</ToolError>}
                    </div>

                    <HistoryList items={items} onClear={clear} onPick={(v) => setBase(v.split('?')[0])} />
                </div>
            </div>
        </div>
    );
}
