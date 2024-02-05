const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`;
const AUTH_ENDPOINT = `https://accounts.spotify.com/api/token`;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

namespace SpotifyApi {
  const getAuthToken = async () => {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );

    const req_params = {
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    };
    const queriedObj = new URLSearchParams([
      ...Object.entries(req_params),
    ]).toString();

    const header = {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const response = await fetch(AUTH_ENDPOINT, {
        method: "POST",
        headers: header,
        body: queriedObj,
      });
      return response.json();
    } catch (e) {
      console.log("Error authorizing spotify : ", e);
    }
  };

  export const showNowPlaying = async () => {
    const { access_token } = await getAuthToken();
    try {
      const res = await fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      return res.json();
    } catch (e) {
      console.log("Error getting spotify data", e);
      return null;
    }
  };
}

export const getSpotifySong = async () => {
  const result = await SpotifyApi.showNowPlaying();
  if (result == null) return null;
  const wholeSong = {
    artist: result.items[0].track.artists[0].name,
    title: result.items[0].track.name,
    coverUrl: result.items[0].track.album.images[1].url,
    songUrl: result.items[0].track.external_urls.spotify,
    previewUrl: result.items[0].track.preview_url,
  };

  return wholeSong;
};

export type SpotifyResult = ReturnType<typeof getSpotifySong>;
