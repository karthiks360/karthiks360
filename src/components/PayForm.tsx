'use client';

import { useState } from 'react';
import { Smartphone } from 'lucide-react';
import { CopyButton } from '@/components/tools/shared';
import { QrInline } from '@/components/tools/QrInline';

const PAYEE_NAME = 'Karthik S';

// Payment codes map to the UPI ID (VPA) the payer should use. VPAs are
// receive-only public identifiers, not secrets — the code only picks a bank.
const VPA_BY_CODE: Record<string, { vpa: string; bank: string }> = {
    PAY: { vpa: 'karthiks360@ybl', bank: 'PhonePe / Yes Bank' },
    SBINKAR: { vpa: 'karthiks360@sbi', bank: 'SBI' },
    SBINSRI: { vpa: 'karthiks360@sbi', bank: 'SBI' },
    HDFCKAR: { vpa: 'karthiks360@hdfcbank', bank: 'HDFC' },
    KKBK: { vpa: 'karthiks360@kotak', bank: 'Kotak' },
};

const UNAVAILABLE_CODES: Record<string, string> = {
    PAYTM: 'Paytm is currently unavailable — under maintenance. Use another code or the UPI ID shown for PAY.',
};

/**
 * Minimal person-to-person UPI intent. Merchant / Secure-QR fields (mode,
 * orgid, mc, sign) are deliberately omitted: unsigned they can make some apps
 * flag the request as unverified. Amount is left out so the payer enters it.
 */
export function buildUpiLink(vpa: string, note: string): string {
    const p = new URLSearchParams({ pa: vpa, pn: PAYEE_NAME, cu: 'INR', tn: note });
    return `upi://pay?${p.toString()}`;
}

type Status = { kind: 'error' | 'info'; text: string } | null;

export function PayForm() {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<Status>(null);
    const [target, setTarget] = useState<{ vpa: string; bank: string; link: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const key = code.trim();
        const entry = VPA_BY_CODE[key];
        if (entry) {
            const link = buildUpiLink(entry.vpa, `Paying to ${PAYEE_NAME}`);
            setTarget({ ...entry, link });
            setStatus({ kind: 'info', text: 'Tap “Open UPI app” on your phone, or scan the QR / copy the UPI ID from any UPI app.' });
            // Fire the deep link too so phones jump straight to the app; on a
            // desktop with no handler nothing happens and the fallback below
            // is what the visitor uses.
            window.location.href = link;
            return;
        }
        setTarget(null);
        if (UNAVAILABLE_CODES[key]) {
            setStatus({ kind: 'error', text: UNAVAILABLE_CODES[key] });
        } else {
            setStatus({ kind: 'error', text: 'Unknown payment code. Codes are case-sensitive — use the one from your invoice, or PAY for a general payment.' });
        }
    };

    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="space-y-12">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl font-bold">
                                PAYING TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">&quot;{PAYEE_NAME.toUpperCase()}&quot;</span>
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                                Personal UPI payment page for people Karthik has invoiced. Enter the payment code from your invoice — or <strong>PAY</strong> for a general payment.
                            </p>
                        </div>

                        {/* Payment Code Form */}
                        <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="paykey" className="block text-slate-700 dark:text-slate-200 text-lg font-medium">
                                        Payment code
                                    </label>
                                    <input
                                        id="paykey"
                                        type="text"
                                        maxLength={10}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="PAY"
                                        autoCapitalize="characters"
                                        autoComplete="off"
                                        required
                                        className="w-full px-6 py-4 text-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                                >
                                    PAY
                                </button>

                                {status && (
                                    <p
                                        role={status.kind === 'error' ? 'alert' : 'status'}
                                        className={`text-sm text-center ${status.kind === 'error' ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}
                                    >
                                        {status.text}
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Payment target: deep link + copyable UPI ID + QR (works on desktop too) */}
                        {target && (
                            <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 space-y-6">
                                <div className="text-center space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{target.bank}</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <code className="font-mono text-lg sm:text-xl text-slate-900 dark:text-white break-all">{target.vpa}</code>
                                        <CopyButton value={target.vpa} label="Copy" />
                                    </div>
                                </div>
                                <a
                                    href={target.link}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Smartphone className="w-5 h-5" />
                                    Open UPI app
                                </a>
                                <QrInline value={target.link} size={192} />
                                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                                    On a computer? Scan the QR with any UPI app, or pay to the UPI ID above and enter the amount yourself.
                                </p>
                            </div>
                        )}

                        {/* Payment Info */}
                        <div className="bg-blue-50/50 dark:bg-blue-950/30 backdrop-blur-sm rounded-xl p-6 border border-blue-100 dark:border-blue-900/40">
                            <p className="text-slate-700 dark:text-slate-200 text-center text-sm leading-relaxed">
                                <strong>UPI Supported</strong> - BHIM/Phonepe/Gpay/Paytm/Amazon pay & Bank UPI apps
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t-2 border-slate-200 dark:border-slate-700"></div>

                        {/* Terms & Conditions */}
                        <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                All payments made will be subjected to verification, T&C Apply
                            </p>
                        </div>
            </div>
        </section>
    );
}
