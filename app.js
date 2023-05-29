const express = require('express')
const { PORT } = require('./config/environment.config')
const cors = require('cors')
const { connection } = require('mongoose')
const { connectDb } = require('./config/database.config')
const { userRouter } = require('./routes/users')
const compression = require('compression')
const { departmentRouter } = require('./routes/department')
const { moduleRouter } = require('./routes/module')
const { subModuleRouter } = require('./routes/subModule')
const { uploadRouter } = require('./routes/upload')
const { quizRouter } = require('./routes/quiz')

const app = express()

const config = () => {
    app.set('port', parseInt(PORT || 8080))
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }));
    app.use(compression());
    connectDb()
}
global.dirname = __dirname;

const routes = () => {
    app.use('/api/auth', userRouter)
    app.use('/api/department', departmentRouter)
    app.use('/api/module', moduleRouter)
    app.use('/api/sub-module', subModuleRouter)
    app.use('/api/upload', uploadRouter)
    app.use('/api/quiz', quizRouter)
}

const runAppServer = () => {
    connection.on('connected', async () => {
        app.listen(PORT, () => {
            console.log('Server is listening on ' + PORT);
        });
    });
}

config()
routes()

module.exports = { runAppServer }