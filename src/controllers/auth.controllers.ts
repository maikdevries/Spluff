import type { Session } from '@maikdevries/server-sessions';
import type { Credentials, PKCE } from '../common/types.ts';

import { encodeBase64Url } from '@std/encoding';
import * as auth from '../services/auth.services.ts';

const DENO_ORIGIN = Deno.env.get('DENO_ORIGIN') ?? '';
const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID') ?? '';

export async function login(_: Request, session: Session): Promise<Response> {
	// [FUTURE] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#browser_compatibility
	const state = encodeBase64Url(crypto.getRandomValues(new Uint8Array(128)));

	// [FUTURE] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#browser_compatibility
	const verifier = encodeBase64Url(crypto.getRandomValues(new Uint8Array(96)));
	const challenge = encodeBase64Url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));

	const params = new URLSearchParams({
		'client_id': SPOTIFY_CLIENT_ID,
		'response_type': 'code',
		'redirect_uri': `${DENO_ORIGIN}/auth/process`,
		'state': state,
		'scope': 'playlist-modify-private playlist-modify-public playlist-read-private',
		'code_challenge_method': 'S256',
		'code_challenge': challenge,
	});

	session.flash('pkce', {
		'state': state,
		'verifier': verifier,
	});

	return Response.redirect(`https://accounts.spotify.com/authorize?${params}`);
}

export async function process(request: Request, session: Session): Promise<Response> {
	const url = URL.parse(request.url) as URL;

	const code = url.searchParams.get('code');
	const pkce = session.get<PKCE>('pkce');

	if (!code || !pkce) return Response.redirect(new URL('/auth/login', DENO_ORIGIN));
	else if (url.searchParams.get('state') !== pkce.state) return Response.redirect(new URL('/auth/csrf', DENO_ORIGIN));

	const credentials = await auth.retrieve(code, pkce.verifier);
	session.regenerate().set('credentials', credentials);

	return Response.redirect(new URL('/playlists', DENO_ORIGIN));
}

export async function refresh(_: Request, session: Session): Promise<Response> {
	const token = session.get<Credentials>('credentials')?.refresh;
	if (!token) return Response.redirect(new URL('/auth/login', DENO_ORIGIN));

	const credentials = await auth.refresh(token);
	session.regenerate().set('credentials', credentials);

	return Response.redirect(new URL('/', DENO_ORIGIN));
}

export function logout(_: Request, session: Session): Response {
	session.terminate();

	return Response.redirect(new URL('/', DENO_ORIGIN));
}
