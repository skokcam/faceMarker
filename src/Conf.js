// Configuration for frontend

//Check if are running local or deployed somewhere
const server = window.location.origin !== 'http://localhost:3001' ? window.location.origin:'http://localhost:3000'

const Conf = {
    server: server
}

export default Conf;