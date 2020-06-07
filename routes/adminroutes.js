const express = require('express');
const router =  express.Router();

const adminController = require('../controllers/adminController');
const {isUserAuthenticated} = require('../config/customFunction');

router.all('/*', isUserAuthenticated, (req, res, next)=>{
    req.app.locals.layout = "admin";
    next();
});

router.route('/')
    .get(adminController.index);

router.route('/posts')
    .get(adminController.getPosts);

router.route('/posts/create')
    .get(adminController.createPost)
    .post(adminController.submitPosts);

router.route('/posts/edit/:id')
    .get(adminController.editPost)
    .post(adminController.editPostSubmit);

router.route('/categories')
    .get(adminController.getCategories)
    .post(adminController.createCategory);

router.route('/category/edit/:id')
    .get(adminController.editCategory)
    .post(adminController.editCategorySubmit);

router.route('/comments')
    .get(adminController.getComments);














module.exports = router;