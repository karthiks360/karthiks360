import { describe, expect, it } from 'vitest';
import { renderMarkdown, slugify } from '../text';

describe('slugify', () => {
    it('lowercases, strips symbols and collapses separators', () => {
        expect(slugify('10 Things I Learned Building a Portfolio!')).toBe('10-things-i-learned-building-a-portfolio');
        expect(slugify('  Hello___World -- again  ')).toBe('hello-world-again');
    });

    it('strips Latin accents', () => {
        expect(slugify('Café déjà vu')).toBe('cafe-deja-vu');
    });

    it('keeps non-Latin scripts instead of producing an empty slug', () => {
        expect(slugify('ಕನ್ನಡ ಬ್ಲಾಗ್')).toBe('ಕನ್ನಡ-ಬ್ಲಾಗ್');
        expect(slugify('नमस्ते दुनिया')).toBe('नमस्ते-दुनिया');
        expect(slugify('日本語 タイトル')).toBe('日本語-タイトル');
    });
});

describe('renderMarkdown', () => {
    it('renders Markdown to HTML', () => {
        expect(renderMarkdown('# Hi\n\n**bold**')).toContain('<h1>Hi</h1>');
        expect(renderMarkdown('# Hi\n\n**bold**')).toContain('<strong>bold</strong>');
    });

    it('strips scripts and event handlers from raw HTML', () => {
        const out = renderMarkdown('<img src=x onerror="alert(1)"><script>alert(2)</script>\n\n[x](javascript:alert(3))');
        expect(out).not.toContain('<script');
        expect(out).not.toContain('onerror');
        expect(out).not.toContain('javascript:');
        expect(out).toContain('<img');
    });
});
