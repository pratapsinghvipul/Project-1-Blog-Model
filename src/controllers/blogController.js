const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { isValid } = require("../validator/validator");


const createBlog = async function (req, res) {
  try {
    let blog = req.body
    if (!isValid(blog.title)) {
      return res.status(400).send({ status: false, msg: "title is required" })
    }
    if (!isValid(blog.body)) {
      return res.status(400).send({ status: false, msg: "body is required" })
    }
    if (!isValid(blog.category)) {
      return res.status(400).send({ status: false, msg: "category is required" })
    }
    if (!isValid(blog.authorId)) {
      return res.status(400).send({ status: false, msg: "authorId is required" })
    }

    let authorIdByUser = blog.authorId
    let authorId = await authorModel.findById(authorIdByUser)
    if (authorId == null) {
      res.status(400).send({
        status: false,
        msg: "enter the valid authorId"
      })
    }
    else {
      let blogCreated = await blogModel.create(blog)
      res.status(201).send({
        status: true,
        msg:"New Blog created successfully",
        data: blogCreated
      })
    }
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}

const getBlogs = async function (req, res) {
  try {
    let data = req.query;
    let specificBlog = await blogModel.find({
      $and: [data,
        { isDeleted: false },
        { isPublished: true }
      ]
    }).populate("authorId")
    if (specificBlog.length == 0) {
      return res.status(404).send({
        status: false,
        msg: "Blog not found"
      })
    }
    res.status(200).send({
      status: true,
      data: specificBlog
    })
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}
const updateBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    let data = req.body;
    let blog = await blogModel.findOne({ _id: id, isDeleted: false });
    if (blog === null) {
      return res.status(404).send('No such blog found');
    }
    if (data.title) {
      blog.title = data.title
    };
    if (data.category) {
      blog.category = data.category
    };
    if (data.body) {
      blog.body = data.body
    };
    if (data.tags) {
      blog.tags.push(data.tags);
    }
    if (data.subcategory) {
      blog.subcategory.push(data.subcategory);
    }
    blog.isPublished = true;
    blog.publishedAt = new Date();
    let updateData = await blogModel.findByIdAndUpdate({ _id: id }, blog, {
      new: true,
    });
    res.status(200).send({ status: true, msg: updateData });
  } catch (err) {
    res.status(500).send({ msg: 'Error', error: err.message });
  }
};

const deleteBlogByPath = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!blogId)
      res.status(400).send({ status: false, msg: "Please include an blogId" });
    let blog = await blogModel.findById(blogId);
    if (!blog)
      return res.status(404).send({ status: false, msg: "BLOG NOT FOUND" });
    if (blog.isDeleted == true) {
      res.status(400)
        .send({ status: false, msg: "This data is already deleted" });
    }
    let newData = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    res.status(200).send({ status: true, data: newData });
  } catch (err) {
    res.status(500).send({ status: false, msg: "ERROR", error: err.message });
  }
};
const deleteBlogByQuery = async function (req, res) {
  try {
    const data = req.query
    const { category, authorId } = data
    let isPublishedData = data.isPublished
    const tagsData = data.tags
    const subcategoryData = data.subcategory
    if (data.keys().length == 0) {
      res.status(400).send({ status: false, msg: "Data can't be empty" });
      if (isPublishedData || isPublishedData == "") {
        if (isPublishedData == "false") {
          isPublishedData == false
        }
        else {
          return res.status(400).send({ status: false, msg: "isPublished should be false" })
        }
      }
      const blogDetails = await blogModel.find({
        $or: [{ category }, { authorId }, { tags: { $in: tagsData } },
        { isPublished: isPublishedData },
        { subcategory: { $in: subcategoryData, } }],
        isDeleted: false
      })
      if (blogDetails.length == 0) {
        res.status(404).send({ status: false, msg: "Blog Data is Not Available" })
      }
      else {
        await blogModel.updateMany({
          $or: [{ category },
          { authorId },
          { tags: { $in: tagsData } },
          { isPublished: isPublishedData },
          { subcategory: { $in: subcategoryData, } }],
          isDeleted: false
        },
          { isDeleted: true, deletedAt: new Date() })
        res.status(200).send()
      }
    }
    else {
      res.status(400).send({ status: false, msg: "Invalid Data" })
    }
  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}



module.exports = {createBlog, getBlogs, updateBlog, deleteBlogByPath,
 deleteBlogByQuery}







