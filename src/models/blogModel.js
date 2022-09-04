const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema(

    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        body: {
            type: String,
            required: true,
            trim: true
        },

        authorId: {
            type: objectId,
            trim: true,
            ref: "author"
        },

        tags: [{type:String,trim:true}],


        category: {
            type: String,
            trim: true,
            required: true
        },
        subcategory: [{ type: String, required: true }],

        isDeleted: {
            type: Boolean,
            default: false
        },

        deletedAt: { type: String, default: null },

        isPublished: {
            type: Boolean,
            default: false
        },

        publishedAt: { type: String, default: null },
    },

    { timestamps: true },
);

module.exports = mongoose.model("blog", blogSchema)
