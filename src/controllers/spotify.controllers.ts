import type { Session } from '@maikdevries/server-sessions';
import type { Credentials } from '../common/types.ts';

import * as spotify from '../services/spotify.services.ts';

const DENO_ORIGIN = Deno.env.get('DENO_ORIGIN') ?? '';

export async function playlists(_: Request, session: Session): Promise<Response> {
	const credentials = session.get<Credentials>('credentials');
	if (!credentials?.token) return Response.redirect(new URL('/auth/login', DENO_ORIGIN));

	return Response.json(await spotify.getPlaylists(credentials.token));
}
