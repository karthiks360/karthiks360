import { describe, expect, it } from 'vitest';
import { csvToJson, formatSql, formatXml, jsonToCsv, jsonToTs, parseCsv } from '../formatters';

describe('parseCsv / csvToJson', () => {
    it('splits plain rows', () => {
        expect(parseCsv('a,b\n1,2\n')).toEqual([['a', 'b'], ['1', '2']]);
    });

    it('keeps commas and doubled quotes inside quoted fields', () => {
        expect(parseCsv('name,quote\n"Doe, Jane","She said ""hi"""')).toEqual([
            ['name', 'quote'],
            ['Doe, Jane', 'She said "hi"'],
        ]);
    });

    it('keeps a line break inside a quoted field as one record', () => {
        const rows = parseCsv('id,address\n1,"12 High St\nBengaluru"\n2,"Elsewhere"');
        expect(rows).toEqual([
            ['id', 'address'],
            ['1', '12 High St\nBengaluru'],
            ['2', 'Elsewhere'],
        ]);
    });

    it('handles CRLF and a BOM', () => {
        expect(parseCsv('﻿a,b\r\n1,2\r\n')).toEqual([['a', 'b'], ['1', '2']]);
    });

    it('builds objects keyed by the header row', () => {
        expect(JSON.parse(csvToJson('name,role\nKarthik,dev\nAsha,admin'))).toEqual([
            { name: 'Karthik', role: 'dev' },
            { name: 'Asha', role: 'admin' },
        ]);
    });

    it('round-trips through jsonToCsv', () => {
        const json = '[{"a":"x, y","b":"line\\nbreak"},{"a":"\\"q\\"","b":""}]';
        expect(JSON.parse(csvToJson(jsonToCsv(json)))).toEqual(JSON.parse(json));
    });
});

describe('formatSql', () => {
    it('breaks keywords onto their own lines and indents AND/OR/ON', () => {
        expect(formatSql('select id, name from users u join orders o on o.user_id = u.id where u.active = 1 and u.age > 18 order by name limit 10')).toBe(
            [
                'SELECT id,',
                '  name',
                'FROM users u',
                'JOIN orders o',
                '  ON o.user_id = u.id',
                'WHERE u.active = 1',
                '  AND u.age > 18',
                'ORDER BY name',
                'LIMIT 10',
            ].join('\n'),
        );
    });

    it('never rewrites text inside string literals', () => {
        const out = formatSql("select * from items where name = 'on sale, from stock' and note = \"select and or\"");
        expect(out).toContain("'on sale, from stock'");
        expect(out).toContain('"select and or"');
        expect(out).toBe(
            ["SELECT *", "FROM items", "WHERE name = 'on sale, from stock'", '  AND note = "select and or"'].join('\n'),
        );
    });

    it('keeps escaped quotes inside a literal together', () => {
        expect(formatSql("select 1 where a = 'it''s on' and b = 'x'")).toBe(
            ["SELECT 1", "WHERE a = 'it''s on'", "  AND b = 'x'"].join('\n'),
        );
    });

    it('does not split multi-word keywords', () => {
        expect(formatSql('delete from t where id = 1')).toBe('DELETE FROM t\nWHERE id = 1');
        expect(formatSql('select * from a inner join b on a.id = b.id')).toBe(
            ['SELECT *', 'FROM a', 'INNER JOIN b', '  ON a.id = b.id'].join('\n'),
        );
    });
});

describe('jsonToTs', () => {
    it('emits the root interface first and nested ones after', () => {
        expect(jsonToTs({ name: 'K', meta: { age: 29 } })).toBe(
            'interface Root {\n  name: string;\n  meta: Meta;\n}\n\ninterface Meta {\n  age: number;\n}',
        );
    });

    it('merges objects in an array and marks missing keys optional', () => {
        expect(jsonToTs({ users: [{ id: 1, name: 'a' }, { id: 2, email: 'b' }] })).toBe(
            'interface Root {\n  users: Users[];\n}\n\ninterface Users {\n  id: number;\n  name?: string;\n  email?: string;\n}',
        );
    });

    it('unions primitive element types', () => {
        expect(jsonToTs({ v: [1, 'x', null] })).toBe('interface Root {\n  v: (number | string | null)[];\n}');
    });

    it('handles a top-level array', () => {
        expect(jsonToTs([{ a: 1 }])).toBe('type Root = RootItem[];\n\ninterface RootItem {\n  a: number;\n}');
    });
});

describe('formatXml', () => {
    it('indents nested elements', () => {
        expect(formatXml('<note><to>Karthik</to><from>Asha</from></note>')).toBe(
            '<note>\n  <to>Karthik</to>\n  <from>Asha</from>\n</note>',
        );
    });

    it('preserves comments, CDATA and attributes', () => {
        expect(formatXml('<?xml version="1.0"?><r a="1"><!-- hi --><c><![CDATA[<b>]]></c><e/></r>')).toBe(
            ['<?xml version="1.0"?>', '<r a="1">', '  <!-- hi -->', '  <c>', '    <![CDATA[<b>]]>', '  </c>', '  <e/>', '</r>'].join('\n'),
        );
    });

    it('rejects malformed XML', () => {
        expect(() => formatXml('<a><b></a>')).toThrow('Invalid XML.');
    });
});
