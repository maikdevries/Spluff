export interface Credentials {
	'token': string;
	'expires': number;
	'refresh': string;
}

export const HTTP_METHOD = {
	'GET': 'GET',
	'POST': 'POST',
} as const;

interface Image {
	'height': number | null;
	'url': string;
	'width': number | null;
}

export interface JSON {
	[key: string]: string | number | boolean | null | JSON | JSON[];
}

export interface Page<T> {
	'href': string;
	'items': T[];
	'limit': number;
	'next': string | null;
	'offset': number;
	'previous': string | null;
	'total': number;
}

export interface PKCE {
	'state': string;
	'verifier': string;
}

export interface Playlist {
	'collaborative': boolean;
	'description': string;
	'external_urls': {
		'spotify': string;
	};
	'href': string;
	'id': string;
	'images': Image[];
	'name': string;
	'owner': User;
	'public': boolean;
	'snapshot_id': string;
	'tracks': {
		'href': string;
		'total': number;
	};
	'type': 'playlist';
	'uri': string;
}

export interface TokenResponse {
	'access_token': string;
	'token_type': 'Bearer';
	'scope': string;
	'expires_in': number;
	'refresh_token': string | undefined;
}

interface User {
	'display_name': string | null;
	'external_urls': {
		'spotify': string;
	};
	'href': string;
	'id': string;
	'type': 'user';
	'uri': string;
}
