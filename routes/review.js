const express = require('express');
const reviewController = require('../controllers/review');
const authController = require('../controllers/auth');

const router = express.Router({ mergeParams: true });
const Validators = require('../utils/validators/review');

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('user'),
        reviewController.reviewFileUploading,
        reviewController.setUserIdToBody,
        reviewController.addproductIdAndUserIdToBody,
        reviewController.sharpForImageProccessing,
        Validators.checkCreateReview,
        reviewController.addReview
    )
    .get(reviewController.createFilterObj, reviewController.getReviews);
    
    router
    .route('/:id')
    .get(Validators.checkGetReview, reviewController.getReview)
    .put(
        authController.protect,
        authController.allowTo('user'),
        reviewController.reviewFileUploading,
        reviewController.sharpForImageProccessing,
        Validators.checkUpdateReview,
        reviewController.updateReview
    )
    .delete(
        authController.protect,
        authController.allowTo('user', 'admin', 'manager'),
        Validators.checkDeleteReview,
        reviewController.deleteReview
    );

module.exports = router;
