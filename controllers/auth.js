module.exports = {
	getToken, refreshToken,
}

async function getToken (code) {
	const headers = {
		'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
		'Content-Type': 'application/x-www-form-urlencoded',
	}

	const data = {
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': process.env.REDIRECT_URL,
	}

	const authData = await authFetch(headers, new URLSearchParams(data));

	// NOTE: Keep 5 percent margin of error in authorisation 'expires' timestamp
	return {
		'token': authData.access_token,
		'expires': Date.now() + Math.floor(0.95 * authData.expires_in * 1000),
		'refreshToken': authData.refresh_token,
	}
}

async function refreshToken (refreshToken) {
	const headers = {
		'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
		'Content-Type': 'application/x-www-form-urlencoded',
	}

	const data = {
		'grant_type': 'refresh_token',
		'refresh_token': refreshToken,
	}

	const authData = await authFetch(headers, new URLSearchParams(data));

	// NOTE: Keep 5 percent margin of error in authorisation 'expires' timestamp
	// NOTE: API response only contains (updated) 'refresh_token' if 'refreshToken' needs to be replaced
	return {
		'token': authData.access_token,
		'expires': Date.now() + Math.floor(0.95 * authData.expires_in * 1000),
		'refreshToken': authData.refresh_token ?? refreshToken,
	}
}

async function authFetch (headers, data) {
	const response = await fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: headers, body: data });

	return response.ok
		? await response.json()
		: (() => { throw new Error(`Fetching Spotify Auth API failed with status ${response.status}. URL: ${response.url}`)	})();
}
