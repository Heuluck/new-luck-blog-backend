/**
 * Express router paths go here.
 */


export default {
  Base: '/api',
  Ping: {
    Base: '/ping',
    Get: '/',
  },
  Blog: {
    Base: '/blog',
    Get: '/list',
    GetById: '/:id',
    GetByTitleURL: '/article/:titleURL'
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
