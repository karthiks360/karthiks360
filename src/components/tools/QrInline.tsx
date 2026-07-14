'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';

/** Renders a QR code for the given value with a PNG download link. */
export function QrInline({ value, size = 160 }: { value: string; size?: number }) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (!value) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUrl('');
            return;
        }
        let cancelled = false;
        QRCode.toDataURL(value, { width: 512, margin: 2, errorCorrectionLevel: 'M' })
            .then((u) => !cancelled && setUrl(u))
            .catch(() => !cancelled && setUrl(''));
        return () => {
            cancelled = true;
        };
    }, [value]);

    if (!url) return null;

    return (
        <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="QR code for the link" width={size} height={size} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white" />
            <a
                href={url}
                download="qr.png"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
                <Download className="w-4 h-4" />
                Download QR
            </a>
        </div>
    );
}
