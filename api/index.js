const express = require('express');
const usersRouter = require('./users');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');

const apiRouter = express.Router();
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter)

module.exports = apiRouter;