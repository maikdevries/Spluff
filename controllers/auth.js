module.exports = {
	getToken, refreshToken,
}

async function getToken (code) {
	const authData = await authFetch({
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': process.env.REDIRECT_URL,
	});

	// NOTE: Keep 5 percent margin of error in authorisation 'expires' timestamp
	return {
		'token': authData.access_token,
		'expires': Date.now() + Math.floor(0.95 * authData.expires_in * 1000),
		'refreshToken': authData.refresh_token,
	}
}

async function refreshToken (refreshToken) {
	const authData = await authFetch({
		'grant_type': 'refresh_token',
		'refresh_token': refreshToken,
	});

	// NOTE: Keep 5 percent margin of error in authorisation 'expires' timestamp
	// NOTE: API response only contains (updated) 'refresh_token' if 'refreshToken' needs to be replaced
	return {
		'token': authData.access_token,
		'expires': Date.now() + Math.floor(0.95 * authData.expires_in * 1000),
		'refreshToken': authData.refresh_token ?? refreshToken,
	}
}

async function authFetch (data) {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		'method': 'POST',
		headers: {
			'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams(data),
	});

	return response.ok
		? await response.json()
		: (() => { throw new Error(`Fetching Spotify Auth API failed with status ${response.status}. URL: ${response.url}`)	})();
}
