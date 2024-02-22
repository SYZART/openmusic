require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const config = require('./utils/config');

const ClientError = require('./exceptions/ClientError');

const albums = require('./api/albums');
const AlbumService = require('./service/postgres/albums/AlbumService');
const { AlbumValidator } = require('./validator/albums');

const songs = require('./api/songs');
const SongService = require('./service/postgres/songs/SongService');
const { SongValidator } = require('./validator/songs');

const users = require('./api/users');
const UserService = require('./service/postgres/users/UserService');
const { UserValidator } = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationService = require('./service/postgres/authentications/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const { AuthenticationValidator } = require('./validator/authentications');

const ActivityService = require('./service/postgres/activities/ActivityService');

const playlists = require('./api/playlists');
const PlaylistService = require('./service/postgres/playlists/PlaylistService');
const { PlaylistValidator } = require('./validator/playlists');

const collaborations = require('./api/collaborations');
const CollaborationService = require('./service/postgres/collaborations/CollaborationService');
const { CollaborationValidator } = require('./validator/collaborations');

const StorageService = require('./service/storages/StorageService');

const CacheService = require('./service/redis/CacheService');

const _exports = require('./api/rabbitmq/exports');
const ProducerService = require('./service/rabbitmq/ProducerService');
const { ExportPlaylistValidator } = require('./validator/exports');

const init = async () => {
  // cache
  const cacheService = new CacheService();
  // album
  const albumService = new AlbumService(cacheService);
  const albumValidator = new AlbumValidator();
  // song
  const songService = new SongService();
  const songValidator = new SongValidator();
  // user
  const userService = new UserService();
  const userValidator = new UserValidator();
  // authentications
  const authenticationService = new AuthenticationService();
  const authenticationValidator = new AuthenticationValidator();
  // activity
  const activityService = new ActivityService();
  // collaborations
  const collaborationService = new CollaborationService(userService);
  const collaborationValidator = new CollaborationValidator();
  // playlists
  const playlistService = new PlaylistService(
    songService,
    activityService,
    collaborationService,
  );
  const playlistValidator = new PlaylistValidator();
  // storage
  const albumStorageService = new StorageService();

  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('open_music_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      Credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  await server.register([
    {
      plugin: albums,
      options: {
        albumService,
        storageService: albumStorageService,
        validator: albumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: songValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: playlistValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: userValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: authenticationValidator,
      },
    },

    {
      plugin: collaborations,
      options: {
        collaborationService,
        playlistService,
        validator: collaborationValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        exportService: ProducerService,
        playlistService,
        validator: ExportPlaylistValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};
init();
