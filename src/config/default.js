export default {
  port: 4000,
  dbUri: 'mongodb://user:user@localhost:27017/blog-backend?authSource=admin',
  tokenSecret: 'temp-secret',
  saltRounds: 10,
};
