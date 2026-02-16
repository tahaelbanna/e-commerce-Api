const express = require('express');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

const router = express.Router();
const Validators = require('../utils/validators/user');

router.get(
    '/getMe',
    authController.protect,
    userController.getLoggedUserData,
    userController.getUser
);
router.put(
    '/changePassword',
    authController.protect,
    Validators.checkUpdateLoggedUserPassword,
    userController.updateLoggedUserPassword
);
router.put(
    '/updateMe',
    authController.protect,
    Validators.checkUpdateLoggedUser,
    userController.updateLoggedUser
);
router.delete(
    '/deActiveMe',
    authController.protect,
    userController.deActiveLoggedUser
);

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('admin'),
        userController.userFileUploading,
        userController.sharpForImageProccessing,
        Validators.checkCreateUser,
        userController.addUser
    )
    .get(
        authController.protect,
        authController.allowTo('admin'),
        userController.getUsers
    );

router.put(
    '/changePassword/:id',
    authController.protect,
    authController.allowTo('admin'),
    Validators.checkUpdateUserPassword,
    userController.updateUserPassword
);

router
    .route('/:id')
    .get(
        authController.protect,
        authController.allowTo('admin'),
        Validators.checkGetUser,
        userController.getUser
    )
    .put(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        userController.userFileUploading,
        userController.sharpForImageProccessing,
        Validators.checkUpdateUser,
        userController.updateUser
    )
    .delete(
        authController.protect,
        authController.allowTo('admin'),
        Validators.checkDeleteUser,
        userController.deleteUser
    );

module.exports = router;
