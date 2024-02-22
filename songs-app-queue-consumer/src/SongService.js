const { Pool } = require('pg');
const mapPlaylistSongDBToModel = require('./model')
 
class SongService {
  constructor() {
    this._pool = new Pool();
  }
 
  async getSongs(playlistId) {

  const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name FROM playlists
      LEFT JOIN users on playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlistId],
  };
  const querySong = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      JOIN songs on playlist_songs.song_id = songs.id
      WHERE playlist_id = $1`,
      values: [playlistId],
  };

  const resultPlaylist = await this._pool.query(queryPlaylist);
  const resultSongs = await this._pool.query(querySong);
  return mapPlaylistSongDBToModel(resultPlaylist.rows[0], resultSongs.rows);
}
}
module.exports= SongService;