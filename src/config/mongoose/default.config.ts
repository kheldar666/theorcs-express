export default {
  id: "default",
  url:
    process.env.MONGODB_CONNECTION_STRING ||
    "mongodb://localhost:27017/default",
  connectionOptions: {},
};
