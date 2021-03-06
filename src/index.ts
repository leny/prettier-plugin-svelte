import { SupportLanguage, Parser, Printer, SupportOption } from 'prettier';
import { print } from './print';
import { embed } from './embed';
import { snipTagContent } from './lib/snipTagContent';
import { importSvelte } from './lib/importSvelte';

function locStart(node: any) {
    return node.start;
}

function locEnd(node: any) {
    return node.end;
}

export const languages: Partial<SupportLanguage>[] = [
    {
        name: 'svelte',
        parsers: ['svelte'],
        extensions: ['.svelte', '.html'],
    },
];

export const parsers: Record<string, Parser> = {
    svelte: {
        parse: (text, parsers, options) => {
            const { parse } = importSvelte((options as any).sveltePath);
            return parse(text);
        },
        preprocess(text) {
            text = snipTagContent('style', text);
            text = snipTagContent('script', text, '{}');
            return text;
        },
        locStart,
        locEnd,
        astFormat: 'svelte-ast',
    },
};

export const printers: Record<string, Printer> = {
    'svelte-ast': {
        print,
        embed,
    },
};

export const options: Record<string, SupportOption> = {
    sveltePath: {
        type: 'path',
        description: 'Path to custom Svelte version to use',
        default: 'svelte',
    },
};
