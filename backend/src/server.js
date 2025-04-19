const app = require('./app');
const connectMongo = require('./db/mongo');
const PORT = process.env.PORT || 5050;

const startServer = async () => {
  try {
    await connectMongo(); 
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};
startServer();

