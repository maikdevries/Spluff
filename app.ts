import router from './src/router.ts';

Deno.serve({
	'hostname': '127.0.0.1',
	'port': Number.parseInt(Deno.env.get('DENO_PORT') ?? ''),
}, async (request: Request) => await router(request));
