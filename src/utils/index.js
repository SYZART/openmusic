const mapSongsDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});
const mapAlbumDBToModel = ({
  id, 
  name, 
  cover,
  year, 
}, song) => ({
  id, 
  name,
  coverUrl: (cover === null) ? null : cover, 
  year, 
  songs: song,
});
const mapPlaylistSongDBToModel = (playlistData, songData) => ({
  playlist: {
    id: playlistData.id,
    name: playlistData.name,
    username: playlistData.username,
    songs: songData,
  },
});

const mapPlalistActivityDBToModel = (playlistId, activities) => ({
  playlistId: playlistId,
  activities: activities,
});
const mapAlbumLikeDBToModel = (count) => ({
  likes: parseInt(count, 10),
});

const mapSongList = ({ id, title, performer }) => ({
  id: id,
  title: title,
  performer: performer,
});
module.exports = {
  mapSongsDBToModel,
  mapAlbumDBToModel,
  mapPlaylistSongDBToModel,
  mapPlalistActivityDBToModel,
  mapSongList,
  mapAlbumLikeDBToModel,
};
