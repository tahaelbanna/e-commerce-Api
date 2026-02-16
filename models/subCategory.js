const mongoose = require('mongoose');

const { Schema } = mongoose;
const subCategorySchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name is required'],
            unique: [true, 'must be unique'],
            minlength: [3, 'To Short'],
            maxlength: [35, 'To Long'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: Schema.ObjectId,
            ref: 'Category',
            required: [true, 'main Category is required'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);
