import * as yaml from 'yaml';
import papa from 'papaparse';
import { createMarkdownArrayTableSync, createMarkdownObjectTableSync } from 'parse-markdown-table';
import { markdownTable } from 'markdown-table';

export const JSTYPES = {
    plain: "string",
    "plain-lines": "string[]",
    json: "any",
    "json-lines": "any[]",
    json5: "any",
    yaml: "any",
    "yaml-docs": "any[]",
    csv: "string[][]",
    "csv-object": "Record<string,string>[]",
    mdt: "string[][]",
    "mdt-object": "Record<string,string>[]",
    sql: "(Date|string|number|boolean|null)[][]",
    "sql-object": "Record<string,Date|string|number|boolean|null>[]",
};

export const LNTYPES = {
    plain: "plaintext",
    "plain-lines": "plaintext",
    json: "json",
    "json-lines": "jsonl",
    yaml: "yaml",
    "yaml-docs": "yaml",
    csv: "csv",
    "csv-object": "csv",
    mdt: "markdown",
    "mdt-object": "markdown",
    sql: "(Date|string|number|boolean|null)[][]",
    "sql-object": "Record<string,Date|string|number|boolean|null>[]",
};


export function parse(data: string, type: string): any {
    switch (type) {
        case 'plain':
            return data;
        case 'plain-lines':
            return data.trimEnd().split('\n');
        case 'json':
            return JSON.parse(data);
        case 'json-lines':
            return data.trimEnd().split('\n').map(x => JSON.parse(x));
        case 'yaml':
            return yaml.parse(data);
        case 'yaml-docs':
            return yaml.parseAllDocuments(data);
        case 'csv':
            return papa.parse(data).data;
        case 'csv-object':
            return papa.parse(data, {
                header: true,
            }).data;
        case 'mdt':
            return createMarkdownArrayTableSync(data);
        case 'mdt-object':
            return createMarkdownObjectTableSync(data);
        default:
            return '';
    }
}

export function stringify(data: any, type: string): string {
    switch (type) {
        case 'plain':
            return data;
        case 'plain-lines':
            if (!Array.isArray(data)) {
                return '';
            }
            return data.join('\n');
        case 'json':
            return JSON.stringify(data);
        case 'json-lines':
            if (!Array.isArray(data)) {
                return '';
            }
            return data.map(x => JSON.stringify(x)).join('\n');
        case 'yaml':
            return yaml.stringify(data);
        case 'yaml-docs':
            return yaml.stringify(data);
        case 'csv':
            return papa.unparse(data);
        case 'csv-object':
            return papa.unparse(data);
        case 'mdt':
            return markdownTable(data);
        case 'mdt-object':
            var csv = papa.parse(papa.unparse(data));
            // @ts-ignore
            return markdownTable(csv.data);
        default:
            return '';
    }
}