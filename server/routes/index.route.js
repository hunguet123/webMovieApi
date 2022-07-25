const userRouter = require('./user.route.js');
const siteRouter = require('./site.route.js');
const movieRouter = require('./movie.route');
const commentRouter = require('./comment.route');

//======================//
function initRoutes(app) {
    app.use('/user', userRouter);
    app.use('/', siteRouter);
    app.use('/movie', movieRouter);
    app.use('/comment', commentRouter);
}

module.exports = initRoutes;
