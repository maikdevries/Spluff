export interface Authorisation {
	'access_token': string;
	'token_type': string;
	'scope': string;
	'expires_in': number;
	'refresh_token'?: string;
}

export const HTTP_METHOD = {
	GET: 'GET',
	POST: 'POST',
} as const;

export interface JSON {
	[key: string]: string | number | boolean | null | JSON | JSON[];
}
