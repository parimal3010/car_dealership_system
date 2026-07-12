const mongoose = require('mongoose');

const connectDatabase = async (uri) => {
  const connectionUri = uri || process.env.MONGODB_URI;

  if (!connectionUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(connectionUri);
  console.log("MongoDB Connected");
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
