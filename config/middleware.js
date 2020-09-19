module.exports.setFlash = function(req, res, next) {
    res.locals.flash = { //flash uses session cookies
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}