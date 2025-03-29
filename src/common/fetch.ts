import type { HTTP_METHOD, JSON, TokenResponse } from './types.ts';

class FetchError extends Error {
	constructor(status: number, method: keyof typeof HTTP_METHOD, url: string) {
		super(`Fetch request failed with status ${status}. URL: ${method} ${url}`);
		this.name = this.constructor.name;
	}
}

export async function auth(params: URLSearchParams): Promise<TokenResponse> | never {
	return await json(
		'POST',
		new URL('https://accounts.spotify.com/api/token'),
		{
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		params,
	) as unknown as TokenResponse;
}

export async function api<T>(token: string, method: keyof typeof HTTP_METHOD, endpoint: string): Promise<T> | never {
	return await json(
		method,
		new URL(endpoint, 'https://api.spotify.com/v1/'),
		{
			'Authorization': `Bearer ${token}`,
		},
	) as unknown as T;
}

async function json(method: keyof typeof HTTP_METHOD, url: URL, headers: HeadersInit, body: BodyInit = ''): Promise<JSON> | never {
	let response: Response;

	try {
		response = await fetch(url, {
			'method': method,
			'headers': {
				'Accept': 'application/json',
				...headers,
			},
			...(body && { 'body': body }),
		});
	} catch {
		throw new FetchError(503, method, url.toString());
	}

	if (response.ok) return await response.json() as JSON;
	else throw new FetchError(response.status, method, response.url);
}
