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
                repComments: [
                    {
                        sender: {type: mongoose.ObjectId},
                        comment: {type: String},
                        icons: [ {
                            icon: {type: String, default:""},
                            from: {type: mongoose.ObjectId},
                        }
                    ],
                        deleteted: {type: Boolean, default: false},
                    }, {
                        timestamps: true,
                    } 
                ],
                icons: [ {
                    icon: {type: String, default:""},
                    from: {type: mongoose.ObjectId},
                }
            ],
                deleteted: {type: Boolean, default: false},
            }, {
                timestamps: true,
            }
        ],
    },
    {
        timestamps: true,
    },
);

// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('comment', CommentSchema)