const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
            lowercase: [true, 'email must written in lowerCase'],
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            minlength: [8, 'To Shortt'],
        },
        passwordChangedAt: {
            type: Date,
        },
        resetCode: String,
        resetCodeExpiry: Date,
        verifyResetCode: Boolean,
        phoneNumber: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'manager'],
            default: 'user',
        },
        active: {
            type: Boolean,
            default: true,
        },
        wishList: [
            {
                type: Schema.ObjectId,
                ref: 'Product',
            },
        ],
        address: [
            {
                id: Schema.Types.ObjectId,
                alias: {
                    type: String,
                    required: [true, 'alias should be added'],
                },
                details: {
                    type: String,
                    required: [true, 'details should be added'],
                },
                phoneNumber: {
                    type: Number,
                    required: [true, 'phone number shold be added'],
                },
                city: {
                    type: String,
                    required: [true, 'city should be added'],
                },
                postalCode: Number,
            },
        ],
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model('User', userSchema);
