const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy;
module.exports = function(router, session){
    passport.use('kakao', new KakaoStrategy({
        clientID: '503edc03c8ce9f0374aa1f2ecb6b60f6',
        callbackURL: '/login/success',
    }, (accessToken, refreshToken, profile, done) => {
        session.kakaoid = profile.id;
        session.kakaoAccess = accessToken;
        session.kakaoRefresh = refreshToken;
    }));
    router.get('/login/kakao', passport.authenticate('kakao'));
    //redirect 주소에 따라, 다른 곳으로 redirect하게 된다.
    router.get('/login/success', passport.authenticate('kakao', {
        failureRedirect : '/login/kakao',
        successRedirect : '/'
    }), (res, req) => {
        res.redirect('/');
    });
}