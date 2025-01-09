class FetchError extends Error {
	constructor(status: number, method: string, url: string) {
		super(`Fetch request failed with status ${status}. URL: ${method} ${url}`);
		this.name = this.constructor.name;
	}
}
