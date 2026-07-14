'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    MessageCircle, Link2, QrCode,
    Type, Link, AlignLeft, FileText,
    Binary, FileKey2, Percent, Hash, Code, Hexagon, Slash,
    Braces, FileJson, Table, FileType, Database, CodeXml, Ampersand,
    KeyRound, Fingerprint, Pilcrow, Clock, FileCog, Dices,
    Palette, BoxSelect, Blend, Spline, MonitorSmartphone, Image as ImageIcon,
    Regex, Network, Globe, Server, CalendarClock, GitCompare,
    Mail, MessageSquare, Send,
    Search, SearchX, ChevronRight, ArrowLeft, BookOpen, type LucideIcon,
} from 'lucide-react';
import NextLink from 'next/link';
import { Avatar } from './Avatar';
import { ThemeToggle } from './ThemeToggle';
import { USAGE } from './tools/usage';

import { WhatsAppTool } from './tools/WhatsAppTool';
import { MailtoTool } from './tools/MailtoTool';
import { SmsTool } from './tools/SmsTool';
import { TelegramTool } from './tools/TelegramTool';
import { CaseConverter } from './tools/CaseConverter';
import { Base64Tool } from './tools/Base64Tool';
import { PasswordGenerator } from './tools/PasswordGenerator';
import { QrGenerator } from './tools/QrGenerator';
import { UtmBuilder } from './tools/UtmBuilder';
import { JwtDecoder, UrlEncoder, HashGenerator, HtmlEntities, HexBinary, EscapeTool } from './tools/encoders';
import {
    JsonFormatter, YamlConverter, CsvJsonConverter, JsonToTs, SqlFormatter, XmlFormatter, QueryStringTool,
} from './tools/formatters';
import { UuidGenerator, LoremIpsum, CronHelper, SnippetBuilder, MockData } from './tools/generators';
import {
    ColorConverter, BoxShadowGenerator, GradientGenerator, CubicBezier, ViewportTester, ImageToDataUri,
} from './tools/webcss';
import {
    RegexTester, CidrCalculator, UaParser, HttpStatusLookup, TimestampConverter, DiffViewer,
} from './tools/networking';
import { Slugify, TextCounter, MarkdownPreview } from './tools/text';

/**
 * A searchable collection of small web utilities, grouped by category.
 *
 * To add a tool: build its UI as a component in `./tools/`, then append an entry
 * to the `TOOLS` array below. It automatically shows up in its category and is
 * matched by the search bar (title, description, and keywords).
 */

type Tool = {
    id: string;
    title: string;
    description: string;
    category: string;
    keywords: string[];
    icon: LucideIcon;
    accent: string;
    render: () => React.ReactNode;
};

// Accent palette per category keeps each section visually coherent.
const ACCENTS: Record<string, string> = {
    links: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    text: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    encode: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400',
    format: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
    generate: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
    web: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400',
    net: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
};

const CATEGORIES = [
    'Redirects & Links',
    'Text',
    'Encode & Hash',
    'Format & Convert',
    'Generators',
    'Web & CSS',
    'Networking',
] as const;

