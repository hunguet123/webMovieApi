const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const CommentSchema = new Schema(
    {
        movie_id: {type: Number, default: 0, unique: true},
        comments: [
            {
                sender: {type: mongoose.ObjectId},
                comment: {type: String},
                icon: {type: String, default: ""},
                deleteted: {type: Boolean, default: false},
            }
        ],
    },
    {
        timestamps: true,
    },
)

// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('comment', CommentSchema)