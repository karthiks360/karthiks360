'use client';

import { useMemo, useState } from 'react';
import { COUNTRIES } from './data/countryCodes';
import { LinkResultPanel } from './LinkResultPanel';
import { useLinkHistory } from './useLinkHistory';
import { ToolActions, ToolError, inputClass, labelClass, selectClass, textareaClass } from './shared';

export function SmsTool() {
    const [dial, setDial] = useState('91');
    const [phone, setPhone] = useState('');
    const [body, setBody] = useState('');
    const { items, add, clear } = useLinkHistory('sms');

    const digits = (dial + phone).replace(/\D/g, '');
    const link = useMemo(() => {
        if (digits.length < 8) return '';
        return body.trim() ? `sms:+${digits}?&body=${encodeURIComponent(body.trim())}` : `sms:+${digits}`;
    }, [digits, body]);

    const invalid = phone.trim().length > 0 && !link;

    const openSms = () => {
        if (!link) return;
        add(link);
        window.location.href = link;
    };

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-5">
                <div className="flex justify-end">
                    <ToolActions
                        onExample={() => { setDial('91'); setPhone('98765 43210'); setBody('Hi! Saw your portfolio.'); }}
                        onClear={phone || body ? () => { setPhone(''); setBody(''); } : undefined}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="sms-phone" className={labelClass}>Phone number</label>
                    <div className="flex gap-2">
                        <select aria-label="Country code" value={dial} onChange={(e) => setDial(e.target.value)} className={`${selectClass} !w-auto shrink-0 max-w-[8.5rem]`}>
                            {COUNTRIES.map((c) => (
                                <option key={`${c.name}-${c.dial}`} value={c.dial}>{c.flag} {c.name} +{c.dial}</option>
                            ))}
                        </select>
                        <input id="sms-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" className={inputClass} />
                    </div>
                    {invalid && <ToolError>Enter a valid phone number with country code.</ToolError>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="sms-body" className={labelClass}>Message <span className="text-slate-400 font-normal">(optional)</span></label>
                    <textarea id="sms-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Pre-fill a message…" className={textareaClass} />
                </div>
            </div>

            <LinkResultPanel
                link={link}
                emptyHint="Enter a phone number to generate a shareable link and QR code."
                openLabel="Open Messages"
                onOpen={openSms}
                items={items}
                onClear={clear}
                onPick={(v) => (window.location.href = v)}
            />
        </div>
    );
}
