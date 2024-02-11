const http = require ('http');
const app = require('./app');

const PORT = 8080;

const server = http.createServer(app);

server.listen(PORT, function (error) {
  if (error) throw error
  console.log("Server created Successfully")
});