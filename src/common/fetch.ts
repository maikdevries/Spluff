import type { HTTP_METHOD } from './types.ts';

class FetchError extends Error {
	constructor(status: number, method: keyof typeof HTTP_METHOD, url: string) {
		super(`Fetch request failed with status ${status}. URL: ${method} ${url}`);
		this.name = this.constructor.name;
	}
}
