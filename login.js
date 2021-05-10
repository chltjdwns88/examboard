module.exports = function(router, connection, session){
    router.route('/login/page').post(function(req, res){
        console.log('login 시도');
        var userId = req.body.id || req.query.id;
        var userPw = req.body.password || req.query.password;
        var sql = 'SELECT * FROM USERINFO WHERE id = ?';
        connection.query(sql, userId, function(err, results){
            if(err){
                console.log('DB ERROR OCCUR!');
                res.send({'error_message' : 'DB ERROR OCCUR!'});
                return;
            }
            if(results.userPassword == userPw){
                console.log('Login Successed!');
                session.islogined = true;
                session.nickName = results.nickName;
                res.send({'success_message' : results.nickName});
            }
        })
    })
}