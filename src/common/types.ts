export interface Credentials {
	'token': string;
	'expires': number;
	'refresh': string;
}

export const HTTP_METHOD = {
	GET: 'GET',
	POST: 'POST',
} as const;

export interface JSON {
	[key: string]: string | number | boolean | null | JSON | JSON[];
}

export interface PKCE {
	'state': string;
	'verifier': string;
}

export interface TokenResponse {
	'access_token': string;
	'token_type': 'Bearer';
	'scope': string;
	'expires_in': number;
	'refresh_token'?: string;
}
