'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Upload, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { ToolActions, inputClass, labelClass, selectClass } from './shared';

type QrType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'geo';

const escapeWifi = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');

// Build the encoded string for the chosen content type.
function buildContent(type: QrType, f: Record<string, string>): string {
    switch (type) {
        case 'url':
        case 'text':
            return f.value ?? '';
        case 'phone':
            return f.phone ? `tel:${f.phone.trim()}` : '';
        case 'sms':
            return f.phone ? `SMSTO:${f.phone.trim()}:${f.body ?? ''}` : '';
        case 'email':
            return f.to ? `mailto:${f.to.trim()}?subject=${encodeURIComponent(f.subject ?? '')}&body=${encodeURIComponent(f.body ?? '')}` : '';
        case 'geo':
            return f.lat && f.lng ? `geo:${f.lat.trim()},${f.lng.trim()}` : '';
        case 'wifi':
            return f.ssid ? `WIFI:T:${f.enc || 'WPA'};S:${escapeWifi(f.ssid)};P:${escapeWifi(f.pass ?? '')};${f.hidden === 'true' ? 'H:true;' : ''};` : '';
        case 'vcard':
            return f.name
                ? `BEGIN:VCARD\nVERSION:3.0\nN:${f.name}\nFN:${f.name}${f.org ? `\nORG:${f.org}` : ''}${f.phone ? `\nTEL:${f.phone}` : ''}${f.email ? `\nEMAIL:${f.email}` : ''}${f.url ? `\nURL:${f.url}` : ''}\nEND:VCARD`
                : '';
        default:
            return '';
    }
}

const TYPES: { value: QrType; label: string }[] = [
    { value: 'url', label: 'URL' },
    { value: 'text', label: 'Text' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'vcard', label: 'vCard' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'phone', label: 'Phone' },
    { value: 'geo', label: 'Geo' },
];

