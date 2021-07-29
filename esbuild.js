const { build } = require("esbuild");
const { derver } = require("derver");
const sveltePlugin = require("esbuild-svelte");
const sveltePreprocess = require("svelte-preprocess");
const pkg = require('./package.json');

const DEV = process.argv.includes('--dev');

// Development server configuration. To configure production server
// see `start` script in `package.json` file.

const HOST = '0.0.0.0';
const PORT = 5050;

async function build_client() {
    return await build({
        entryPoints: ['www/src/main.js'],
        bundle: true,
        outfile: 'www/public/build/bundle.js',
        mainFields: ['svelte', 'module', 'main'],
        minify: !DEV,
        incremental: DEV,
        // target: 'es5',
        sourcemap: DEV && 'inline',
        plugins: [
            sveltePlugin({
                compileOptions: {
                    // Svelte compile options
                    dev: DEV,
                    css: false  //use `css:true` to inline CSS in `bundle.js`
                },
                preprocess: [
                    sveltePreprocess()
                ]
            })
        ]
    });
}

build_client().then(bundle => {
    DEV && derver({
        dir: 'www/public',
        host: HOST,
        port: PORT,
        watch: ['www/public', 'www/src', 'src'],
        onwatch: async (l, i, file) => {
            console.log(file)
            if (i == 'src' || i == 'www/src') {
                l.prevent();
                bundle.rebuild().catch(err => l.error(err.message, 'Svelte compile error'));
            }
        }
    })
});

!DEV && (async () => {

    await build({
        entryPoints: ['src/index.js'],
        outfile: pkg.main,
        format: 'cjs',
        bundle: true,
        minify: true,
        sourcemap: false,
        external: ['svelte', 'svelte/*'],
        plugins: [sveltePlugin({ compileOptions: { css: true } })]
    });

    await build({
        entryPoints: ['src/index.js'],
        outfile: pkg.module,
        format: "esm",
        bundle: true,
        minify: true,
        sourcemap: false,
        external: ['svelte', 'svelte/*'],
        plugins: [sveltePlugin({ compileOptions: { css: true } })],
    });

    await build({
        entryPoints: ['src/index.js'],
        outfile: pkg.browser,
        platform: 'browser',
        format: "iife",
        bundle: true,
        minify: true,
        sourcemap: false,
        globalName: "Scrolly",
        plugins: [sveltePlugin({ compileOptions: { css: true } })],
    });

})()