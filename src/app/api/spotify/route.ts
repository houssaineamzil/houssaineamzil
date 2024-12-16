import { getCurrentlyPlaying } from "@/utils/spotify"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest, res: NextResponse) => {
	const response = await getCurrentlyPlaying()

	if (response.status === 204 || response.status > 400) {
		return Response.json({ isPlaying: false }, { status: 200 })
	}

	if (!response.item) {
		return Response.json({ isPlaying: false }, { status: 200 })
	}

	const { is_playing: isPlaying, item } = response
	const { name, artists, album } = item
	const artistNames = artists.map((artist: { name: string }) => artist.name)
	const href = album?.external_urls?.spotify

	return Response.json(
		{
			isPlaying,
			name,
			href,
			artists: artistNames
		},
		{ status: 200 }
	)
}
