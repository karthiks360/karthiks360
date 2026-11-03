import { describe, expect, it } from 'vitest';
import { buildUpiLink } from '../PayForm';

describe('buildUpiLink', () => {
    it('emits the minimal person-to-person form with encoded fields', () => {
        const link = buildUpiLink('karthiks360@ybl', 'Paying to Karthik S');
        const url = new URL(link);
        expect(url.protocol).toBe('upi:');
        expect(url.searchParams.get('pa')).toBe('karthiks360@ybl');
        expect(url.searchParams.get('pn')).toBe('Karthik S');
        expect(url.searchParams.get('cu')).toBe('INR');
        expect(url.searchParams.get('tn')).toBe('Paying to Karthik S');
        expect(link).not.toMatch(/[ ]/);
    });

    it('does not send merchant / secure-QR fields or an empty amount', () => {
        const url = new URL(buildUpiLink('karthiks360@sbi', 'x'));
        for (const k of ['mode', 'orgid', 'mc', 'purpose', 'sign', 'am']) {
            expect(url.searchParams.has(k)).toBe(false);
        }
    });
});
