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

export async function fetchJSON (method, url, headers = null, body = null, retries = 0) {
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
	if (error instanceof FetchError && error.cause.status === 401) return res.redirect('/auth');

	return next(error);
}

export function handleAPIFetchError (error, req, res, next) {
	// NOTE: If session-stored authorisation has been invalidated, return 'UNAUTHORISED' status
	if (error instanceof FetchError && error.cause.status === 401) return res.status(401).json({
		'description': 'The authorisation for this request has expired or is no longer valid.',
	});

	// NOTE: If session-stored authorisation does not permit access to the requested resource, return 'FORBIDDEN' status
	if (error instanceof FetchError && error.cause.status === 403) return res.status(403).json({
		'description': 'The authorisation for this request denies access to this resource or action.',
	});

	// NOTE: If requested resource or action could not be identified, return 'NOT FOUND' status
	if (error instanceof FetchError && error.cause.status === 404) return res.status(404).json({
		'description': 'The requested resource or action described in this request could not be found.',
	});

	// NOTE: If an upstream server experienced an issue when processing this request, return 'BAD GATEWAY' status
	if (error instanceof FetchError && (error.cause.status === 500 || error.cause.status === 502)) return res.status(502).json({
		'description': 'The server located upstream encountered a problem while handling this request.',
	});

	// NOTE: If an upstream server is unavailable, return 'SERVICE UNAVAILABLE' status
	if (error instanceof FetchError && error.cause.status === 503) return res.status(503).json({
		'description': 'The server located upstream is currently unavailable.',
	});

	console.error(error);
	return res.status(500).json({ 'description': 'Something went terribly wrong on our side of the internet.' });
}
