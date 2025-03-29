import type { Playlist } from '../common/types.ts';

import * as fetch from '../common/fetch.ts';

export async function playlists(token: string): Promise<Playlist[]> {
	return await fetch.items<Playlist>(token, 'GET', 'me/playlists');
}
