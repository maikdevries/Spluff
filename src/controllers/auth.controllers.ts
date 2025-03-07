import type { Session } from '@maikdevries/server-sessions';
import type { Credentials, PKCE } from '../common/types.ts';

import { encodeBase64Url } from '@std/encoding';
import * as authService from '../services/auth.services.ts';

export async function login(_: Request, session: Session): Promise<Response> {
	// [FUTURE] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#browser_compatibility
	const state = encodeBase64Url(crypto.getRandomValues(new Uint8Array(128)));

	// [FUTURE] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#browser_compatibility
	const verifier = encodeBase64Url(crypto.getRandomValues(new Uint8Array(96)));
	const challenge = encodeBase64Url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));

	const params = new URLSearchParams({
		'client_id': Deno.env.get('SPOTIFY_CLIENT_ID') ?? '',
		'response_type': 'code',
		'redirect_uri': `${Deno.env.get('DENO_ORIGIN') ?? ''}/auth/process`,
		'state': state,
		'scope': 'playlist-modify-private playlist-modify-public playlist-read-private',
		'code_challenge_method': 'S256',
		'code_challenge': challenge,
	});

	session.flash('pkce', {
		'state': state,
		'verifier': verifier,
	});

	return Response.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

export async function process(request: Request, session: Session): Promise<Response> {
	const url = URL.parse(request.url) as URL;

	const code = url.searchParams.get('code');
	const pkce = session.get<PKCE>('pkce');

	if (!code || !pkce) return Response.redirect(new URL('/auth/login', url.origin));
	else if (url.searchParams.get('state') !== pkce.state) return Response.redirect(new URL('/auth/csrf', url.origin));

	const credentials = await authService.retrieve(code, pkce.verifier);
	session.regenerate().set('credentials', credentials);

	return Response.redirect(new URL('/playlists', url.origin));
}

export async function refresh(request: Request, session: Session): Promise<Response> {
	const url = URL.parse(request.url) as URL;

	const token = session.get<Credentials>('credentials')?.refresh;
	if (!token) return Response.redirect(new URL('/auth/login', url.origin));

	const credentials = await authService.refresh(token);
	session.regenerate().set('credentials', credentials);

	return Response.redirect(new URL('/', url.origin));
}

export function logout(request: Request, session: Session): Response {
	const url = URL.parse(request.url) as URL;

	session.terminate();

	return Response.redirect(new URL('/', url.origin));
}
