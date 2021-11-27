const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const chatroomRoute = require('./chatroom.route');
const messageRoute = require('./message.route');
const songRoute = require('./song.route');
const playlistRoute = require('./playlist.route');
const userDetailRoute = require('./userDetail.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/chatrooms',
    route: chatroomRoute,
  },
  {
    path: '/songs',
    route: songRoute,
  },
  {
    path: '/messages',
    route: messageRoute,
  },
  {
    path: '/userDetails',
    route: userDetailRoute,
  },
  {
    path: '/playlists',
    route: playlistRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
