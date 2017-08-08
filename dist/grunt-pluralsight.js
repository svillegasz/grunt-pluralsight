var keystone = require('keystone');
var Types = keystone.Field.Types;

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: "Just leaving a message" },
		{ value: 'question', label: "I've got a question" },
		{ value: 'other', label: "Something else..." },
	], required: true },
	message: { type: Types.Textarea, required: true },
});

Enquiry.track = true;
Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
;var keystone = require('keystone');
var Types = keystone.Field.Types;

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true },
	plural: 'Albums',
	singular: 'Album',
});

Gallery.add({
	name: { type: String, required: true },
	publishedDate: { type: Types.Date, default: Date.now },
	images: { type: Types.CloudinaryImages },
});

Gallery.track = true;
Gallery.defaultSort = 'name';
Gallery.defaultColumns = 'name, publishedDate';
Gallery.register();
;var keystone = require('keystone');
var Types = keystone.Field.Types;

var Post = new keystone.List('Post', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Post.add({
	name: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Post.relationship({ path: 'comments', ref: 'PostComment', refPath: 'post' });

Post.track = true;
Post.defaultColumns = 'name, state|20%, author|20%, publishedDate|20%';
Post.register();
;var keystone = require('keystone');
var Types = keystone.Field.Types;

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Categories',
});

PostCategory.add({
	name: { type: String, required: true },
});

PostCategory.relationship({ ref: 'Post', refPath: 'categories' });

PostCategory.track = true;
PostCategory.register();
;var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
	Posts
	=====
 */

var PostComment = new keystone.List('PostComment', {
	label: 'Comments',
});

PostComment.add({
	author: { type: Types.Relationship, initial: true, ref: 'User', index: true },
	post: { type: Types.Relationship, initial: true, ref: 'Post', index: true },
	commentState: { type: Types.Select, options: ['published', 'draft', 'archived'], default: 'published', index: true },
	publishedOn: { type: Types.Date, default: Date.now, noedit: true, index: true },
});

PostComment.add('Content', {
	content: { type: Types.Html, wysiwyg: true, height: 300 },
});

PostComment.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	if (!this.isModified('publishedOn') && this.isModified('commentState') && this.commentState === 'published') {
		this.publishedOn = new Date();
	}
	next();
});

PostComment.schema.post('save', function () {
	if (!this.wasNew) return;
	if (this.author) {
		keystone.list('User').model.findById(this.author).exec(function (err, user) {
			if (user) {
				user.wasActive().save();
			}
		});
	}
});

PostComment.track = true;
PostComment.defaultColumns = 'author, post, publishedOn, commentState';
PostComment.register();
;var keystone = require('keystone');
var Types = keystone.Field.Types;

var Thing = new keystone.List('Thing', {
	label: 'All Fields',
	singular: 'Thing',
	plural: 'Things',
	autokey: { from: 'name', path: 'autokey', unique: true },
});

