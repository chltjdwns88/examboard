const accountSid = '';
const authToken = ''
const client = require('twilio')(accountSid, authToken);

function getRandomInt(min, max){
    return Math.floor(Math.random * (max - min)) + min;
}

module.exports = function(router, connection, session){
    router.route('/signup').all(function(req, res){
        var userId = req.body.userId || req.query.userId;
        var userPassword = req.body.userPassword || req.query.userPassword;
        var nickName = req.body.nickName || req.query.nickName;
        var phoneNumber = req.body.phoneNumber || req.body.phoneNumber;
        //id, nickname이 있는지 확인한다.
        if(session.userId != userId) {
            res.send({'error_message' : '아이디 중복 확인을 해주세요.'});
            return;
        }
        if(session.nickName != nickName){
            res.send({'error_message' : '닉네임 중복확인을 해주세요'});
            return;
        }
        if(!session.phonechecked){
            res.send({'error_message' : '핸드폰을 인증해주세요'});
            return;
        }
        var sql = 'INSERT INTO USERINFO(?, ?, ?, ?)';
        connection.query(sql, [userId, userPassword, nickName, phoneNumber], function(err, results){
            if(err){
                res.send({'error_message' : 'DB ERROR OCCURED!'});
            }
            res.send({'success_message' : '회원가입이 완료되었습니다.'});
        })
    });

    //ajax로 보내야 한다. => page가 이동하면 안되므로.
    //인증 코드를 받아와서 user가 입력한 것이랑 맞는지 확인이 필요하다. (Front-end 에서 확인할꺼)
    router.route('/signup/checkphone').all(function(req, res){
        var phoneNumber = req.body.phoneNumber || req.query.phoneNumber;
        var sql = 'SELECT COUNT(*) FROM USERINFO WHERE = phoneNumber = ?';
        connection.query(sql, phoneNumber, function(err, results){
            if(err){
                console.log('DB ERROR OCCURED!');
                res.send({'error_message' : 'DB ERROR OCCURED!'});
                return;
            }
            else if(results >= 1){
                res.send({'error_message' : '이미 존재하는 휴대폰 번호입니다.'});
                return;
            }
            else{
                
                //임의로 넣어논 핸드폰 번호
                phoneNumber = '+821044273378';
                var verifyCode = "";
                for(var i = 0 ; i < 4 ; i++) {
                    verifyCode += getRandomInt(0, 9);
                }
                client.messages.create({
                    body : '인증번호 : ' + verifyCode + '을 입력해 주세요',
                    to : phoneNumber,
                    from : '+821044273378'
                })
                .then(message => console.dir(message.dir));
                res.send({'verifyCode' : verifyCode});
                
            }
        });
        
    });
    //phone이 확인이 되었으면 session에 phone이 확인되었다는 코드를 남겨준다.
    //Front-end에서 넘겨주어서 확인한다.
    router.route('/signup/phonechecked').all(function(req, res){
        session.phonechecked = true;
        res.send({'success_message' : '인증 되었습니다.'});
    });

    router.route('/signup/checkuserid').all(function(req, res){
        var userId = req.body.userId || req.query.userId;
        var sql = 'SELECT COUNT(*) FROM USERINFO WHERE userId = ?'
        connection.query(sql, userId, function(err, results){
            if(err){
                res.send({'error_message' : 'DB ERROR OCCURED!'});
            }
            else if(results >= 1){
                res.send({'error_message' : '이미 존재하는 아이디 입니다.'});
            }
            else{
                session.userId = userId;
                res.send({'success_message' : '아이디 사용이 가능합니다.'});
            }
        });
    });

    router.route('/signup/checknickname').all(function(req, res){
        var nickName = req.body.nickName || req.query.nickName;
        var sql = 'SELECT COUNT(*) FROM USERINFO WHERE nickName = ?'
        connection.query(sql, nickName, function(err, results){
            if(err){
                res.send({'error_message' : 'DB ERROR OCCURED!'});
            }
            else if(results >= 1){
                res.send({'error_message' : '이미 존재하는 닉네임 입니다.'});
            }
            else{
                session.nickName = nickName;
                res.send({'success_message' : '닉네임 사용이 가능합니다.'});
            }
        });
    });
}