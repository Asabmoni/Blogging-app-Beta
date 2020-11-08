//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//Database
mongoose.connect('mongodb://localhost:27017/PostDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const blogSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	content: String,
});

const blogs = new mongoose.model('Blog', blogSchema);

//*****************************Main code***********************************************************/

app.get('/', (req, res) => {
	blogs.find({}, (err, foundPosts) => {
		if (!foundPosts) {
			res.render('home');
		} else {
			res.render('home', { posts: foundPosts });
		}
	});
});

app.get('/contact', (req, res) => {
	res.render('Contact');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/compose', (req, res) => {
	res.render('compose');
});

app.post('/delete', (req, res) => {
	const delpost = req.body.button;
	blogs.findOneAndDelete({ _id: delpost }, (err, doc) => {
		res.redirect('/');
	});
});
app.post('/compose', (req, res) => {
	const PostTitle = req.body.blogTitle;
	const PostBody = req.body.blogBody;

	const newPost = blogs({
		name: PostTitle,
		content: PostBody,
	});
	newPost.save();
	res.redirect('/');
});

app.get('/posts/:postLink', (req, res) => {
	const postName = req.params.postLink;

	blogs.findOne({ name: postName }, (err, doc) => {
		if (err || !doc) {
			console.log(error);
			res.send('<h1>There is no such post</h1>');
		} else {
			res.render('post', { title: doc.name, content: doc.content });
		}
	});
});

app.listen(308, function () {
	console.log('Server started on port localhost:308');
});
