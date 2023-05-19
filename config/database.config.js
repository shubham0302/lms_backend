const { connect, connection } = require("mongoose");
const { DATABASE_URL } = require("./environment.config");

const connectDb = () => {
    connection.on('connected', () => {
        console.log('Mongo Connection Established');
    });
    connection.on('reconnected', () => {
        console.log('Mongo Connection Reestablished');
    });
    connection.on('disconnected', () => {
        console.log('Mongo Connection Disconnected');
        console.log('Trying to reconnect to Mongo ...');
        setTimeout(() => {
            connect(DATABASE_URL, {
                keepAlive: true,
                socketTimeoutMS: 3000,
                connectTimeoutMS: 3000,
            });
        }, 3000);
    });
    connection.on('close', () => {
        console.log('Mongo Connection Closed');
    });
    connection.on('error', (error) => {
        console.log(`Mongo Connection ERROR: ${error}`);
    });
    const run = async () => {
        await connect(DATABASE_URL, {
            keepAlive: true,
        });
    };
    run().catch((error) => console.error("mongo error", error));
}

module.exports = {
    connectDb
}