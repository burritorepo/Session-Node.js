//-------Página de registro de usuarios-------//
exports.signup = function (req, res) {
    message = '';
    if (req.method == "POST") {
        var post = req.body;
        var nombre = post.nombre;
        var apellido = post.apellido;
        var mobile = post.mobile;
        var usuario = post.usuario;
        var password = post.password;
        var email = post.email;

        var sql = `Insert into usuarios(nombre,apellido,mobile,usuario,password,email) values('${nombre}','${apellido}',${mobile},'${usuario}'',${password}','${email}')`
        console.log(sql);
        db.query(sql, function (err, results) {
            message = 'Su cuenta se ha creado con éxito';
            res.render("signup.ejs", { message: message });
        });
    } else {
        res.render('signup');
    }
};
//-------Página de authentication-------//
exports.login = function (req, res) {
    var message = '';
    var session = req.session;

    if (req.method == "POST") {
        var post = req.body;
        var usuario = post.usuario;
        var password = post.password;
        var sql = `SELECT * from usuarios where usuario='${usuario}' and password='${password}'`;
        console.log(sql);
        db.query(sql, function (err, results) {
            if (results.length) {
                req.session.id = results[0].id;
                req.session.usuario = results[0];
                res.redirect('/home/dashboard');
            } else {
                message = 'Escriba sus credenciales';
                res.render('index.ejs', { message: message });
            }
        });
    } else {
        res.render('index.ejs', { message: message });
    };
};

//-------Página de dashboard-------//
exports.dashboard = function (req, res, next) {
    var usuario = req.session.usuario.id;
    console.log('Acá debe estar el id del usuario autenticado', usuario);
    if (usuario == null) {
        res.redirect('/login');
        return;
    }
    var sql = `SELECT * from usuarios where id=${usuario}`;
    db.query(sql, function (err, results) {
        res.render('dashboard.ejs', { user: usuario });
    });
};

//-------Final de sesión-------//
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
};

//-----Página de profile-------//
exports.profile = function (req, res) {
    var userid = req.session.usuario.id;
    if (userid == null) {
        res.redirect('/login');
        return;
    }
    var sql = `SELECT * from usuarios where id=${userid}`;
    console.log(sql);
    db.query(sql, function (err, results) {
        res.render('profile.ejs', { data: results });
    });
};
