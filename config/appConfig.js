module.exports = {
  gravatarOptions: {
    s: 200, // size of image
    r: 'pg', // rating of image
    d: 'mm', // default image
    protocol: 'http',
  },
  modules: [
    'posts',
    'profile',
    'users',
  ],
  profileFields: [
    'handle',
    'website',
    'location',
    'status',
    'skills',
    'bio',
    'githubusername',
    'experience',
    'education',
    'social',
  ],
};
