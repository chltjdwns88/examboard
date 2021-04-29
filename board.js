const multer = require('multer');
const path = require('path');
const fs = require('fs');
//이미지 업로드를 위한 multer 변수이다.
const upload = multer({
    storage : multer.diskStorage({
        destination : function(req, file, cb){
            cb(null, '/board/tmp/');
        },
        filename : function(req, file, cb){
            cb(null, path.extname(file.originalname));
        }
    })
})

module.exports = function(router, connection, session){
    router.route('/examboard/:exam/:page').all(function(req, res){
        var examId = req.params.exam;
        var page = req.params.page;
        var sql = 'SELECT title FROM exams WHERE examid = ? LIMIT ? OFFSET ?';
        connection.query(sql, [examId, 10, (page - 1) * 10], function(err, results){
            if(err){
                res.send({'error' : 'DB ERROR OCCURED!'});
                return;
            }
            res.send(results);
        });
    });
    //여기서 게시판을 만드는 페이지를 띄운다.
    router.route('/examboard/:exam/create').all(function(req, res){
        if(!session.islogined) {
            res.send({'error_message' : '로그인을 해주시기 바랍니다.'});
            res.end();
        }
        var createPage = fs.readFileSync('임의의파일', 'utf8');
        res.write(createPage);
        res.end();
    });
    //db에 저장하는 역할을 한다.
    router.route('/examboard/:exam/:examid/createcomplete').all(function(req, res){
        if(!session.islogined || !session.nickName) {
            res.send({'error_message' : '로그인을 해주시기 바랍니다.'});
            res.end();
        }
        var exam = req.params.exam;
        var examId = req.params.examid;
        var title = req.body.title || req.query.title;
        var content = req.body.content || req.query.content;
        var nickName = session.nickName;
        //생성시기는 자동 생성, auto increment로 자동 정렬
        var sql = 'INSERT INTO ' + exam + 'BOARD (?, ?, ?)';
        connection.query(sql, [nickName, title, content], function(err, results){
            if(err){
                fs.unlinkSync('/board/' + exam + '/' + examId);
                res.send({'error_message' : 'DB ERROR OCCURED!'});
                return;
            }
            //temp한 이미지를 삭제한다.
            fs.unlinkSync('/board/tmp/');
            //후에 업로드될 이미지를 위해 다시 만든다.
            fs.mkdirSync('/board/tmp/');
            res.send({'success_message' : '게시물을 만들었습니다.'});
        });
    });
    //이미지를 업로드 한다.
    router.post('/examboard/:exam/:examid/uploadimg', upload.array('img'), function(req, res, next){
        var exam = req.params.exam;
        var examId = req.params.examid;
        //해당 borad에 시험에 게시물의 폴더를 만든다.
        if(!fs.existsSync('/borad/' + exam + '/' + examId)) fs.mkdirSync('/board/' + exam + '/' + examId);
        //폴더를 옮겨놓는다.
        sesssion.uploadPaths = [];
        for(let i = 0 ; i < req.files.length ; i++){
            fs.rename('/board/tmp/' + req.files[i].originalname, '/board/' + exam + '/' + examId + '/' + req.files[i].originalname);
            session.uploadPaths.push('/board/' + exam + '/' + examId + '/' + req.files[i].originalname);
        }
    });
}