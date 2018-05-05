var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//App config
mongoose.connect("mongodb://localhost/f1_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use (bodyParser.urlencoded({extended: true}));

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

// Blog.create({
//     title: "Test",
//     image: "https://cdn-2.motorsport.com/images/amp/2j7XBmkY/s6/f1-abu-dhabi-gp-2017-valtteri-bottas-mercedes-amg-f1-w08-lewis-hamilton-mercedes-amg-f1-w0-7295925.jpg",
//     body:"hello f1 bloggers"
// });

//RESTful Routes
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

//listening port
app.listen("3001", function () {
    console.log("Server started");
});