const TOOLS: Tool[] = [
    // Redirects & Links
    { id: 'whatsapp-redirect', title: 'WhatsApp Redirect', description: 'Message any number without saving it as a contact.', category: 'Redirects & Links', keywords: ['whatsapp', 'wa', 'chat', 'message', 'phone'], icon: MessageCircle, accent: ACCENTS.links, render: () => <WhatsAppTool /> },
    { id: 'utm-builder', title: 'UTM Link Builder', description: 'Add campaign tracking parameters to any URL.', category: 'Redirects & Links', keywords: ['utm', 'url', 'link', 'campaign', 'tracking', 'analytics', 'marketing'], icon: Link2, accent: ACCENTS.links, render: () => <UtmBuilder /> },
    { id: 'qr-generator', title: 'QR Code Generator', description: 'URL, WiFi, vCard & more — with colors, logo, SVG.', category: 'Redirects & Links', keywords: ['qr', 'qrcode', 'code', 'link', 'url', 'scan', 'wifi', 'vcard', 'svg', 'logo'], icon: QrCode, accent: ACCENTS.links, render: () => <QrGenerator /> },
    { id: 'telegram-redirect', title: 'Telegram Redirect', description: 'Open a Telegram chat by username or phone.', category: 'Redirects & Links', keywords: ['telegram', 'tg', 't.me', 'chat', 'message', 'redirect'], icon: Send, accent: ACCENTS.links, render: () => <TelegramTool /> },
    { id: 'mailto-generator', title: 'Mailto Link Generator', description: 'Build a mailto: link with subject, cc/bcc and body.', category: 'Redirects & Links', keywords: ['mailto', 'email', 'mail', 'link', 'subject', 'cc', 'bcc'], icon: Mail, accent: ACCENTS.links, render: () => <MailtoTool /> },
    { id: 'sms-generator', title: 'SMS Link Generator', description: 'Create an sms: link with a pre-filled message.', category: 'Redirects & Links', keywords: ['sms', 'text', 'message', 'link', 'phone'], icon: MessageSquare, accent: ACCENTS.links, render: () => <SmsTool /> },

    // Text
    { id: 'case-converter', title: 'Case Converter', description: 'UPPER, camelCase, snake_case, kebab and more.', category: 'Text', keywords: ['case', 'text', 'uppercase', 'lowercase', 'camel', 'snake', 'kebab', 'title'], icon: Type, accent: ACCENTS.text, render: () => <CaseConverter /> },
    { id: 'slugify', title: 'Slugify', description: 'Turn a title into a clean URL slug.', category: 'Text', keywords: ['slug', 'slugify', 'url', 'permalink', 'seo'], icon: Link, accent: ACCENTS.text, render: () => <Slugify /> },
    { id: 'text-counter', title: 'Word & Character Counter', description: 'Count words, characters, lines and byte size.', category: 'Text', keywords: ['count', 'word', 'character', 'char', 'line', 'reading', 'bytes'], icon: AlignLeft, accent: ACCENTS.text, render: () => <TextCounter /> },
    { id: 'markdown-preview', title: 'Markdown Previewer', description: 'Live-render Markdown to HTML as you type.', category: 'Text', keywords: ['markdown', 'md', 'preview', 'html', 'render'], icon: FileText, accent: ACCENTS.text, render: () => <MarkdownPreview /> },

    // Encode & Hash
    { id: 'base64', title: 'Base64 Encode / Decode', description: 'Encode text to Base64 or decode it back — Unicode-safe.', category: 'Encode & Hash', keywords: ['base64', 'encode', 'decode', 'b64'], icon: Binary, accent: ACCENTS.encode, render: () => <Base64Tool /> },
    { id: 'jwt-decoder', title: 'JWT Decoder', description: 'Inspect a token’s header and payload (no verify).', category: 'Encode & Hash', keywords: ['jwt', 'token', 'decode', 'auth', 'bearer'], icon: FileKey2, accent: ACCENTS.encode, render: () => <JwtDecoder /> },
    { id: 'url-encode', title: 'URL Encode / Decode', description: 'Percent-encode components or whole URIs.', category: 'Encode & Hash', keywords: ['url', 'uri', 'encode', 'decode', 'percent', 'escape'], icon: Percent, accent: ACCENTS.encode, render: () => <UrlEncoder /> },
    { id: 'hash', title: 'Hash Generator', description: 'SHA-1, SHA-256, SHA-384 and SHA-512 digests.', category: 'Encode & Hash', keywords: ['hash', 'sha', 'sha256', 'sha512', 'digest', 'checksum', 'crypto'], icon: Hash, accent: ACCENTS.encode, render: () => <HashGenerator /> },
    { id: 'html-entities', title: 'HTML Entity Encode / Decode', description: 'Escape and unescape &lt;, &amp;, and friends.', category: 'Encode & Hash', keywords: ['html', 'entity', 'entities', 'escape', 'encode', 'decode'], icon: Code, accent: ACCENTS.encode, render: () => <HtmlEntities /> },
    { id: 'hex-binary', title: 'Hex & Binary Converter', description: 'Convert text to/from hex or binary bytes.', category: 'Encode & Hash', keywords: ['hex', 'hexadecimal', 'binary', 'bytes', 'text', 'convert'], icon: Hexagon, accent: ACCENTS.encode, render: () => <HexBinary /> },
    { id: 'escape', title: 'Escape / Unescape', description: 'JSON-string, backslash, and regex escaping.', category: 'Encode & Hash', keywords: ['escape', 'unescape', 'json', 'backslash', 'regex'], icon: Slash, accent: ACCENTS.encode, render: () => <EscapeTool /> },

    // Format & Convert
    { id: 'json-formatter', title: 'JSON Formatter', description: 'Pretty-print or minify JSON, with error reporting.', category: 'Format & Convert', keywords: ['json', 'format', 'pretty', 'minify', 'validate', 'beautify'], icon: Braces, accent: ACCENTS.format, render: () => <JsonFormatter /> },
    { id: 'json-yaml', title: 'JSON ↔ YAML', description: 'Convert between JSON and YAML in either direction.', category: 'Format & Convert', keywords: ['json', 'yaml', 'yml', 'convert'], icon: FileJson, accent: ACCENTS.format, render: () => <YamlConverter /> },
    { id: 'csv-json', title: 'CSV ↔ JSON', description: 'Convert tabular CSV to JSON and back.', category: 'Format & Convert', keywords: ['csv', 'json', 'convert', 'table', 'spreadsheet'], icon: Table, accent: ACCENTS.format, render: () => <CsvJsonConverter /> },
    { id: 'json-ts', title: 'JSON → TypeScript', description: 'Generate TypeScript interfaces from a JSON sample.', category: 'Format & Convert', keywords: ['json', 'typescript', 'ts', 'interface', 'types'], icon: FileType, accent: ACCENTS.format, render: () => <JsonToTs /> },
    { id: 'sql-formatter', title: 'SQL Formatter', description: 'Break a query onto readable, keyword-aligned lines.', category: 'Format & Convert', keywords: ['sql', 'format', 'query', 'beautify', 'database'], icon: Database, accent: ACCENTS.format, render: () => <SqlFormatter /> },
    { id: 'xml-formatter', title: 'XML Formatter', description: 'Indent and validate XML using the browser parser.', category: 'Format & Convert', keywords: ['xml', 'format', 'indent', 'pretty', 'beautify'], icon: CodeXml, accent: ACCENTS.format, render: () => <XmlFormatter /> },
    { id: 'query-string', title: 'Query String ↔ JSON', description: 'Parse a query string to JSON or build one back.', category: 'Format & Convert', keywords: ['query', 'querystring', 'params', 'json', 'url', 'convert'], icon: Ampersand, accent: ACCENTS.format, render: () => <QueryStringTool /> },

    // Generators
    { id: 'password-generator', title: 'Password Generator', description: 'Strong random passwords, generated in-browser.', category: 'Generators', keywords: ['password', 'random', 'secure', 'passphrase', 'crypto'], icon: KeyRound, accent: ACCENTS.generate, render: () => <PasswordGenerator /> },
    { id: 'uuid', title: 'UUID Generator', description: 'Generate v4 UUIDs, one or many at a time.', category: 'Generators', keywords: ['uuid', 'guid', 'id', 'random', 'v4'], icon: Fingerprint, accent: ACCENTS.generate, render: () => <UuidGenerator /> },
    { id: 'lorem', title: 'Lorem Ipsum', description: 'Placeholder paragraphs for mockups and layouts.', category: 'Generators', keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'text', 'filler'], icon: Pilcrow, accent: ACCENTS.generate, render: () => <LoremIpsum /> },
    { id: 'cron', title: 'Cron Expression Helper', description: 'Explain a cron expression and show its next runs.', category: 'Generators', keywords: ['cron', 'crontab', 'schedule', 'expression', 'job'], icon: Clock, accent: ACCENTS.generate, render: () => <CronHelper /> },
    { id: 'snippets', title: 'Config Snippet Builder', description: '.gitignore, robots.txt and .editorconfig starters.', category: 'Generators', keywords: ['gitignore', 'robots', 'editorconfig', 'snippet', 'config', 'template'], icon: FileCog, accent: ACCENTS.generate, render: () => <SnippetBuilder /> },
    { id: 'mock-data', title: 'Mock JSON Data', description: 'Generate fake records — names, emails, IDs.', category: 'Generators', keywords: ['mock', 'fake', 'data', 'json', 'seed', 'random', 'faker'], icon: Dices, accent: ACCENTS.generate, render: () => <MockData /> },

    // Web & CSS
    { id: 'color-converter', title: 'Color Converter', description: 'HEX ↔ RGB ↔ HSL with a live swatch.', category: 'Web & CSS', keywords: ['color', 'colour', 'hex', 'rgb', 'hsl', 'convert', 'picker'], icon: Palette, accent: ACCENTS.web, render: () => <ColorConverter /> },
    { id: 'box-shadow', title: 'Box-Shadow Generator', description: 'Dial in a CSS box-shadow with a live preview.', category: 'Web & CSS', keywords: ['box-shadow', 'shadow', 'css', 'generator'], icon: BoxSelect, accent: ACCENTS.web, render: () => <BoxShadowGenerator /> },
    { id: 'gradient', title: 'Gradient Generator', description: 'Build a linear-gradient and copy the CSS.', category: 'Web & CSS', keywords: ['gradient', 'linear-gradient', 'css', 'background', 'color'], icon: Blend, accent: ACCENTS.web, render: () => <GradientGenerator /> },
    { id: 'cubic-bezier', title: 'Cubic-Bezier Easing', description: 'Preview an easing curve and copy the timing function.', category: 'Web & CSS', keywords: ['cubic-bezier', 'easing', 'animation', 'transition', 'curve', 'css'], icon: Spline, accent: ACCENTS.web, render: () => <CubicBezier /> },
    { id: 'viewport', title: 'Viewport & Breakpoint Tester', description: 'See your current size and Tailwind breakpoint.', category: 'Web & CSS', keywords: ['viewport', 'breakpoint', 'responsive', 'tailwind', 'width', 'screen'], icon: MonitorSmartphone, accent: ACCENTS.web, render: () => <ViewportTester /> },
    { id: 'image-datauri', title: 'Image → Data URI', description: 'Embed an image as a Base64 data URI, all in-browser.', category: 'Web & CSS', keywords: ['image', 'data', 'uri', 'base64', 'embed', 'inline'], icon: ImageIcon, accent: ACCENTS.web, render: () => <ImageToDataUri /> },

    // Networking
    { id: 'regex', title: 'Regex Tester', description: 'Live match highlighting and capture groups.', category: 'Networking', keywords: ['regex', 'regexp', 'pattern', 'match', 'test', 'expression'], icon: Regex, accent: ACCENTS.net, render: () => <RegexTester /> },
    { id: 'cidr', title: 'CIDR / Subnet Calculator', description: 'Network range, mask, and host counts.', category: 'Networking', keywords: ['cidr', 'subnet', 'ip', 'network', 'mask', 'calculator'], icon: Network, accent: ACCENTS.net, render: () => <CidrCalculator /> },
    { id: 'ua-parser', title: 'User-Agent Parser', description: 'Break down your current browser, OS and engine.', category: 'Networking', keywords: ['user-agent', 'ua', 'browser', 'os', 'parse'], icon: Globe, accent: ACCENTS.net, render: () => <UaParser /> },
    { id: 'http-status', title: 'HTTP Status Codes', description: 'Searchable reference for status codes.', category: 'Networking', keywords: ['http', 'status', 'code', '404', '500', 'reference'], icon: Server, accent: ACCENTS.net, render: () => <HttpStatusLookup /> },
    { id: 'timestamp', title: 'Unix Timestamp Converter', description: 'Convert between epoch and human dates.', category: 'Networking', keywords: ['timestamp', 'unix', 'epoch', 'date', 'time', 'convert'], icon: CalendarClock, accent: ACCENTS.net, render: () => <TimestampConverter /> },
    { id: 'diff', title: 'Text Diff', description: 'Line-by-line diff of two blocks of text.', category: 'Networking', keywords: ['diff', 'compare', 'text', 'difference', 'changes'], icon: GitCompare, accent: ACCENTS.net, render: () => <DiffViewer /> },
];

