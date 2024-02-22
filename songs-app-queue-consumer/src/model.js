const mapPlaylistSongDBToModel = (playlistData, songData) => ({
    playlist: {
        id: playlistData.id,
        name: playlistData.name,
        songs :songData
    },
});

module.exports = mapPlaylistSongDBToModel;