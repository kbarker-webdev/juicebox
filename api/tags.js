const express = require('express');
const { getAllTags, getPostsByTagName } = require('../db');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
  
    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    try {
      const posts = await getPostsByTagName(tagName);
      const filteredPosts = posts.filter(post => {
        return post.active || (req.user && post.author.id === req.user[0].id);
      });
      res.send({ posts: filteredPosts})
    } catch ({ name, message }) {
      next({
        name: "CouldNotGetPostsWithTag",
        message: `Could not get posts with tag: ${tagName}`
      })
    }
  });

module.exports = tagsRouter;
