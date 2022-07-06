const userRouter = require('./user.route.js');
const adminRouter = require('./admin.route.js');
const siteRouter = require('./site.route.js');
const conversationRouter = require('./conversation.route.js');

//======================//
function initRoutes(app) {
    app.use('/user', userRouter);
    app.use('/admin', adminRouter);
    app.use('/chat', conversationRouter);
    app.use('/', siteRouter);
}

module.exports = initRoutes;
