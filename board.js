module.exports = function(router, connection, session){
    router.route('/examboard/:exam/:page').all(function(req, res){
        var examId = req.params.exam;
        var page = req.params.page;
        var sql = 'SELECT title From exams WHERE examid = ? LIMIT ? OFFSET ?';
        connection.query(sql, [examId, 10, (page - 1) * 10], function(err, results){
            if(err){
                res.write('DB ERROR OCCURED!');
                return;
            }
            res.send(results);
        });
    })
}