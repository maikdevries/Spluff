import type { Route } from '@std/http/unstable-route';

import { session } from '@maikdevries/server-sessions';
import { STATUS_CODE, STATUS_TEXT } from '@std/http';
import { route } from '@std/http/unstable-route';

import * as auth from './controllers/auth.controllers.ts';
import * as spotify from './controllers/spotify.controllers.ts';

const routes: Route[] = [
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/' }),
		'handler': (request: Request) => new Response(`Welcome to ${URL.parse(request.url)?.hostname}`),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/auth/login' }),
		'handler': (request: Request) => session.handle(request, auth.login),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/auth/process' }),
		'handler': (request: Request) => session.handle(request, auth.process),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/auth/refresh' }),
		'handler': (request: Request) => session.handle(request, auth.refresh),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/auth/logout' }),
		'handler': (request: Request) => session.handle(request, auth.logout),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/playlists' }),
		'handler': (request: Request) => session.handle(request, spotify.playlists),
	},
];

function defaultHandler(_: Request): Response {
	return new Response(STATUS_TEXT[STATUS_CODE.NotFound], { 'status': STATUS_CODE.NotFound });
}

export default route(routes, defaultHandler);
