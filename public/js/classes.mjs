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
