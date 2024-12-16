const {
	SPOTIFY_CLIENT_ID: clientId,
	SPOTIFY_CLIENT_SECRET: clientSecret,
	SPOTIFY_REFRESH_TOKEN: refreshToken
} = process.env

export const getAccessToken = async () => {
	if (!(refreshToken && clientSecret && clientId)) {
		return null
	}

	const url = "https://accounts.spotify.com/api/token"
	const payload = {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${Buffer.from(
				clientId + ":" + clientSecret
			).toString("base64")}`
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: clientId
		}),
		next: { revalidate: 3600 }
	}
	const response = await fetch(url, payload)
	const { access_token } = await response.json()

	return access_token
}

export const getCurrentlyPlaying = async () => {
	const access_token = await getAccessToken()

	const url = "https://api.spotify.com/v1/me/player/currently-playing"
	const payload = {
		method: "GET",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Bearer ${access_token}`
		},
		next: { revalidate: 10 }
	}

	const response = await fetch(url, payload)

	if (response.status !== 200) {
		return response.status
	}

	const data = await response.json()
	return data
}
