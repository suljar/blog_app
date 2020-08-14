const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express()


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(expressSanitizer())
app.use(express.static("public"))
mongoose.connect('mongodb://localhost:27017/blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(methodOverride("_method"))

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
})

let Blog = mongoose.model("Blog", blogSchema)

app.get("/", (req, res) => {
    res.redirect("/blog")
})
app.get("/blog", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err)
        } else {
            res.render("index", {
                blogs: blogs
            })
        }
    })
})

app.get("/blog/new", (req, res) => {
    res.render("new")
})

app.post("/blog", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log(err)

        } else {
            res.redirect("/blog")
        }
    })
})

app.get("/blog/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundblog) => {
        if (err) {
            res.redirect("/blog")
        } else {
            res.render("show", {
                blog: foundblog
            })
        }
    })
})

app.get("/blog/:id/edit", (req, res) => {

    Blog.findById(req.params.id, (err, foundblog) => {
        if (err) {
            res.redirect("/blog")
        } else {
            res.render("edit", {
                blog: foundblog
            })
        }
    })
})
app.put("/blog/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedblog) => {
        if (err) {
            res.redirect("/blog")
        } else {
            res.redirect("/blog/" + req.params.id)
        }
    })
})
app.delete("/blog/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/blog")
        } else {
            res.redirect("/blog")
        }
    })
})
app.listen(3000, () => {
    console.log("Server Has Started")
})