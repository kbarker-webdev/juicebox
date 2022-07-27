const express = require('express');
const usersRouter = require('./users');
const postsRouter = require('./posts');
const tagsRouter = require('./tags');
const { getUserById } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const apiRouter = express.Router();

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {

    const token = auth.slice(prefix.length);

    try {
      const { user } = jwt.verify(token, JWT_SECRET);

      if (user.id) {
        req.user = await getUserById(user.id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
});

apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);

apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message
    });
});

module.exports = apiRouter;