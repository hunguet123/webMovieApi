const { GenderOptions } = require('../types/custom-types.js');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        username: { type: String, default: '' },
        given_name: { type: String, default: '' },
        family_name: { type: String, default: '' },
        email: { type: String, default: '', unique: true },
        email_verified: { type: Boolean, default: 'false' },
        password: { type: String, default: '' },
        picture: { 
            name: {type: String, default: 'default.jpg',},
            image_url: {type: Boolean, default: 'false'},
        },
        role: {type: String, default: undefined},
        gender: {type: String, default: GenderOptions.OTHER},
        slug: { type: String, slug: 'email', unique: true },
    },
    {
        timestamps: true,
    },
)

// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('user', UserSchema)