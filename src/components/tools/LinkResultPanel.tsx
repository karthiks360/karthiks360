'use client';

import { QrCode } from 'lucide-react';
import { QrInline } from './QrInline';
import { CopyButton, HistoryList } from './shared';

/**
 * The right-hand "result" column shared by the link-generating tools
 * (WhatsApp / SMS / Telegram / Mailto). Shows a balanced preview card — a
 * dashed QR placeholder until a valid link exists, then the QR, the link, a
 * copy button and the primary open action — followed by recent-links history.
 */
export function LinkResultPanel({
    link,
    emptyHint,
    openLabel,
    onOpen,
    openClass = 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    items,
    onClear,
    onPick,
}: {
    link: string;
    emptyHint: string;
    openLabel: string;
    onOpen: () => void;
    openClass?: string;
    items: string[];
    onClear: () => void;
    onPick?: (value: string) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-4">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Result
                </span>

                {link ? (
                    <QrInline value={link} />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500">
                        <QrCode className="w-8 h-8" />
                        <span className="text-sm text-center px-6">{emptyHint}</span>
                    </div>
                )}

                {link && (
                    <>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <span className="flex-1 min-w-0 truncate font-mono text-xs text-slate-700 dark:text-slate-300" title={link}>
                                {link}
                            </span>
                            <CopyButton value={link} label="" />
                        </div>
                        <button
                            type="button"
                            onClick={onOpen}
                            className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${openClass} text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all`}
                        >
                            {openLabel}
                        </button>
                    </>
                )}
            </div>

            <HistoryList items={items} onClear={onClear} onPick={onPick} />
        </div>
    );
}
