// import modul @hapi/hapi
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// membuat server
const init = async() =>{
    const server = Hapi.server({
        port: 9000,
        host: 'localhost'
    });

    server.route(routes);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

init();