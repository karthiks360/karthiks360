'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * A tiny recent-items history persisted to localStorage, keyed per tool.
 * Deduplicates, caps length, and degrades gracefully when storage is blocked.
 */
export function useLinkHistory(key: string, max = 8) {
    const storageKey = `tools:history:${key}`;
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (raw) setItems(JSON.parse(raw));
        } catch {
            // localStorage unavailable (private mode / blocked) — stay empty.
        }
    }, [storageKey]);

    const add = useCallback(
        (value: string) => {
            if (!value) return;
            setItems((prev) => {
                const next = [value, ...prev.filter((v) => v !== value)].slice(0, max);
                try {
                    localStorage.setItem(storageKey, JSON.stringify(next));
                } catch {
                    /* ignore */
                }
                return next;
            });
        },
        [storageKey, max],
    );

    const clear = useCallback(() => {
        setItems([]);
        try {
            localStorage.removeItem(storageKey);
        } catch {
            /* ignore */
        }
    }, [storageKey]);

    return { items, add, clear };
}
