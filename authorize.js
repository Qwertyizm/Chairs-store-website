/**
*
* @param {http.IncomingMessage} req
* @param {http.ServerResponse} res
* @param {*} next
*/

async function authorize_user(req, res, next) {
    if ( req.signedCookies.role=='user') {
        req.user = req.signedCookies.user;
        next();
    } else {
        res.redirect('/login?returnUrl='+req.url);
    }
}

async function authorize_admin(req, res, next) {
    if ( req.signedCookies.role == 'admin')  {
        req.user = req.signedCookies.user;
        next();
    } else {
        res.render('login', { user_cookie: req.signedCookies.user, role: req.signedCookies.role, message: 'You do not have permission to access this page.' });
    }
}

module.exports={authorize_admin,authorize_user};