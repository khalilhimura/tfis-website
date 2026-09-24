import { register } from 'node:module';
// Match Pages/esbuild's JSON imports while exercising the actual route in Node.
register('./json-loader.mjs', import.meta.url);
