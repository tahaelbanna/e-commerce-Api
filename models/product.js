const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'title is required'],
            unique: [true, 'must be unique'],
            minlength: [3, 'To Short'],
            maxlength: [100, 'To Long'],
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'description is required'],
            minlength: [20, 'To Short'],
        },
        quantity: {
            type: Number,
            required: [true, 'you must provide the available quantity'],
        },
        sold: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            trim: true,
            required: [true, `you must provide the price`],
        },
        priceAfterDiscount: {
            type: Number,
        },
        colors: [String],
        imageCover: {
            type: String,
            required: [true, `you must provide the image`],
        },
        images: [String],
        category: {
            type: Schema.ObjectId,
            ref: 'Category',
            required: [true, `you must provide the category`],
        },
        subcategories: [
            {
                type: Schema.ObjectId,
                ref: 'SubCategory',
            },
        ],
        brand: {
            type: Schema.ObjectId,
            ref: 'Brand',
        },
        ratingAverage: {
            type: Number,
            trim: true,
            min: [1, `rating must be >= 1`],
            max: [5, `rating must be <= 5`],
        },
        ratingQuantity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
productSchema.pre(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name -_id' });
});

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
});

const setImageUrl = (doc) => {
    if (doc.imageCover) {
        doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    }
    if (doc.images) {
        const imagesList = [];
        doc.images.forEach((image) => {
            imagesList.push(`${process.env.BASE_URL}/products/${image}`);
        });
        doc.images = imagesList;
    }
};

productSchema.post('init', (doc) => {
    setImageUrl(doc);
});

productSchema.post('save', (doc) => {
    setImageUrl(doc);
});

module.exports = mongoose.model('Product', productSchema);
