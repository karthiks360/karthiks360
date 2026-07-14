'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { CopyButton, EmptyHint, ResultCard, ToolError, inputClass, labelClass, readOnlyClass } from './shared';

/* --------------------------------------------------------------- Color ----- */

function hexToRgb(hex: string): [number, number, number] | null {
    let h = hex.replace('#', '').trim();
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')).join('');

function luminance([r, g, b]: [number, number, number]): number {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
    const l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function ColorConverter() {
    const [hex, setHex] = useState('#2563eb');
    const rgb = hexToRgb(hex);
    const hsl = rgb ? rgbToHsl(...rgb) : null;
    const valid = !!rgb;

    const palette = hsl ? [90, 75, 60, hsl[2], 40, 25, 15].map((l) => rgbToHex(...hslToRgb(hsl[0], hsl[1], l))) : [];
    const onWhite = rgb ? contrastRatio(rgb, [255, 255, 255]) : 0;
    const onBlack = rgb ? contrastRatio(rgb, [0, 0, 0]) : 0;

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <input type="color" value={valid ? rgbToHex(...rgb!) : '#000000'} onChange={(e) => setHex(e.target.value)} aria-label="Pick color" className="w-16 h-16 rounded-xl border-2 border-slate-300 dark:border-slate-600 cursor-pointer bg-transparent" />
                    <div className="flex-1 space-y-2">
                        <label htmlFor="color-hex" className={labelClass}>HEX</label>
                        <input id="color-hex" type="text" value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#2563eb" className={`${inputClass} font-mono`} />
                    </div>
                </div>
                {valid && (
                    <div className="space-y-2">
                        <ColorRow label="RGB" value={`rgb(${rgb!.join(', ')})`} />
                        <ColorRow label="HSL" value={`hsl(${hsl![0]}, ${hsl![1]}%, ${hsl![2]}%)`} />
                    </div>
                )}
            </div>

            <ResultCard>
                {!valid ? (
                    <ToolError>Enter a valid 3- or 6-digit hex color.</ToolError>
                ) : (
                    <>
                        <div className="space-y-2">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Tints &amp; shades</span>
                            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                {palette.map((c, i) => (
                                    <button key={i} type="button" onClick={() => setHex(c)} title={c} className="flex-1 h-12 transition-transform hover:scale-105" style={{ backgroundColor: c }} aria-label={`Use ${c}`} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Contrast (WCAG)</span>
                            <div className="grid grid-cols-2 gap-3">
                                <ContrastCard bg={rgbToHex(...rgb!)} fg="#ffffff" label="on white" ratio={onWhite} />
                                <ContrastCard bg={rgbToHex(...rgb!)} fg="#000000" label="on black" ratio={onBlack} />
                            </div>
                        </div>
                    </>
                )}
            </ResultCard>
        </div>
    );
}

function ColorRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-10">{label}</span>
            <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-100">{value}</code>
            <CopyButton value={value} label="" />
        </div>
    );
}

function ContrastCard({ bg, fg, label, ratio }: { bg: string; fg: string; label: string; ratio: number }) {
    const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail';
    const pass = ratio >= 4.5;
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-center h-14 text-sm font-semibold" style={{ backgroundColor: fg === '#ffffff' ? '#fff' : '#000', color: bg }}>{label}</div>
            <div className="px-3 py-2 flex items-center justify-between bg-white dark:bg-slate-800">
                <span className="font-mono text-sm text-slate-800 dark:text-slate-100">{ratio.toFixed(2)}:1</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pass ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'}`}>{grade}</span>
            </div>
        </div>
    );
}

/* ----------------------------------------------------------- Box shadow ---- */

export function BoxShadowGenerator() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(10);
    const [blur, setBlur] = useState(20);
    const [spread, setSpread] = useState(-5);
    const [color, setColor] = useState('#1e293b');
    const [opacity, setOpacity] = useState(25);

    const rgb = hexToRgb(color) ?? [0, 0, 0];
    const shadow = `${x}px ${y}px ${blur}px ${spread}px rgba(${rgb.join(', ')}, ${(opacity / 100).toFixed(2)})`;
    const css = `box-shadow: ${shadow};`;

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Slider label="X" value={x} min={-50} max={50} onChange={setX} />
                <Slider label="Y" value={y} min={-50} max={50} onChange={setY} />
                <Slider label="Blur" value={blur} min={0} max={100} onChange={setBlur} />
                <Slider label="Spread" value={spread} min={-50} max={50} onChange={setSpread} />
                <Slider label="Opacity" value={opacity} min={0} max={100} onChange={setOpacity} />
                <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Color</span>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent cursor-pointer" />
                </div>
            </div>

            <ResultCard>
                <div className="flex items-center justify-center py-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="w-28 h-28 rounded-2xl bg-slate-100 dark:bg-slate-700" style={{ boxShadow: shadow }} />
                </div>
                <CssOutput css={css} />
            </ResultCard>
        </div>
    );
}

/* ------------------------------------------------------------- Gradient ---- */

