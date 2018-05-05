var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

//App config
mongoose.connect("mongodb://localhost/f1_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use (bodyParser.urlencoded({extended: true}));
app.use (methodOverride("_method"));

//Schema Setup: Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    //for default image
    //  image: {type: String, default: "placeholder.jpg"},
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
//ROOT
app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    //Get all blogs from DB
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW Route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE Route
app.post("/blogs",function(req,res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) {
            res.render("new");
        } else {
            //then redirect to the index
            res.redirect("/blogs");
        }
    }); 
});

//SHOW route
app.get("/blogs/:id", function(req, res){
    //find the blog with provided ID
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            //reder show template with that blog
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT route
app.get("/blogs/:id/edit", function(req, res){
   // find the blog with provided ID
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            //reder edit template with that blog
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
         if(err) {
             console.log(err);
             res.redirect("/index");
         } else {
             res.redirect("/blogs/" + req.params.id);
         }
     });
 });

 //DELETE route
 app.delete("/blogs/:id", function(req, res){
     //delete blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

//listening port
app.listen("3001", function () {
    console.log("Server started");
});