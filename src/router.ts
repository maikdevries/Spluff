import type { Route } from '@std/http/unstable-route';

import { STATUS_CODE, STATUS_TEXT } from '@std/http';
import { route } from '@std/http/unstable-route';

const routes: Route[] = [
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/' }),
		'handler': (request: Request) => new Response(`Welcome to ${URL.parse(request.url)?.hostname}`),
	},
];

function defaultHandler(_: Request): Response {
	return new Response(STATUS_TEXT[STATUS_CODE.NotFound], { 'status': STATUS_CODE.NotFound });
}

export default route(routes, defaultHandler);
