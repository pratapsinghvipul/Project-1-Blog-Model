const express = require('express')
const router = express.Router()
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const {authenticate,authorise} = require("../middleware/middleware")


//author Api
router.post("/authors", authorController.createAuthor)
router.post("/login", authorController.loginAuthor)

// blog Api
router.post("/blogs", authenticate,blogController.createBlog)
router.get("/blogs", authenticate, blogController.getBlogs)
router.put("/blogs/:blogId",authenticate,authorise, blogController.updateBlog)
router.delete("/blogs/:blogId",authenticate,authorise, blogController.deleteBlogByPath)
router.delete("/blogs",authenticate,blogController.deleteBlogByQuery)


module.exports = router;