Thing.add(
	'Simple Fields', {
	name: { type: String },
	requiredString: { type: String, required: true, initial: true, note: 'This field is required.' },
	defaultString: { type: String, default: 'Default Value' },
	shortString: { type: String, width: 'small' },
	mediumString: { type: String, width: 'medium' },
	longString: { type: String, width: 'large' },
	textarea: { type: Types.Textarea, initial: true },
	key: { type: Types.Key },
	email: { type: Types.Email },
	url: { type: Types.Url },
	number: { type: Types.Number },
	money: { type: Types.Money },
	checkbox: { type: Boolean, initial: true },
	date: { type: Types.Date },
	dateTime: { type: Date },
	html: { type: Types.Html },
}, 'Complex Fields', {
	select: { type: Types.Select, options: 'first, second, third', initial: true },
	indentedCheckbox: { type: Boolean, initial: true, indent: true, note: 'This checkbox is indented' },
	customSelect: { type: Types.Select, options: [
		{ label: 'Option 1', value: 'one' },
		{ label: 'Option 2', value: 'two' },
		{ label: 'Option 3', value: 'three' },
	] },
	numericSelect: { type: Types.Select, numeric: true, options: [
		{ label: 'Number 1', value: 1 },
		{ label: 'Number 2', value: 2 },
		{ label: 'Number 3', value: 3 },
	] },
	splitName: { type: Types.Name, initial: true },
	password: { type: Types.Password, initial: true },
	cloudinaryImage: { type: Types.CloudinaryImage },
	cloudinaryImages: { type: Types.CloudinaryImages },
	location: { type: Types.Location },
	wysiwygHtml: { type: Types.Html, wysiwyg: true },
	shortWysiwygField: { type: Types.Html, wysiwyg: true, height: 100 },
	//embedSrc: { type: String },
	//embedData: { type: Types.Embedly, from: 'embedSrc' },
}, 'Dependent Fields', {
	otherSelect: { type: Types.Select, options: [
		{ label: 'Pre-defined Value', value: 'predefined' },
		{ label: 'Other Value', value: 'other' },
	]},
	otherValue: { type: String, dependsOn: { otherSelect: 'other' } }
}, 'Relationships', {
	user: { type: Types.Relationship, ref: 'User', initial: true },
	users: { type: Types.Relationship, ref: 'User', many: true },
	nested: {
		posts: { type: Types.Relationship, ref: 'Post' },
	},
}, 'Uneditable Fields', {
	uneditableString: { type: String, noedit: true, default: "Not editable" },
	uneditableCheckbox: { type: Boolean, noedit: true, default: true },
	uneditableDate: { type: Types.Date, noedit: true, default: Date.now },
	uneditableSelect: { type: Types.Select, noedit: true, options: 'Sydney, New York, London, Paris, Hong Kong', default: 'Sydney' },
	uneditableLocation: { type: Types.Location, noedit: true, defaults: { street1: '283-285 Kent St', suburb: 'Sydney', state: 'NSW', postcode: '2000', country: 'Australia' } },
});

Thing.schema.virtual('otherSelectValue').get(function () {
	return (this.otherSelect === 'other') ? this.otherValue : this.otherSelect;
});

Thing.track = true;
Thing.register();
;var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {
	// nodelete prevents people deleting the demo admin user
	nodelete: true,
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true, unique: true },
	phone: { type: String, width: 'short' },
	photo: { type: Types.CloudinaryImage, collapse: true },
	password: { type: Types.Password, initial: true, required: false },
}, 'Permissions', {
	isProtected: { type: Boolean, noedit: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return true;
});

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

User.schema.methods.wasActive = function () {
	this.lastActiveOn = new Date();
	return this;
}

/**
 * DEMO USER PROTECTION
 * The following code prevents anyone updating the default admin user
 * and breaking access to the demo
 */

function protect (path) {
	User.schema.path(path).set(function (value) {
		return (this.isProtected && this.get(path)) ? this.get(path) : value;
	});
}

['name.first', 'name.last', 'email', 'isProtected'].forEach(protect);

User.schema.path('password').set(function (newValue) {
	// the setter for the password field is more complicated because it has to
	// emulate the setter on the password type, and ensure hashing before save
	// also, we can't currently escape the hash->set loop, so the hash is harcoded
	// for the demo user for now.
	if (this.isProtected) return '$2a$10$fMeQ6uNsJhJZnY/6soWfc.Mq8T3MwANJK52LQCK2jzw/NjE.JBHV2';
	this.__password_needs_hashing = true;
	return newValue;
});

/**
 * END DEMO USER PROTECTION
 */

User.track = true;
User.defaultColumns = 'name, email, phone, photo';
User.register();
;var keystone = require('keystone');
var csv = require('csv');
var User = keystone.list("User");

exports = module.exports = function (req, res) {
	User.model.find(function (err, results) {
		if (err) { throw err; }

		var users = results.map(function (user) {
			return {
				firstName: user.name.first,
				lastName: user.name.last,
				email: user.email
			};
		});

		csv.stringify(users, function (err2, data) {
			if (err2) { throw err; }

			res.set({"Content-Disposition": "attachment; filename=\"users.csv\""});
			res.send(data);
		});
	});
};
;var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

keystone.pre('routes', function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Contact', key: 'contact', href: '/contact' },
	];
	res.locals.user = req.user;
	next();
});

keystone.pre('render', middleware.theme);
keystone.pre('render', middleware.flashMessages);

keystone.set('404', function (req, res, next) {
    middleware.theme(req, res, next);
	res.status(404).render('errors/404');
});

// Load Routes
var routes = {
	download: importRoutes('./download'),
	views: importRoutes('./views'),
};

exports = module.exports = function (app) {

	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);

	// Downloads
	app.get('/download/users', routes.download.users);

}
;var _ = require('lodash');

