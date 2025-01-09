export const HTTP_METHOD = {
	GET: 'GET',
	POST: 'POST',
} as const;

export interface JSON {
	[key: string]: string | number | boolean | null | JSON | JSON[];
}
