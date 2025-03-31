interface BaseAlbum {
	'album_type': 'album' | 'compilation' | 'single';
	'artists': BaseArtist[];
	'available_markets': string[];
	'external_urls': {
		'spotify': string;
	};
	'href': string;
	'id': string;
	'images': Image[];
	'name': string;
	'release_date': string;
	'release_date_precision': 'day' | 'month' | 'year';
	'total_tracks': number;
	'type': 'album';
	'uri': string;
}

interface BaseArtist {
	'external_urls': {
		'spotify': string;
	};
	'href': string;
	'id': string;
	'name': string;
	'type': 'artist';
	'uri': string;
}

interface Copyright {
	'text': string;
	'type': 'C' | 'P';
}

export interface Credentials {
	'token': string;
	'expires': number;
	'refresh': string;
}

interface Episode {
	'description': string;
	'duration_ms': number;
	'explicit': boolean;
	'external_urls': {
		'spotify': string;
	};
	'href': string;
	'html_description': string;
	'id': string;
	'images': Image[];
	'is_externally_hosted': boolean;
	'languages': string[];
	'name': string;
	'release_date': string;
	'release_date_precision': string;
	'show': Show;
	'type': 'episode';
	'uri': string;
}

export const HTTP_METHOD = {
	'DELETE': 'DELETE',
	'GET': 'GET',
	'POST': 'POST',
} as const;

interface Image {
	'height': number | null;
	'url': string;
	'width': number | null;
}

export type JSON = string | number | boolean | null | JSON[] | {
	[key: string]: JSON;
};

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

export interface PlaylistTrack {
	'added_at': string | null;
	'added_by': BaseUser | null;
	'is_local': boolean;
	'track': Episode | Track;
}

interface Show {
	'available_markets': string[];
	'copyrights': Copyright[];
	'description': string;
	'explicit': boolean;
	'external_urls': {
		'spotify': string;
	};
	'href': string;
	'html_description': string;
	'id': string;
	'images': Image[];
	'is_externally_hosted': boolean;
	'languages': string[];
	'media_type': string;
	'name': string;
	'publisher': string;
	'total_episodes': number;
	'type': 'show';
	'uri': string;
}

export interface Snapshot {
	'snapshot_id': string;
}

interface Track {
	'album': BaseAlbum;
	'artists': BaseArtist[];
	'available_markets': string[];
	'disc_number': number;
	'duration_ms': number;
	'explicit': boolean;
	'external_ids': {
		'isrc': string;
		'ean': string;
		'upc': string;
	};
	'external_urls': {
		'spotify': string;
	};
	'href': string;
	'id': string;
	'is_local': boolean;
	'name': string;
	'popularity': number;
	'track_number': number;
	'type': 'track';
	'uri': string;
}

interface BaseUser {
	'external_urls': {
		'spotify': string;
	};
	'href': string;
	'id': string;
	'type': 'user';
	'uri': string;
}

interface User extends BaseUser {
	'display_name': string | null;
}
