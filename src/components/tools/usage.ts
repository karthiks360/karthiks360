/**
 * Usage documentation for each tool, keyed by the tool `id` in Tools.tsx.
 * Rendered as a collapsible "How to use" panel in a tool's detail view.
 * Keeping it here (rather than in each component) keeps the docs consistent
 * and easy to edit in one place.
 */

export type Usage = {
    summary: string;
    steps: string[];
    tips?: string[];
};

export const USAGE: Record<string, Usage> = {
    'whatsapp-redirect': {
        summary: 'Open a WhatsApp chat with any number without adding it to your contacts.',
        steps: [
            'Pick the country code and enter the phone number.',
            'Choose a message template or write your own.',
            'Open the chat, copy the link, or share the QR code.',
        ],
        tips: ['Recent links are saved in your browser for quick reuse.'],
    },
    'utm-builder': {
        summary: 'Append UTM campaign-tracking parameters to a URL for analytics.',
        steps: [
            'Paste the destination URL (must start with http:// or https://).',
            'Use a channel preset or fill source, medium and campaign yourself.',
            'Copy the URL, grab its QR, or export your campaigns as CSV.',
        ],
        tips: ['Keep “Normalize” on — GA4 treats “Facebook” and “facebook” as different sources.', 'Existing query parameters on the URL are preserved.'],
    },
    'qr-generator': {
        summary: 'Turn a URL, WiFi network, contact card and more into a scannable QR code.',
        steps: [
            'Pick a content type and fill in the fields.',
            'Optionally set colors, error-correction level, size and a center logo.',
            'Download as PNG or SVG.',
        ],
        tips: ['Add a logo? Bump correction to H so it still scans.', 'WiFi codes let a phone camera join your network instantly.'],
    },
    'telegram-redirect': {
        summary: 'Open a Telegram chat by username or phone without saving the contact.',
        steps: ['Choose Username or Phone.', 'Enter the handle/number and an optional message.', 'Open Telegram, copy the link, or share the QR.'],
        tips: ['Usernames are 5+ characters — the leading @ is optional.'],
    },
    'mailto-generator': {
        summary: 'Build a mailto: link that opens a pre-composed email.',
        steps: ['Enter the recipient (and optional cc/bcc).', 'Add a subject and body.', 'Open it in your mail app, copy the link, or share the QR.'],
        tips: ['Great for “Email me” buttons on a website.'],
    },
    'sms-generator': {
        summary: 'Create an sms: link that opens the messaging app with text pre-filled.',
        steps: ['Pick a country code and enter the number.', 'Add an optional message.', 'Open Messages, copy the link, or share the QR.'],
    },
    'case-converter': {
        summary: 'Convert text between common casing styles.',
        steps: ['Type or paste your text.', 'Every casing variant is shown at once.', 'Copy the one you need with its copy button.'],
    },
    slugify: {
        summary: 'Turn a title into a clean, URL-safe slug.',
        steps: ['Type a title or heading.', 'The slug updates live.', 'Copy it for use in a URL or filename.'],
        tips: ['Accents are stripped and spaces/symbols become single hyphens.'],
    },
    'text-counter': {
        summary: 'Count words, characters, lines and byte size of text.',
        steps: ['Type or paste text.', 'Read the live counts and estimated reading time.'],
        tips: ['“Bytes (UTF-8)” reflects real storage size — emoji and accents count as several bytes.'],
    },
    'markdown-preview': {
        summary: 'Write Markdown and see the rendered HTML side by side.',
        steps: ['Edit Markdown on the left.', 'The preview renders live on the right.', 'Copy the generated HTML if you need it.'],
        tips: ['Supports headings, lists, links, code, blockquotes and tables.'],
    },
    base64: {
        summary: 'Encode text to Base64 or decode Base64 back to text.',
        steps: ['Pick Encode or Decode.', 'Paste your input.', 'Copy the result.'],
        tips: ['Fully Unicode-safe — emoji and non-Latin scripts round-trip correctly.'],
    },
    'jwt-decoder': {
        summary: 'Inspect a JSON Web Token’s header and payload.',
        steps: ['Paste the JWT.', 'The decoded header and payload appear as formatted JSON.'],
        tips: ['This decodes only — the signature is not verified, so never trust an unverified token server-side.'],
    },
    'url-encode': {
        summary: 'Percent-encode or decode URLs and URL components.',
        steps: ['Choose Encode or Decode.', 'Toggle “Whole URI” to preserve URL structure (/, :, ?).', 'Paste input and copy the result.'],
        tips: ['Leave “Whole URI” off to encode a single query-parameter value.'],
    },
    hash: {
        summary: 'Compute cryptographic hashes of text.',
        steps: ['Type or paste text.', 'SHA-1, SHA-256, SHA-384 and SHA-512 digests appear.', 'Copy the digest you need.'],
        tips: ['Uses the browser’s built-in Web Crypto — nothing is sent anywhere.'],
    },
    'html-entities': {
        summary: 'Escape or unescape HTML special characters.',
        steps: ['Pick Encode or Decode.', 'Paste your input.', 'Copy the result.'],
        tips: ['Encoding turns <, >, &, " and \' into safe entities for embedding in HTML.'],
    },
    'hex-binary': {
        summary: 'Convert text to/from hexadecimal or binary bytes.',
        steps: ['Choose Hex or Binary, then a direction.', 'Paste input.', 'Copy the converted output.'],
        tips: ['When decoding, separate each byte with a space.'],
    },
    escape: {
        summary: 'Escape or unescape strings for JSON, backslashes, or regex.',
        steps: ['Pick a mode (JSON string, Backslash, Regex).', 'Choose Escape or Unescape.', 'Paste input and copy the output.'],
    },
    'json-formatter': {
        summary: 'Pretty-print or minify JSON, with validation.',
        steps: ['Choose Pretty or Minify.', 'Paste JSON.', 'Copy the formatted output; errors are reported inline.'],
    },
    'json-yaml': {
        summary: 'Convert between JSON and YAML.',
        steps: ['Pick a direction (JSON → YAML or YAML → JSON).', 'Paste your input.', 'Copy the converted result.'],
    },
    'csv-json': {
        summary: 'Convert tabular CSV to JSON and back.',
        steps: ['Pick a direction.', 'Paste CSV (with a header row) or a JSON array of objects.', 'Copy the result.'],
        tips: ['Quoted fields containing commas are handled correctly.'],
    },
    'json-ts': {
        summary: 'Generate TypeScript interfaces from a JSON sample.',
        steps: ['Paste a representative JSON object.', 'Copy the generated interfaces.'],
        tips: ['Nested objects become their own named interfaces.'],
    },
    'sql-formatter': {
        summary: 'Reformat a SQL query onto readable, keyword-aligned lines.',
        steps: ['Paste a SQL statement.', 'Copy the formatted query.'],
    },
    'xml-formatter': {
        summary: 'Indent and validate XML.',
        steps: ['Paste XML.', 'Copy the indented output; malformed XML is flagged.'],
    },
    'query-string': {
        summary: 'Convert a URL query string to JSON and back.',
        steps: ['Pick a direction.', 'Paste a query string (with or without the leading ?) or a JSON object.', 'Copy the result.'],
    },
    'password-generator': {
        summary: 'Generate strong random passwords in your browser.',
        steps: ['Set the length with the slider.', 'Toggle which character sets to include.', 'Copy the password or regenerate.'],
        tips: ['Randomness comes from the Web Crypto API and never leaves your device.'],
    },
    uuid: {
        summary: 'Generate version-4 UUIDs.',
        steps: ['Choose how many to generate.', 'Regenerate for a fresh batch.', 'Copy one, or copy all.'],
    },
    lorem: {
        summary: 'Generate placeholder paragraphs for mockups.',
        steps: ['Choose how many paragraphs.', 'Copy the text.'],
    },
    cron: {
        summary: 'Understand a cron expression in plain English and preview its schedule.',
        steps: ['Type a 5-field cron expression.', 'Read the human-readable description and the next 5 run times.'],
        tips: ['Format is: minute hour day-of-month month day-of-week.'],
    },
    snippets: {
        summary: 'Grab starter config files.',
        steps: ['Choose a template (.gitignore, robots.txt, .editorconfig).', 'Copy the snippet.'],
    },
    'mock-data': {
        summary: 'Generate fake JSON records for testing and seeding.',
        steps: ['Choose how many records.', 'Regenerate for new data.', 'Copy the JSON.'],
    },
    'color-converter': {
        summary: 'Convert a color between HEX, RGB and HSL.',
        steps: ['Pick a color or type a hex value.', 'Copy the format you need.'],
    },
    'box-shadow': {
        summary: 'Design a CSS box-shadow visually.',
        steps: ['Adjust offset, blur, spread, color and opacity.', 'Watch the live preview.', 'Copy the CSS.'],
    },
    gradient: {
        summary: 'Build a CSS linear-gradient.',
        steps: ['Pick the two colors and the angle.', 'Copy the generated CSS.'],
    },
    'cubic-bezier': {
        summary: 'Craft a CSS easing curve.',
        steps: ['Drag the four control values.', 'Preview the curve shape.', 'Copy the timing-function CSS.'],
    },
    viewport: {
        summary: 'See your current viewport size and active Tailwind breakpoint.',
        steps: ['Resize the browser window.', 'The dimensions and highlighted breakpoint update live.'],
    },
    'image-datauri': {
        summary: 'Convert an image into an inline Base64 data URI.',
        steps: ['Click or drag an image onto the drop zone.', 'Preview it, then copy the data URI.'],
        tips: ['Best for small images (icons, logos) — large files produce very long strings.'],
    },
    regex: {
        summary: 'Test a regular expression against sample text with live highlighting.',
        steps: ['Enter a pattern and flags.', 'Type the test string.', 'Matches are highlighted; capture groups from the first match are listed.'],
        tips: ['The global flag is added automatically so all matches highlight.'],
    },
    cidr: {
        summary: 'Break down a CIDR block into its network details.',
        steps: ['Enter a block like 192.168.1.0/24.', 'Read the network, broadcast, mask, host range and counts.'],
    },
    'ua-parser': {
        summary: 'Break a User-Agent string into browser, OS and engine.',
        steps: ['Your current User-Agent is pre-filled.', 'Paste a different one to inspect it.'],
    },
    'http-status': {
        summary: 'Look up HTTP status codes and their meanings.',
        steps: ['Search by number (e.g. 404) or name (e.g. forbidden).'],
    },
    timestamp: {
        summary: 'Convert between Unix timestamps and human-readable dates.',
        steps: ['Enter a Unix timestamp or a date string.', 'See it in local, UTC and ISO 8601 form.'],
        tips: ['10-digit input is read as seconds, 13-digit as milliseconds.'],
    },
    diff: {
        summary: 'Compare two blocks of text line by line.',
        steps: ['Paste the original on the left and the changed version on the right.', 'Added lines are green, removed lines are red.'],
    },
};
