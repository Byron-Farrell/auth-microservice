const databaseConnection = require('./database/setup');
const { PORT } = require('./config/server');
const app = require('./app');

databaseConnection();

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});