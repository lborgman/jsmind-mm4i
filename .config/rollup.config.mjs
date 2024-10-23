// import cleanup from 'rollup-plugin-cleanup';
// import { terser } from 'rollup-plugin-terser';

const banner = `
/**
* @license BSD-3-Clause
* @copyright 2014-2023 hizzgdev@163.com
*
* Project Home:
*   https://github.com/hizzgdev/jsmind/
*
*
****************
* This is a fork!
* Fork Project Home:
*   https://github.com/lborgman/jsmind-mm4i
*/
`;

export default [
    {
        input: 'src/jsmind.js',
        output: {
            name: 'jsMind',
            file: 'es6/jsmind-mm4i.js',
            // format: 'es', // FIX-ME: does not work???
            format: 'umd',
            banner: banner,
            // sourcemap: true,
        },
        /*
        plugins: [
            cleanup({
                comments: 'none',
            }),
            terser({
                output: {
                    comments: 'all',
                },
            }),
        ],
        */
    },
    {
        input: 'src/plugins/jsmind.draggable-node.js',
        output: {
            file: 'es6/jsmind.draggable-node-TEMP.js',
            format: 'es',
            banner: banner,
            sourcemap: true,
            globals: {
                jsmind: 'jsMind',
            },
        },
        external: ['jsmind'],
        /*
        plugins: [
            cleanup({
                comments: 'none',
            }),
            terser({
                output: {
                    comments: 'all',
                },
            }),
        ],
        */
    },
    {
        input: 'src/plugins/jsmind.screenshot.js',
        output: {
            file: 'es6/jsmind.screenshot.js',
            format: 'umd',
            banner: banner,
            sourcemap: true,
            globals: {
                'jsmind': 'jsMind',
                'dom-to-image': 'domtoimage',
            },
        },
        external: ['jsmind', 'dom-to-image'],
        /*
        plugins: [
            cleanup({
                comments: 'none',
            }),
            terser({
                output: {
                    comments: 'all',
                },
            }),
        ],
        */
    },
];
