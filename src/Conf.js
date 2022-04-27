// Configuration for frontend

//Check if are running local or deployed somewhere
let server = (window.location.origin !== 'http://localhost:3001') ? window.location.origin:'http://localhost:3000';
if (server.includes('github.io')) {
  server = 'https://rocky-spire-68123.herokuapp.com'
}

const Conf = {
    server: server
}

export default Conf;