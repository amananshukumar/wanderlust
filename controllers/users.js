const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/signup'); 
}

module.exports.signUp =async (req, res) => {
    try {
        let { username, email, password } = req.body; 
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to wanderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login =  async (req, res) => {
    req.flash('success', 'Welcome back to wanderlust!');
    let redirectUrl = req.session.redirectUrl || '/listings';
    res.redirect(redirectUrl);
   }

   module.exports.logout =  (req, res,next) => {
    req.logout((err) => {   
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye! Come back soon!');
        res.redirect('/listings');
    });

}

   