export function GradientGenerator() {
    const [from, setFrom] = useState('#2563eb');
    const [to, setTo] = useState('#9333ea');
    const [angle, setAngle] = useState(135);

    const gradient = `linear-gradient(${angle}deg, ${from}, ${to})`;
    const css = `background: ${gradient};`;

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">From</span>
                        <input type="color" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent cursor-pointer" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">To</span>
                        <input type="color" value={to} onChange={(e) => setTo(e.target.value)} className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent cursor-pointer" />
                    </div>
                </div>
                <Slider label="Angle" value={angle} min={0} max={360} onChange={setAngle} />
            </div>

            <ResultCard>
                <div className="h-36 rounded-xl border border-slate-200 dark:border-slate-700" style={{ background: gradient }} />
                <CssOutput css={css} />
            </ResultCard>
        </div>
    );
}

/* --------------------------------------------------------- Cubic bezier ---- */

export function CubicBezier() {
    const [p, setP] = useState([0.25, 0.1, 0.25, 1]);
    const set = (i: number, v: number) => setP((prev) => prev.map((x, idx) => (idx === i ? v : x)));
    const css = `cubic-bezier(${p.map((n) => n.toFixed(2)).join(', ')})`;
    const path = `M 0 100 C ${p[0] * 100} ${100 - p[1] * 100}, ${p[2] * 100} ${100 - p[3] * 100}, 100 0`;

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {['X1', 'Y1', 'X2', 'Y2'].map((lbl, i) => (
                    <Slider key={lbl} label={lbl} value={p[i]} min={i % 2 === 0 ? 0 : -0.5} max={i % 2 === 0 ? 1 : 1.5} step={0.01} onChange={(v) => set(i, v)} />
                ))}
            </div>

            <ResultCard>
                <div className="flex justify-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 py-4">
                    <svg viewBox="-10 -10 120 120" className="w-40 h-40">
                        <line x1="0" y1="100" x2="100" y2="0" className="stroke-slate-200 dark:stroke-slate-600" strokeWidth="1" />
                        <path d={path} className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2.5" fill="none" />
                        <circle cx={p[0] * 100} cy={100 - p[1] * 100} r="4" className="fill-purple-500" />
                        <circle cx={p[2] * 100} cy={100 - p[3] * 100} r="4" className="fill-purple-500" />
                    </svg>
                </div>
                <CssOutput css={`transition-timing-function: ${css};`} />
            </ResultCard>
        </div>
    );
}

/* -------------------------------------------------------- Viewport tester -- */

const BREAKPOINTS = [
    { name: '2xl', min: 1536 },
    { name: 'xl', min: 1280 },
    { name: 'lg', min: 1024 },
    { name: 'md', min: 768 },
    { name: 'sm', min: 640 },
    { name: 'base', min: 0 },
];

export function ViewportTester() {
    const [size, setSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const active = BREAKPOINTS.find((b) => size.w >= b.min)?.name ?? 'base';

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-300 text-sm">Resize the browser window to watch the current viewport size and the matching Tailwind breakpoint update live.</p>
            </div>

            <ResultCard>
                <div className="grid grid-cols-2 gap-4">
                    <Stat label="Width" value={`${size.w}px`} />
                    <Stat label="Height" value={`${size.h}px`} />
                </div>
                <div className="space-y-2">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Active breakpoint</span>
                    <div className="flex flex-wrap gap-2">
                        {[...BREAKPOINTS].reverse().map((b) => (
                            <span key={b.name} className={`px-3 py-1.5 rounded-lg text-sm font-mono border-2 ${b.name === active ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}>{b.name}</span>
                        ))}
                    </div>
                </div>
            </ResultCard>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</div>
            <div className="font-mono text-xl text-slate-900 dark:text-white tabular-nums">{value}</div>
        </div>
    );
}

/* ----------------------------------------------------- Image → data URI ---- */

export function ImageToDataUri() {
    const [dataUri, setDataUri] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Please choose an image file.');
            return;
        }
        setError('');
        setName(file.name);
        const reader = new FileReader();
        reader.onload = () => setDataUri(typeof reader.result === 'string' ? reader.result : '');
        reader.readAsDataURL(file);
    };

    return (
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            <div className="space-y-3">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                    onDragOver={(e) => e.preventDefault()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">{name || 'Click or drop an image'}</span>
                </button>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                {error && <ToolError>{error}</ToolError>}
            </div>

            <ResultCard>
                {dataUri ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={dataUri} alt="Preview" className="max-h-40 mx-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Data URI</span>
                            <CopyButton value={dataUri} label="" />
                        </div>
                        <textarea rows={5} readOnly value={dataUri} className={`${readOnlyClass} bg-white dark:bg-slate-800`} />
                    </>
                ) : (
                    <EmptyHint text="Choose an image to get its Base64 data URI." />
                )}
            </ResultCard>
        </div>
    );
}

/* ------------------------------------------------------------- shared UI --- */

function Slider({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400 dark:text-slate-500">{label}</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">{value}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>
    );
}

function CssOutput({ css }: { css: string }) {
    return (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <code className="flex-1 font-mono text-sm break-all text-slate-800 dark:text-slate-100">{css}</code>
            <CopyButton value={css} label="" />
        </div>
    );
}
