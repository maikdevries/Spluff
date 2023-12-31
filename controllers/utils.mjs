import { setTimeout } from 'node:timers/promises';
import { FetchError } from '../public/js/utils.mjs';

// NOTE: Durstenfeld variant of the Fisher-Yates shuffle algorithm
export function shuffle (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));

		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

export async function fetchJSON (method, url, headers, body, retries = 0) {
	const response = await fetch(url, {
		'method': method,
		...(headers && { headers: headers }),
		...(body && { body: body }),
	});

	// NOTE: When exceeding rate limits, retry after specified time in HTTP 'Retry-After' header (seconds)
	if (response.status === 429 && retries < 3) {
		await setTimeout(Number.parseInt(response.headers.get('Retry-After')) * 1000);
		return fetchJSON(method, url, headers, body, retries + 1);
	}

	return response.ok
		? await response.json()
		: (() => { throw new FetchError(response.status, response.url) })();
}

export function handleFetchError (error, req, res, next) {
	// NOTE: If authorisation has been refused for stored credentials, user needs to be re-authenticated
	if (error instanceof FetchError && error.status === 401) return res.redirect('/auth');

	return next(error);
}

export function handleAPIFetchError (error, req, res, next) {
	// NOTE: If session-stored authorisation has been invalidated, return 'UNAUTHORISED' status
	if (error instanceof FetchError && error.status === 401) return res.status(401).json({
		'error': 'This request associated authorisation has been invalidated',
	});

	console.error(error);
	return res.status(500).json({ 'error': 'Something went terribly wrong on our side of the internet' });
}
