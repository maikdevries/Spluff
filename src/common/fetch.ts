import type { HTTP_METHOD, JSON } from './types.ts';

class FetchError extends Error {
	constructor(status: number, method: keyof typeof HTTP_METHOD, url: string) {
		super(`Fetch request failed with status ${status}. URL: ${method} ${url}`);
		this.name = this.constructor.name;
	}
}

async function json(method: keyof typeof HTTP_METHOD, url: URL, headers: HeadersInit, body: BodyInit): Promise<JSON> | never {
	let response: Response;

	try {
		response = await fetch(url, {
			'method': method,
			'headers': {
				'Accept': 'application/json',
				...headers,
			},
			'body': body,
		});
	} catch {
		throw new FetchError(503, method, url.toString());
	}

	if (response.ok) return await response.json() as JSON;
	else throw new FetchError(response.status, method, response.url);
}
