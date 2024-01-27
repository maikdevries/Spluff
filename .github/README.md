<p align='center'>
	<img src='../public/resources/spluff.svg' width='300' height='120' alt='Spluff wordmark logo'>
	<br><br>
	Spluff is a simple tool that fully shuffles the songs in any of your <b><a href='https://www.spotify.com'>Spotify</a></b> playlists.
	<br>
	Its purpose is to 'reset' Spotify's shuffle algorithm through the use of the official <b><a href='https://developer.spotify.com/documentation/web-api'>Spotify Web API</a></b>.
	<br><br>
	<b><a href='https://spluff.maikdevries.com'>Launch Spluff</a></b>
</p>

### **Local installation**
1. After cloning the repository to your local machine, navigate to root and install required dependencies:
	```console
	$ npm install
	```

2. Create a new application through the [Spotify Developer dashboard](https://developer.spotify.com/dashboard). Make sure to set the  **Redirect URI** field to `http://localhost:[PORT]/auth/login`.

3. Create a new environment variables file `.env` at root and set the following variables:
	```env
	SESSION_SECRET='[SESSION_SECRET]'
	PORT='[PORT]'

	CLIENT_ID='[SPOTIFY_CLIENT_ID]'
	CLIENT_SECRET='[SPOTIFY_CLIENT_SECRET]'

	DOMAIN_ORIGIN='http://localhost:[PORT]'
	REDIRECT_URL='http://localhost:[PORT]/auth/login'
	```
	Take special care to swap out `[SESSION_SECRET]` for a random set of characters not easily parsed by a human to avoid session hijacking.

4. Edit `app.mjs` with the following changes:
	```js
	'session.cookie.secure': true -> 'session.cookie.secure': false
	'session.proxy': true -> 'session.proxy': false

	// Insert the following line to serve the static content files:
	+ app.use(Express.static('./public'));
	  app.use(Express.json());
	  ...
	```

5. Finally, to launch a local instance available at `http://localhost:[PORT]`:
	```console
	$ node app.mjs
	```

### **Contributing**
People are free to contribute to the project by opening issues and pull requests in accordance with the **[Contribution Guidelines](https://github.com/maikdevries/Spluff/blob/main/.github/CONTRIBUTING.md)**.
