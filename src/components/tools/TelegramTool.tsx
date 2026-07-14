'use client';

import { useMemo, useState } from 'react';
import { LinkResultPanel } from './LinkResultPanel';
import { useLinkHistory } from './useLinkHistory';
import { SegmentedControl, ToolActions, ToolError, inputClass, labelClass, textareaClass } from './shared';

export function TelegramTool() {
    const [mode, setMode] = useState<'username' | 'phone'>('username');
    const [handle, setHandle] = useState('');
    const [message, setMessage] = useState('');
    const { items, add, clear } = useLinkHistory('telegram');

    const link = useMemo(() => {
        const v = handle.trim();
        if (!v) return '';
        const text = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : '';
        if (mode === 'username') {
            const user = v.replace(/^@/, '');
            if (!/^[a-zA-Z0-9_]{5,}$/.test(user)) return '';
            return `https://t.me/${user}${text}`;
        }
        const digits = v.replace(/\D/g, '');
        if (digits.length < 8) return '';
        return `https://t.me/+${digits}${text}`;
    }, [mode, handle, message]);

    const invalid = handle.trim().length > 0 && !link;

    const openTg = () => {
        if (!link) return;
        add(link);
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <SegmentedControl
                        value={mode}
                        onChange={(m) => { setMode(m); setHandle(''); }}
                        options={[
                            { value: 'username', label: 'Username' },
                            { value: 'phone', label: 'Phone' },
                        ]}
                    />
                    <ToolActions
                        onExample={() => { setMode('username'); setHandle('durov'); setMessage('Hello!'); }}
                        onClear={handle || message ? () => { setHandle(''); setMessage(''); } : undefined}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="tg-handle" className={labelClass}>{mode === 'username' ? 'Username' : 'Phone number'}</label>
                    <input id="tg-handle" type="text" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder={mode === 'username' ? '@username' : '+91 98765 43210'} className={`${inputClass} focus:ring-sky-500`} />
                    {invalid && <ToolError>{mode === 'username' ? 'Usernames are 5+ characters (letters, numbers, underscore).' : 'Enter a valid phone number with country code.'}</ToolError>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="tg-message" className={labelClass}>Message <span className="text-slate-400 font-normal">(optional)</span></label>
                    <textarea id="tg-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Pre-fill a message…" className={`${textareaClass} focus:ring-sky-500`} />
                </div>
            </div>

            <LinkResultPanel
                link={link}
                emptyHint="Enter a username or phone number to generate a link and QR code."
                openLabel="Open Telegram"
                openClass="from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                onOpen={openTg}
                items={items}
                onClear={clear}
                onPick={(v) => window.open(v, '_blank', 'noopener,noreferrer')}
            />
        </div>
    );
}
