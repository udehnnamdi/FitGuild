const Guildbase = require('../models/guildbase');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const guildbases = await Guildbase.find({});
    res.render('guildbases/index', { guildbases })
}

module.exports.renderNewForm = (req, res) => {
    res.render('guildbases/new');
}

module.exports.createGuildbase = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.guildbase.location,
        limit: 1
    }).send()
    const guildbase = new Guildbase(req.body.guildbase);
    guildbase.geometry = geoData.body.features[0].geometry;
    guildbase.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    guildbase.author = req.user._id;
    await guildbase.save();
    console.log(guildbase);
    req.flash('success', 'Successfully made a new guildbase!');
    res.redirect(`/guildbases/${guildbase._id}`)
}

module.exports.showGuildbase = async (req, res,) => {
    const guildbase = await Guildbase.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!guildbase) {
        req.flash('error', 'Cannot find that guildbase!');
        return res.redirect('/guildbases');
    }
    res.render('guildbases/show', { guildbase });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const guildbase = await Guildbase.findById(id)
    if (!guildbase) {
        req.flash('error', 'Cannot find that guildbase!');
        return res.redirect('/guildbases');
    }
    res.render('guildbases/edit', { guildbase });
}

module.exports.updateGuildbase = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const guildbase = await Guildbase.findByIdAndUpdate(id, { ...req.body.guildbase });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    guildbase.images.push(...imgs);
    await guildbase.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await guildbase.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated guildbase!');
    res.redirect(`/guildbases/${guildbase._id}`)
}

module.exports.deleteGuildbase = async (req, res) => {
    const { id } = req.params;
    await Guildbase.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted guildbase')
    res.redirect('/guildbases');
}
