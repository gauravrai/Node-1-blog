const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const Comment = require('../models/commentsModel');
const {isEmpty} = require('../config/customFunction');

module.exports = {
    index: (req, res)=>{
        res.render('admin/index');
    },
    getPosts: (req, res)=>{
        Post.find().lean()
            .populate('category')
            .then(posts =>{
                res.render('admin/posts/index', {posts: posts});
            });
    },
    submitPosts: (req, res)=>{
        const commentsAllowed = req.body.allowComments? true: false;

        let filename = '';
        if(!isEmpty(req.files)){
            let file = req.files.file;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir +  filename, (error)=>{
                if(error){
                    throw error;
                }
            });
        }
        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${filename}`
        });
        newPost.save().then(post =>{
            console.log(post);
            req.flash('success-message', 'Post saved succesfully');
            res.redirect('/admin/posts');
        });
    },
    createPost: (req, res)=>{
        Category.find().lean().then(categories=>{
            res.render('admin/posts/create', {categories: categories});
        });
        
    },
    editPost: (req, res)=>{
        const id = req.params.id;
        Post.findById(id)
            .lean()
            .then(post=>{
               Category.find()
                        .lean() 
                        .then(categories =>{
                            res.render('admin/posts/edit', {post: post, categories: categories});
                        });
        });  
    },
    editPostSubmit: (req, res)=>{
        
        const commentsAllowed = req.body.allowComments? true: false;
        const id = req.params.id;

        let filename = '';
        if(!isEmpty(req.files)){
            let file = req.files.file;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir +  filename, (error)=>{
                if(error){
                    throw error;
                }
            });
        }

        Post.findByIdAndUpdate(id, {
            "title": req.body.title,
            "description": req.body.description,
            "status": commentsAllowed,
            "category": req.body.category,
            "file": `/uploads/${filename}`
        }, function(err, result){
            if(err)
                res.send(err);
            req.flash('success-message', `The post updated succesfully`);
            res.redirect('/admin/posts/edit/' + result._id);
        });
    },
    getCategories: (req, res)=>{
        Category.find().lean().then(categories =>{
            res.render('admin/category/index', {categories: categories});
        });
    },
    createCategory: (req, res)=>{
        var categoryName = req.body.name;
        if(categoryName){
            const newCategory = new Category({
                title: categoryName
            });
            newCategory.save().then(category =>{
                res.status(200).json(category);
            });
        }
    },
    editCategory: async(req, res)=>{
        const id = req.params.id;
        const categories = await Category.find().lean();

        Category.findById(id).lean().then(cat =>{
            res.render('admin/category/edit', {category: cat, categories: categories});
        });
    },
    editCategorySubmit: (req, res)=>{
        const id = req.params.id;
        const newTitle = req.body.name;
        
        if(newTitle){
            Category.findByIdAndUpdate(id, {
                'title': newTitle
            }, function(err, result){
                if(err)
                    res.send(err);
                res.status(200).json({url: '/admin/categories/'});
            });
        }
    },
    getComments: (req, res)=>{
        Comment.find()
                .lean()
                .populate('user')
                .populate('post')
                .then(comments=>{
                    res.render('admin/comments/index', {comments: comments});
                });
    }
    
};