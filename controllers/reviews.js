const Guildbase = require('../models/guildbase');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const guildbase = await Guildbase.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    guildbase.reviews.push(review);
    await review.save();
    await guildbase.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/guildbases/${guildbase._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Guildbase.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/guildbases/${id}`);
}