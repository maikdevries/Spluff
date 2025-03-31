import type { Playlist, PlaylistTrack } from '../common/types.ts';

import * as fetch from '../common/fetch.ts';

export async function getPlaylists(token: string): Promise<Playlist[]> {
	return await fetch.pull<Playlist>(token, 'GET', 'me/playlists');
}

export async function getPlaylistTracks(token: string, id: string): Promise<PlaylistTrack[]> {
	return await fetch.pull<PlaylistTrack>(token, 'GET', `playlists/${id}/tracks`);
}
