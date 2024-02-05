import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import querystring from "querystring"
import crypto from "crypto"

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`

export interface SpotifyData {
	[key: string]: any
}

const {
	SPOTIFY_CLIENT_ID: client_id, // your clientId
	SPOTIFY_CLIENT_SECRET: client_secret, // Your secret
	REDIRECT_URI: redirect_uri, // Your redirect uri
} = process.env

const generateRandomString = (length: number) => {
	return crypto.randomBytes(60).toString("hex").slice(0, length)
}

const getAccessToken = async (code: any) => {
	const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64")
	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			Authorization: `Basic ${basic}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: querystring.stringify({
			code: code,
			redirect_uri: redirect_uri,
			grant_type: "authorization_code",
		}),
	})

	return response.json()
}

export const getNowPlaying = async (access_token: string) => {
	return fetch(NOW_PLAYING_ENDPOINT, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})
}

export const GET = async (request: NextRequest) => {
	const searchParams = request.nextUrl.searchParams
	const code = searchParams.get("code")
	const state = searchParams.get("state")
	const storedState = request.cookies.get("spotify_auth_state")

	if (code && state && state === storedState?.value) {
		const { access_token } = await getAccessToken(code)
		const response = await getNowPlaying(access_token)

		if (response.status === 204 || response.status > 400) {
			return Response.json({ isPlaying: false }, { status: 200 })
		}

		const song = await response.json()
		const albumImageUrl = song.item.album.images[0].url
		const artist = song.item.artists
			.map((artist: { name: string }) => artist.name)
			.join(", ")
		const isPlaying = song.is_playing
		const songUrl = song.item.external_urls.spotify
		const title = song.item.name

		return Response.json(
			{
				albumImageUrl,
				artist,
				isPlaying,
				songUrl,
				title,
			},
			{ status: 200 }
		)
	} else {
		const state = generateRandomString(16)
		cookies().set("spotify_auth_state", state)
		var scope = "user-read-private user-read-email user-read-playback-state"

		redirect(
			"https://accounts.spotify.com/authorize?" +
				querystring.stringify({
					response_type: "code",
					client_id: client_id,
					scope: scope,
					redirect_uri: redirect_uri,
					state: state,
				})
		)
	}
}
