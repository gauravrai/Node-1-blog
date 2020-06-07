const Post = require('../models/postModel');
const Categories = require('../models/categoryModel');
const User = require('../models/userModel');
const Comment = require('../models/commentsModel');
const bcrypt = require('bcryptjs');




module.exports = {
    index: async (req, res)=>{
        const posts = await Post.find().lean();
        const categories = await Categories.find().lean();
        res.render('default/index', {posts: posts, categories: categories});
    },
    login: (req, res) =>{
        res.render('default/login');
    },
    loginpost: (req, res) =>{
        //res.render('default/login');
    },
    logout: (req, res)=>{
        req.logout();
        res.redirect('/login');
    },
    registerget: (req, res) =>{
        res.render('default/register');
    },
    registerpost: (req, res) =>{
        let errors = [];

        if(!req.body.firstName){
            errors.push({'message': 'First name is mandatory'});
        }
        if(!req.body.lastName){
            errors.push({'message': 'Last name is mandatory'});
        }
        if(!req.body.email){
            errors.push({'message': 'Email is mandatory'});
        }
        if(!req.body.password){
            errors.push({'message': 'Password is mandatory'});
        }
        if(req.body.password != req.body.passwordConfirm){
            errors.push({'message': 'Passwords must be same'});
        }

        if(errors.length>0){
            
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        }
        else{
            User.findOne({email: req.body.email})
                .lean()
                .then(user =>{
                    if(user){
                        req.flash('error-message', 'Email already exists, please try with different one');
                        res.redirect('/login');
                    }
                    else{
                        const newUser = new User(req.body);
                        bcrypt.genSalt(10, (err, salt)=>{
                            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                                newUser.password = hash;
                                newUser.save().then(user =>{
                                    req.flash('success-message', 'You are now registered');
                                    res.redirect('/login');
                                });
                            });
                        });
                    }
                });
        }
    },
    singlePost: async (req, res)=>{
        const id = req.params.id;
        const categories = await Categories.find().lean();
        Post.findById(id)
            .lean()
            .then(post=>{
                if(!post){
                    res.status(404).json({message: 'Page not found'});
                }
                else{
                    res.render('default/post', {post: post, categories: categories});
                }
            }).catch(error=>{
                //res.send(error);
                res.status(404).json({message: 'Page not found'});
            });
    },
    submitComment: (req, res)=>{
        if(req.user){
            const postId= req.params.id;
            Post.findById(req.body.id).then(post=>{
                const newComment = new Comment({
                    user: req.user._id,
                    post: postId,
                    body: req.body.comment_body
                });
                
                //post.comments.push(newComment);
                post.save().then(savedPost=>{
                    newComment.save().then(savedComment=>{
                        req.flash('success-message', 'Your comment saved successfully');
                        res.redirect('/post/' + post._id);
                    });
                });
            }).catch(error=>{
                res.send(error);
            });
        }
        else{
            req.flash('error-message', "Login to comment");
            res.redirect('/login');
        }
    }
};