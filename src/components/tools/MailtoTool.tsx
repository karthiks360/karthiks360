'use client';

import { useMemo, useState } from 'react';
import { LinkResultPanel } from './LinkResultPanel';
import { useLinkHistory } from './useLinkHistory';
import { ToolActions, ToolError, inputClass, labelClass, textareaClass } from './shared';

export function MailtoTool() {
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const { items, add, clear } = useLinkHistory('mailto');

    const link = useMemo(() => {
        if (!to.trim()) return '';
        const params = new URLSearchParams();
        if (cc.trim()) params.set('cc', cc.trim());
        if (bcc.trim()) params.set('bcc', bcc.trim());
        if (subject.trim()) params.set('subject', subject.trim());
        if (body.trim()) params.set('body', body.trim());
        const qs = params.toString().replace(/\+/g, '%20');
        return `mailto:${to.trim()}${qs ? `?${qs}` : ''}`;
    }, [to, cc, bcc, subject, body]);

    const openMail = () => {
        if (!link) return;
        add(link);
        window.location.href = link;
    };

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <div className="flex justify-end">
                    <ToolActions
                        onExample={() => { setTo('hi@karthiks360.com'); setSubject('Hello from your portfolio'); setBody('Hi Karthik,\n\nI saw your work and…'); }}
                        onClear={to || subject || body ? () => { setTo(''); setCc(''); setBcc(''); setSubject(''); setBody(''); } : undefined}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="mt-to" className={labelClass}>To</label>
                    <input id="mt-to" type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="hi@example.com" className={inputClass} />
                    {!to.trim() && <ToolError>Enter at least a recipient address.</ToolError>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label htmlFor="mt-cc" className={labelClass}>Cc <span className="text-slate-400 font-normal">(opt.)</span></label>
                        <input id="mt-cc" type="email" value={cc} onChange={(e) => setCc(e.target.value)} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="mt-bcc" className={labelClass}>Bcc <span className="text-slate-400 font-normal">(opt.)</span></label>
                        <input id="mt-bcc" type="email" value={bcc} onChange={(e) => setBcc(e.target.value)} className={inputClass} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="mt-subject" className={labelClass}>Subject</label>
                    <input id="mt-subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="mt-body" className={labelClass}>Body</label>
                    <textarea id="mt-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} className={textareaClass} />
                </div>
            </div>

            <LinkResultPanel
                link={link}
                emptyHint="Add a recipient to generate a mailto link and QR code."
                openLabel="Open in email app"
                onOpen={openMail}
                items={items}
                onClear={clear}
                onPick={(v) => (window.location.href = v)}
            />
        </div>
    );
}
