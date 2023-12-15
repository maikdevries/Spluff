const { fetchJSON } = require('./utils.js');

module.exports = {
	getToken, refreshToken,
}

async function getToken (code, codeVerifier) {
	const authData = await authFetch({
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': process.env.REDIRECT_URL,
		'client_id': process.env.CLIENT_ID,
		'code_verifier': codeVerifier,
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
		'client_id': process.env.CLIENT_ID,
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
	return await fetchJSON(
		'POST',
		'https://accounts.spotify.com/api/token',
		{
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		new URLSearchParams(data),
	);
}
