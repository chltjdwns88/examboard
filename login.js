module.exports = function(router, connection, session){
    router.route('/login').post(function(req, res){
        console.log('login 시도');
        var userId = req.body.id || req.query.id;
        var userPw = req.body.password || req.query.password;
        var sql = 'SELECT password FROM USERINFO WHERE id = ?';
        connection.query(sql, userId, function(err, results){
            if(err){
                console.log('DB ERROR OCCUR!');
                res.write('DB ERROR OCCUR!');
                res.redirect('/');
                return;
            }
            if(results == userPw){
                console.log('Login Successed!');
                session.islogined = true;
                res.redirect('/');
            }
        })
    })
}