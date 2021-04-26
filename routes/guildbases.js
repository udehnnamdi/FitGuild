const express = require('express');
const router = express.Router();
const guildbases = require('../controllers/guildbases');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateGuildbase } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });




const Guildbase = require('../models/guildbase');

router.route('/')
    .get(catchAsync(guildbases.index))
    .post(isLoggedIn, upload.array('image'), validateGuildbase, catchAsync(guildbases.createGuildbase))

router.get('/new', isLoggedIn, guildbases.renderNewForm)

router.route('/:id')
    .get(catchAsync(guildbases.showGuildbase))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateGuildbase, catchAsync(guildbases.updateGuildbase))
    .delete(isLoggedIn, isAuthor, catchAsync(guildbases.deleteGuildbase));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(guildbases.renderEditForm))


module.exports = router;
