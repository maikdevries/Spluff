import type { Credentials } from '../common/types.ts';

import * as fetch from '../common/fetch.ts';

export async function retrieve(code: string, verifier: string): Promise<Credentials> {
	const params = new URLSearchParams({
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': `${Deno.env.get('DENO_ORIGIN') ?? ''}/auth/process`,
		'client_id': Deno.env.get('SPOTIFY_CLIENT_ID') ?? '',
		'code_verifier': verifier,
	});

	const data = await fetch.auth(params);

	return {
		'token': data.access_token,
		'expires': Date.now() + data.expires_in * 1000,
		'refresh': data.refresh_token ?? '',
	};
}

export async function refresh(token: string): Promise<Credentials> {
	const params = new URLSearchParams({
		'grant_type': 'refresh_token',
		'refresh_token': token,
		'client_id': Deno.env.get('SPOTIFY_CLIENT_ID') ?? '',
	});

	const data = await fetch.auth(params);

	return {
		'token': data.access_token,
		'expires': Date.now() + data.expires_in * 1000,
		'refresh': data.refresh_token ?? token,
	};
}
