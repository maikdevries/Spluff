import type { Playlist, PlaylistTrack, Snapshot } from '../common/types.ts';

import * as fetch from '../common/fetch.ts';

export async function getPlaylists(token: string): Promise<Playlist[]> {
	return await fetch.pull<Playlist>(token, 'GET', 'me/playlists');
}

export async function addPlaylistTracks(token: string, id: string, tracks: PlaylistTrack[]): Promise<Snapshot> {
	return await fetch.push<Snapshot>(token, 'POST', `playlists/${id}/tracks`, 'uris', tracks.map((x) => x.track.uri));
}

export async function getPlaylistTracks(token: string, id: string): Promise<PlaylistTrack[]> {
	return await fetch.pull<PlaylistTrack>(token, 'GET', `playlists/${id}/tracks`);
}

export async function removePlaylistTracks(token: string, id: string, tracks: PlaylistTrack[]): Promise<Snapshot> {
	return await fetch.push<Snapshot>(token, 'DELETE', `playlists/${id}/tracks`, 'tracks', tracks.map((x) => ({ 'uri': x.track.uri })));
}
