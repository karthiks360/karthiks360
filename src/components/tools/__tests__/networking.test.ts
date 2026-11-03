import { describe, expect, it } from 'vitest';
import { diffLines, intToIp, ipToInt, parseUa } from '../networking';

describe('ipToInt / intToIp', () => {
    it('round-trips addresses including the high bit', () => {
        for (const ip of ['0.0.0.0', '10.0.0.1', '192.168.1.0', '255.255.255.255']) {
            expect(intToIp(ipToInt(ip)!)).toBe(ip);
        }
        expect(ipToInt('255.255.255.255')).toBe(0xffffffff);
    });

    it('rejects malformed input', () => {
        expect(ipToInt('1.2.3')).toBeNull();
        expect(ipToInt('1.2.3.256')).toBeNull();
        expect(ipToInt('a.b.c.d')).toBeNull();
    });
});

describe('diffLines', () => {
    it('marks added and removed lines', () => {
        expect(diffLines(['a', 'b', 'c'], ['a', 'x', 'c'])).toEqual([
            { type: 'same', text: 'a' },
            { type: 'remove', text: 'b' },
            { type: 'add', text: 'x' },
            { type: 'same', text: 'c' },
        ]);
    });

    it('handles one side being empty', () => {
        expect(diffLines([], ['a'])).toEqual([{ type: 'add', text: 'a' }]);
        expect(diffLines(['a'], [])).toEqual([{ type: 'remove', text: 'a' }]);
    });
});

describe('parseUa', () => {
    it('identifies common browsers', () => {
        expect(parseUa('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0')).toMatchObject({ browser: 'Edge', os: 'Windows', mobile: 'No' });
        expect(parseUa('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')).toMatchObject({ browser: 'Safari', os: 'iOS', mobile: 'Yes' });
    });
});
