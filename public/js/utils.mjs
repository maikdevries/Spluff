export class FetchError extends Error {
	constructor (status, url, description = null) {
		super(`Fetch request failed with status ${status}. URL: ${url}`, {
			cause: {
				'status': status,
				'description': description,
			},
		});
	}
}

export async function fetchAPI (method, url, headers = null, body = null) {
	const response = await fetch(url, {
		'method': method,
		'credentials': 'same-origin',
		...(headers && { headers: headers }),
		...(body && { body: body }),
	});

	return response.ok
		? await response.json()
		: (async () => { throw new FetchError(response.status, response.url, (await response.json()).description) })();
}

export function handleFetchError (error, callback = null) {
	// NOTE: If request has been refused due to invalid authorisation, user needs to be re-prompted for authorisation
	if (error instanceof FetchError && error.cause.status === 401) return window.location.assign('/auth');

	// NOTE: If error has not been handled, log to console and call callback (if not null)
	console.error(error);
	return callback?.();
}
