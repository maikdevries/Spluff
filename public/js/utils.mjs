export class FetchError extends Error {
	#status;

	constructor (status, url) {
		super(`Fetch request failed with status ${status}. URL: ${url}`);
		this.#status = status;
	}

	get status () {
		return this.#status;
	}
}

export async function fetchAPI (method, url, headers, body) {
	const response = await fetch(url, {
		'method': method,
		...(headers && { headers: headers }),
		...(body && { body: body }),
	});

	return response.ok
		? await response.json()
		: (() => { throw new FetchError(response.status, response.url) })();
}
