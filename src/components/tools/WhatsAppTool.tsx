'use client';

import { useMemo, useState } from 'react';
import { COUNTRIES } from './data/countryCodes';
import { LinkResultPanel } from './LinkResultPanel';
import { useLinkHistory } from './useLinkHistory';
import { ToolActions, ToolError, inputClass, labelClass, selectClass, textareaClass } from './shared';

const TEMPLATES = [
    { label: 'Custom', text: '' },
    { label: 'Business inquiry', text: 'Hi! I came across your work and would like to know more.' },
    { label: 'Order status', text: 'Hi, I’d like to check the status of my order.' },
    { label: 'Book appointment', text: 'Hello! I’d like to book an appointment. What slots are available?' },
    { label: 'Support', text: 'Hi, I need some help with a product/service.' },
];

export function WhatsAppTool() {
    const [dial, setDial] = useState('91');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [templateIdx, setTemplateIdx] = useState(0);
    const { items, add, clear } = useLinkHistory('whatsapp');

    const digits = (dial + phone).replace(/\D/g, '');
    const link = useMemo(() => {
        if (digits.length < 8) return '';
        const base = `https://wa.me/${digits}`;
        return message.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base;
    }, [digits, message]);

    const invalid = phone.trim().length > 0 && !link;

    const openChat = () => {
        if (!link) return;
        add(link);
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    const applyTemplate = (idx: number) => {
        setTemplateIdx(idx);
        if (TEMPLATES[idx].text) setMessage(TEMPLATES[idx].text);
    };

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            {/* Left: inputs */}
            <div className="space-y-5">
                <div className="flex justify-end">
                    <ToolActions
                        onExample={() => { setDial('91'); setPhone('98765 43210'); applyTemplate(1); }}
                        onClear={phone || message ? () => { setPhone(''); setMessage(''); setTemplateIdx(0); } : undefined}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="wa-phone" className={labelClass}>Phone number</label>
                    <div className="flex gap-2">
                        <select
                            aria-label="Country code"
                            value={dial}
                            onChange={(e) => setDial(e.target.value)}
                            className={`${selectClass} !w-auto shrink-0 max-w-[8.5rem]`}
                        >
                            {COUNTRIES.map((c) => (
                                <option key={`${c.name}-${c.dial}`} value={c.dial}>{c.flag} {c.name} +{c.dial}</option>
                            ))}
                        </select>
                        <input id="wa-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" className={`${inputClass} focus:ring-green-500`} />
                    </div>
                    {invalid && <ToolError>Enter a valid phone number with country code.</ToolError>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="wa-template" className={labelClass}>Template</label>
                    <select id="wa-template" value={templateIdx} onChange={(e) => applyTemplate(Number(e.target.value))} className={selectClass}>
                        {TEMPLATES.map((t, i) => (<option key={t.label} value={i}>{t.label}</option>))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="wa-message" className={labelClass}>Message <span className="text-slate-400 font-normal">(optional)</span></label>
                    <textarea id="wa-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Pre-fill a message to send…" className={`${textareaClass} focus:ring-green-500`} />
                </div>
            </div>

            {/* Right: result */}
            <LinkResultPanel
                link={link}
                emptyHint="Enter a phone number to generate a shareable link and QR code."
                openLabel="Open Chat"
                openClass="from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onOpen={openChat}
                items={items}
                onClear={clear}
                onPick={(v) => window.open(v, '_blank', 'noopener,noreferrer')}
            />
        </div>
    );
}
