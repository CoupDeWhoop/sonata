const app = require('./app.js');
const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
    console.log(`Listening on ${PORT}...`);
})

// see these notes "Hosting a PSQL DB using ElephantSQL and Render"