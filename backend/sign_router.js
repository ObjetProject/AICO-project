router.post('/', async function (req, res, next) {
    var id = req.body.id;
    var pw = req.body.pw;

    const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');
    var query = "SELECT user_id FROM user where user_id='" + id + "';";
    connection.query(query, function (err, rows) {
        if (rows.length == 0) {
            var sql = {
                user_id: id,
                password: hashPassword,
                salt: salt
            };
            var query = connection.query('insert into member set ?', sql, function (err, rows) {
                if (err) throw err;
                else {
                    res.send("성공");
                }
            });
        } else {
            res.send("중복ID");
        }
    });
})

router.post('/', function (req, res, next) {
    var id = req.body.id;
    var pw = req.body.pw;

    var query = "select salt, password from user where user_id='" + id + "';";
    console.log(query);
    connection.query(query, function (err, rows) {
        if(err) throw err;
        else {
            if (rows.length == 0) {
                console.log("아이디 틀림");
                res.redirect("/login");
            }
            else {
                var salt = rows[0].salt;
                var password = rows[0].password;
                const hashPassword = crypto.createHash('sha512').update(pw + salt).digest('hex');
                if(password === hashPassword) {
                    console.log("로그인 성공")
                    res.cookie("user", id, {
                        expires: new Date(Date.now() + 900000),
                        httpOnly: true
                    });
                    res.redirect("/");
                }
                else {
                    console.log("로그인 실패 비밀번호 틀림");
                    res.redirect("/login");
                }
            }
        }
    })
})