const TOOLS_BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

export function Tools() {
    const [query, setQuery] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);

    // Sync the open tool with the URL hash so the browser back button, refresh,
    // and shareable links all work (e.g. /tools#regex).
    useEffect(() => {
        const readHash = () => {
            const id = window.location.hash.replace(/^#/, '');
            setActiveId(id && TOOLS_BY_ID[id] ? id : null);
        };
        readHash();
        window.addEventListener('hashchange', readHash);
        return () => window.removeEventListener('hashchange', readHash);
    }, []);

    const openTool = (id: string) => {
        window.location.hash = id;
        setActiveId(id);
        window.scrollTo({ top: 0 });
    };

    const closeTool = () => {
        // Prefer history.back so the launcher scroll position is restored; fall
        // back to clearing the hash if there's nowhere to go back to.
        if (window.location.hash) {
            history.back();
        }
        window.setTimeout(() => {
            if (window.location.hash) window.location.hash = '';
            setActiveId(null);
        }, 0);
    };

    const activeTool = activeId ? TOOLS_BY_ID[activeId] : null;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return TOOLS;
        return TOOLS.filter((tool) =>
            [tool.title, tool.description, tool.category, ...tool.keywords].join(' ').toLowerCase().includes(q),
        );
    }, [query]);

    const searching = query.trim().length > 0;

    // The Tools page hides the site nav, so it carries its own top bar with a
    // Home link and the theme toggle.
    const topBar = (
        <div className="flex items-center justify-between">
            <NextLink href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full overflow-hidden shadow ring-1 ring-white/20">
                    <Avatar className="w-full h-full" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    ← Home
                </span>
            </NextLink>
            <ThemeToggle />
        </div>
    );

    /* -------------------------------------------------- Open tool (detail) - */
    if (activeTool) {
        const Icon = activeTool.icon;
        return (
            <section className="min-h-screen flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                {topBar}
                <div className="flex-1 flex flex-col justify-center py-6">
                <button
                    type="button"
                    onClick={closeTool}
                    className="inline-flex items-center gap-2 mb-5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    All tools
                </button>
                <div className="grid gap-6 lg:grid-cols-3 items-start">
                    <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${activeTool.accent}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-slate-900 dark:text-white text-2xl font-bold">{activeTool.title}</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{activeTool.description}</p>
                            </div>
                        </div>
                        {activeTool.render()}
                    </div>
                    <UsagePanel id={activeTool.id} />
                </div>
                </div>
            </section>
        );
    }

    /* --------------------------------------------------- Launcher (grid) --- */
    return (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {topBar}
            <div className="space-y-10 mt-10">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl font-bold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Tools</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                        {TOOLS.length} small, no-fuss utilities — pick one to get started. Everything runs right in your browser.
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-xl mx-auto">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search tools…"
                            aria-label="Search tools"
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Results */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                        <SearchX className="w-10 h-10 mx-auto text-slate-400" />
                        <p className="text-slate-600 dark:text-slate-400">
                            No tools match{' '}
                            <span className="font-medium text-slate-900 dark:text-white">&ldquo;{query}&rdquo;</span>.
                        </p>
                    </div>
                ) : searching ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((tool) => (
                            <ToolTile key={tool.id} tool={tool} onOpen={openTool} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-10">
                        {CATEGORIES.map((cat) => {
                            const items = filtered.filter((t) => t.category === cat);
                            if (items.length === 0) return null;
                            return (
                                <div key={cat} className="space-y-4">
                                    <h2 className="text-slate-400 dark:text-slate-500 text-sm font-semibold uppercase tracking-wider">
                                        {cat}
                                    </h2>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {items.map((tool) => (
                                            <ToolTile key={tool.id} tool={tool} onOpen={openTool} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

function ToolTile({ tool, onOpen }: { tool: Tool; onOpen: (id: string) => void }) {
    const Icon = tool.icon;
    return (
        <button
            type="button"
            onClick={() => onOpen(tool.id)}
            className="group flex items-center gap-4 text-left p-4 rounded-2xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${tool.accent}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="text-slate-900 dark:text-white font-semibold truncate">{tool.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{tool.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
    );
}

function UsagePanel({ id }: { id: string }) {
    const usage = USAGE[id];
    if (!usage) return null;
    return (
        <aside className="lg:sticky lg:top-24 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm p-6 space-y-4 text-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                How to use
            </div>
            <p className="text-slate-600 dark:text-slate-300">{usage.summary}</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 marker:text-slate-400">
                {usage.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                ))}
            </ol>
            {usage.tips && usage.tips.length > 0 && (
                <ul className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {usage.tips.map((t, i) => (
                        <li key={i} className="flex gap-2 text-slate-500 dark:text-slate-400">
                            <span className="text-blue-500 shrink-0">💡</span>
                            {t}
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}
