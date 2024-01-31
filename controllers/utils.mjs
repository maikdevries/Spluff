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
	if (error instanceof FetchError) {
		// NOTE: If authorisation has been refused for stored credentials, user needs to be re-authenticated
		if (error.cause.status === 401) return res.redirect('/auth');

		// NOTE: If an upstream server experienced an issue when processing this request, user needs to be informed so
		else if (error.cause.status === 500 || error.cause.status === 502) {
			error.cause.status = 502;
			error.cause.description = 'The server located upstream encountered a problem while handling this request.';
		}

		// NOTE: If an upstream server is unavailable, user needs to be informed so
		else if (error.cause.status === 503) {
			error.cause.description = 'The server located upstream is currently unavailable.';
		}
	}

	return next(error);
}

const statusDescriptions = {
	401: 'The authorisation for this request has expired or is no longer valid.',
	403: 'The authorisation for this request denies access to this resource or action.',
	404: 'The requested resource or action described in this request could not be found.',
	502: 'The server located upstream encountered a problem while handling this request.',
	503: 'The server located upstream is currently unavailable.',
}

export function handleAPIFetchError (error, req, res, next) {
	// NOTE: Rewrite 500 Internal Server Error to 502 Bad Gateway to signal upstream server problem
	const status = error instanceof FetchError ? (error.cause.status === 500 ? 502 : error.cause.status) : 500;
	const description = statusDescriptions[status] ?? 'Something went terribly wrong on our side of the internet';

	console.error(error);
	return res.status(status).json({ description });
}
