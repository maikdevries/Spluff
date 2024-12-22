import router from './src/router.ts';

Deno.serve({
	'port': Number.parseInt(Deno.env.get('DENO_PORT') ?? ''),
}, async (request: Request) => await router(request));