exports.theme = function (req, res, next) {
	if (req.query.theme) {
		req.session.theme = req.query.theme;
	}
	res.locals.themes = [
		'Bootstrap',
		'Cerulean',
		'Cosmo',
		'Cyborg',
		'Darkly',
		'Flatly',
		'Journal',
		'Lumen',
		'Paper',
		'Readable',
		'Sandstone',
		'Simplex',
		'Slate',
		'Spacelab',
		'Superhero',
		'United',
		'Yeti',
	];
	res.locals.currentTheme = req.session.theme || 'Bootstrap';
	next();
};

exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length }) ? flashMessages : false;
	next();
};
;var keystone = require('keystone');
var async = require('async');
var Post = keystone.list('Post');
var PostCategory = keystone.list('PostCategory');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category,
	};
	locals.posts = [];
	locals.categories = [];

	// Load all categories
	view.on('init', function (next) {

		PostCategory.model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.categories = results;

			// Load the counts for each category
			async.each(locals.categories, function (category, next) {

				keystone.list('Post').model.count().where('state', 'published').where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});

		});

	});

	// Load the current category filter
	view.on('init', function (next) {
		if (req.params.category) {
			PostCategory.model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function (next) {

		var q = Post.paginate({
				page: req.query.page || 1,
 				perPage: 10,
 				maxPages: 10,
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.category) {
			q.where('categories').in([locals.category]);
		}

		q.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});

	});

	// Render the view
	view.render('blog');

}
;var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	view.on('post', { action: 'contact' }, function (next) {

		var application = new Enquiry.model();
		var updater = application.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});

	});

	view.render('contact', {
		section: 'contact',
	});

}
;var keystone = require('keystone');
var Gallery = keystone.list('Gallery');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'gallery';

	view.query('galleries', Gallery.model.find().sort('sortOrder'));

	view.render('gallery');

}
;var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);

	view.render('index', {
		section: 'home',
	});

}
;var keystone = require('keystone');
var Post = keystone.list('Post');
var PostComment = keystone.list('PostComment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
	};

	// Load the current post
	view.on('init', function (next) {

		var q = Post.model.findOne({
			state: 'published',
			key: locals.filters.post,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.post = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function (next) {

		var q = Post.model.find().where('state', 'published').sort('-publishedDate').populate('author').limit(4);

		q.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});

	});


	// Load comments on the Post
	view.on('init', function (next) {
		PostComment.model.find()
			.where('post', locals.post)
			.where('commentState', 'published')
			.where('author').ne(null)
			.populate('author', 'name photo')
			.sort('-publishedOn')
			.exec(function (err, comments) {
				if (err) return res.err(err);
				if (!comments) return res.notfound('Post comments not found');
				locals.comments = comments;
				next();
			});
	});

	// Create a Comment
	view.on('post', { action: 'comment.create' }, function (next) {

		var newComment = new PostComment.model({
			state: 'published',
			post: locals.post.id,
			author: locals.user.id,
		});

		var updater = newComment.getUpdateHandler(req);

		updater.process(req.body, {
			fields: 'content',
			flashErrors: true,
			logErrors: true,
		}, function (err) {
			if (err) {
				validationErrors = err.errors;
			} else {
				req.flash('success', 'Your comment was added.');
				return res.redirect('/blog/post/' + locals.post.key + '#comment-id-' + newComment.id);
			}
			next();
		});

	});

	// Delete a Comment
	view.on('get', { remove: 'comment' }, function (next) {

		if (!req.user) {
			req.flash('error', 'You must be signed in to delete a comment.');
			return next();
		}

		PostComment.model.findOne({
				_id: req.query.comment,
				post: locals.post.id,
			})
			.exec(function (err, comment) {
				if (err) {
					if (err.name === 'CastError') {
						req.flash('error', 'The comment ' + req.query.comment + ' could not be found.');
						return next();
					}
					return res.err(err);
				}
				if (!comment) {
					req.flash('error', 'The comment ' + req.query.comment + ' could not be found.');
					return next();
				}
				if (comment.author != req.user.id) {
					req.flash('error', 'Sorry, you must be the author of a comment to delete it.');
					return next();
				}
				comment.commentState = 'archived';
				comment.save(function (err) {
					if (err) return res.err(err);
					req.flash('success', 'Your comment has been deleted.');
					return res.redirect('/blog/post/' + locals.post.key);
				});
			});
	});

	// Render the view
	view.render('post');

}
