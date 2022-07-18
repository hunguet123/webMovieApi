const userRouter = require('./user.route.js');
const siteRouter = require('./site.route.js');
const movieRouter = require('./movie.route');

//======================//
function initRoutes(app) {
    app.use('/user', userRouter);
    app.use('/', siteRouter);
    app.use('/movie', movieRouter);
}

module.exports = initRoutes;
