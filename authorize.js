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
        res.redirect('/login?returnUrl='+req.url);
    }
}

module.exports={authorize_admin,authorize_user};