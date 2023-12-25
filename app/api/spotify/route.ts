const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_ACCESS_TOKEN: access_token,
} = process.env;

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

interface SpotifyData {
  is_playing: boolean;
  item: {
    name: string;
    album: {
      name: string;
      artists: Array<{ name: string }>;
      images: [{ url: string }];
    };
    external_urls: {
      spotify: string;
    };
  };
  currently_playing_type: string;
}

export const GET = async () => {
  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 120 },
  });

  const data = (await response.json()) as SpotifyData;

  if (response.status === 204 || response.status > 400 || !data.is_playing) {
    return Response.json({ isPlaying: data.is_playing }, { status: 200 });
  }

  return Response.json(
    // data,
    {
      isPlaying: data.is_playing,
      title: data.item.name,
      album: data.item.album.name,
      artist: data.item.album.artists.map((artist) => artist.name).join(", "),
      albumImageUrl: data.item.album.images[0].url,
      songUrl: data.item.external_urls.spotify,
    },
    { status: 200 },
  );
};