export function QrGenerator() {
    const [type, setType] = useState<QrType>('url');
    const [fields, setFields] = useState<Record<string, string>>({});
    const [fg, setFg] = useState('#000000');
    const [bg, setBg] = useState('#ffffff');
    const [ec, setEc] = useState<'L' | 'M' | 'Q' | 'H'>('M');
    const [size, setSize] = useState(320);
    const [logo, setLogo] = useState('');
    const [pngUrl, setPngUrl] = useState('');
    const [svg, setSvg] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoRef = useRef<HTMLInputElement>(null);

    const content = buildContent(type, fields);
    const f = (k: string) => fields[k] ?? '';
    const set = (k: string, v: string) => setFields((p) => ({ ...p, [k]: v }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!content || !canvas) {
            setPngUrl('');
            setSvg('');
            return;
        }
        let cancelled = false;
        const opts = { width: 512, margin: 2, errorCorrectionLevel: ec, color: { dark: fg, light: bg } } as const;

        QRCode.toCanvas(canvas, content, opts)
            .then(() => {
                if (cancelled) return;
                const ctx = canvas.getContext('2d');
                const finish = () => !cancelled && setPngUrl(canvas.toDataURL('image/png'));
                if (logo && ctx) {
                    const img = new Image();
                    img.onload = () => {
                        const s = canvas.width * 0.22;
                        const pos = (canvas.width - s) / 2;
                        ctx.fillStyle = bg;
                        ctx.fillRect(pos - 6, pos - 6, s + 12, s + 12);
                        ctx.drawImage(img, pos, pos, s, s);
                        finish();
                    };
                    img.onerror = finish;
                    img.src = logo;
                } else {
                    finish();
                }
            })
            .catch(() => !cancelled && setPngUrl(''));

        QRCode.toString(content, { type: 'svg', margin: 2, errorCorrectionLevel: ec, color: { dark: fg, light: bg } })
            .then((s) => !cancelled && setSvg(s))
            .catch(() => !cancelled && setSvg(''));

        return () => {
            cancelled = true;
        };
    }, [content, fg, bg, ec, logo]);

    const downloadSvg = () => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.svg';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
            <div className="space-y-2">
                <label htmlFor="qr-type" className={labelClass}>Content type</label>
                <select id="qr-type" value={type} onChange={(e) => { setType(e.target.value as QrType); setFields({}); }} className={selectClass}>
                    {TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            {/* Per-type fields */}
            <div className="space-y-3">
                {(type === 'url' || type === 'text') && (
                    <Field label={type === 'url' ? 'URL' : 'Text'}>
                        <input type="text" value={f('value')} onChange={(e) => set('value', e.target.value)} placeholder={type === 'url' ? 'https://karthiks360.com' : 'Any text…'} className={inputClass} />
                    </Field>
                )}
                {type === 'phone' && (
                    <Field label="Phone number"><input type="tel" value={f('phone')} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" className={inputClass} /></Field>
                )}
                {type === 'sms' && (
                    <>
                        <Field label="Phone number"><input type="tel" value={f('phone')} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" className={inputClass} /></Field>
                        <Field label="Message"><input type="text" value={f('body')} onChange={(e) => set('body', e.target.value)} placeholder="Pre-filled text…" className={inputClass} /></Field>
                    </>
                )}
                {type === 'email' && (
                    <>
                        <Field label="To"><input type="email" value={f('to')} onChange={(e) => set('to', e.target.value)} placeholder="hi@example.com" className={inputClass} /></Field>
                        <Field label="Subject"><input type="text" value={f('subject')} onChange={(e) => set('subject', e.target.value)} className={inputClass} /></Field>
                        <Field label="Body"><input type="text" value={f('body')} onChange={(e) => set('body', e.target.value)} className={inputClass} /></Field>
                    </>
                )}
                {type === 'geo' && (
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Latitude"><input type="text" value={f('lat')} onChange={(e) => set('lat', e.target.value)} placeholder="12.9716" className={inputClass} /></Field>
                        <Field label="Longitude"><input type="text" value={f('lng')} onChange={(e) => set('lng', e.target.value)} placeholder="77.5946" className={inputClass} /></Field>
                    </div>
                )}
                {type === 'wifi' && (
                    <>
                        <Field label="Network name (SSID)"><input type="text" value={f('ssid')} onChange={(e) => set('ssid', e.target.value)} className={inputClass} /></Field>
                        <Field label="Password"><input type="text" value={f('pass')} onChange={(e) => set('pass', e.target.value)} className={inputClass} /></Field>
                        <Field label="Encryption">
                            <select value={f('enc') || 'WPA'} onChange={(e) => set('enc', e.target.value)} className={selectClass}>
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">None</option>
                            </select>
                        </Field>
                    </>
                )}
                {type === 'vcard' && (
                    <>
                        <Field label="Full name"><input type="text" value={f('name')} onChange={(e) => set('name', e.target.value)} className={inputClass} /></Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Organisation"><input type="text" value={f('org')} onChange={(e) => set('org', e.target.value)} className={inputClass} /></Field>
                            <Field label="Phone"><input type="tel" value={f('phone')} onChange={(e) => set('phone', e.target.value)} className={inputClass} /></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Email"><input type="email" value={f('email')} onChange={(e) => set('email', e.target.value)} className={inputClass} /></Field>
                            <Field label="Website"><input type="url" value={f('url')} onChange={(e) => set('url', e.target.value)} className={inputClass} /></Field>
                        </div>
                    </>
                )}
            </div>

            {/* Styling options */}
            <div className="grid grid-cols-2 gap-3">
                <Field label="Foreground"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent cursor-pointer" /></Field>
                <Field label="Background"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent cursor-pointer" /></Field>
                <Field label="Correction">
                    <select value={ec} onChange={(e) => setEc(e.target.value as typeof ec)} className={selectClass}>
                        <option value="L">L · 7%</option>
                        <option value="M">M · 15%</option>
                        <option value="Q">Q · 25%</option>
                        <option value="H">H · 30%</option>
                    </select>
                </Field>
                <Field label={`Size ${size}px`}>
                    <input type="range" min={160} max={512} step={16} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-blue-600 mt-2.5" />
                </Field>
            </div>

            <div className="flex items-center gap-3">
                <button type="button" onClick={() => logoRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    {logo ? 'Change logo' : 'Add logo'}
                </button>
                {logo && <ToolActions onClear={() => setLogo('')} />}
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const r = new FileReader();
                    r.onload = () => setLogo(typeof r.result === 'string' ? r.result : '');
                    r.readAsDataURL(file);
                }} />
            </div>
            </div>

            {/* Right: result */}
            <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-5 space-y-4 flex flex-col items-center">
                    <span className="block w-full text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Result</span>
                    <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white overflow-hidden" style={{ width: size, height: size, maxWidth: '100%' }}>
                        <canvas ref={canvasRef} className={pngUrl ? 'w-full h-full' : 'hidden'} />
                        {!pngUrl && (
                            <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 px-6 text-center">
                                <QrCode className="w-8 h-8" />
                                <span className="text-sm">Fill in the fields to generate a QR code.</span>
                            </div>
                        )}
                    </div>
                    {pngUrl && (
                        <div className="flex flex-wrap justify-center gap-3">
                            <a href={pngUrl} download="qrcode.png" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                                <Download className="w-4 h-4" /> PNG
                            </a>
                            <button type="button" onClick={downloadSvg} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-500 font-semibold transition-all">
                                <Download className="w-4 h-4" /> SVG
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
            {children}
        </div>
    );
}
