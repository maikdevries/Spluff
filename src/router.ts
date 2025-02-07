import type { Route } from '@std/http/unstable-route';

import { session } from '@maikdevries/server-sessions';
import { STATUS_CODE, STATUS_TEXT } from '@std/http';
import { route } from '@std/http/unstable-route';
import * as authController from './controllers/auth.controllers.ts';

const routes: Route[] = [
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/' }),
		'handler': (request: Request) => new Response(`Welcome to ${URL.parse(request.url)?.hostname}`),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/auth/login' }),
		'handler': (request: Request) => session.handle(request, authController.login),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/auth/process' }),
		'handler': (request: Request) => session.handle(request, authController.process),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/auth/refresh' }),
		'handler': (request: Request) => session.handle(request, authController.refresh),
	},
	{
		'method': ['GET'],
		'pattern': new URLPattern({ 'pathname': '/auth/logout' }),
		'handler': (request: Request) => session.handle(request, authController.logout),
	},
];

function defaultHandler(_: Request): Response {
	return new Response(STATUS_TEXT[STATUS_CODE.NotFound], { 'status': STATUS_CODE.NotFound });
}

export default route(routes, defaultHandler);
