import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/schemaValidator.js',
    output: [{
        file: 'dist/index-cjs.js',
        format: 'cjs'
    },
    {
        file: 'dist/index-esm.js',
        format: 'esm'
    }],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        })
    ]
};
