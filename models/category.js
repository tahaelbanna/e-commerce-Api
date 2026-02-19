const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            unique: [true, 'must be unique'],
            minlength: [3, 'To Short'],
            maxlength: [35, 'To Long'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        imageUrl: {
            type: String,
            required: [true, 'image is required'],
        },
    },
    { timestamps: true }
);

const setImageUrl = (doc) => {
    doc.imageUrl = `${process.env.BASE_URL}/categories/${doc.imageUrl}`;
};


categorySchema.post('init', (doc) => {
    setImageUrl(doc);
});


categorySchema.post('save', (doc) => {
    setImageUrl(doc);
});

module.exports = mongoose.model('Category', categorySchema);
