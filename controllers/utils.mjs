import { setTimeout } from 'node:timers/promises';
import { FetchError } from '../public/js/classes.mjs';

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
		headers: headers,
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
