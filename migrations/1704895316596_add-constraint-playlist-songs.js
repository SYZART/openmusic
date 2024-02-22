/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addConstraint(
        'playlists',
        'fk_playlists.owner_users.id',
        'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'playlist_songs',
        'unique_playlist_id_and_song_id',
        'UNIQUE(playlist_id, song_id)',
    );
    pgm.addConstraint(
        'playlist_songs',
        'fk_playlist_songs.playlist_id_playlists.id',
        'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
    );
    pgm.addConstraint(
        'playlist_songs',
        'fk_playlist_songs.song_id_songs.id',
        'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
    ); 

    pgm.addConstraint(
        'collaborations',
        'unique_playlist_id_and_user_id',
        'UNIQUE(playlist_id, user_id)',
    );

    pgm.addConstraint(
        'collaborations',
        'fk_collaborations.playlist_id_playlists.id',
        'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
    );

    pgm.addConstraint(
        'collaborations',
        'fk_collaborations.user_id_users.id',
        'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
    );
    pgm.addConstraint(
        'playlist_song_activities',
        'fk_playlist_song_activities.playlist_id_playlists.id',
        'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
    );
   
};

exports.down = (pgm) => {
    pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
    pgm.dropConstraint('playlist_songs', 'unique_playlist_id_and_song_id');
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id');
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_users.id');
    pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id');

};
