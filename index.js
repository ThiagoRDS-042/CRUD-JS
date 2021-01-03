const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const Usuario = require('./models/Usuario');
const path = require('path');

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('index');
});

async function interarTable(res) {
    const usurios = await Usuario.findAll({
        order: [
            ['id', 'DESC']
        ]
    });
    let array = [];
    usurios.map((element) => {
        array.push(element.dataValues);
    });
    res.render('tabela', { array: array });
}

app.post('/tabela', function(req, res) {
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email
    }).then(() => {
        interarTable(res);
    }).catch((error) => {
        res.send(`EROOR: ${error}.`);
    });

});

app.get('/tabela', (req, res) => {
    interarTable(res);
});

app.get('/deletar/:id', (req, res) => {
    Usuario.destroy({
            where: {
                'id': req.params.id
            }
        })
        .then((sucess) => {
            if (sucess !== 0) {
                interarTable(res);
            } else {
                res.send('ERROR!');
            }
        })
        .catch((error) => {
            res.send(`ERROR: ${error}`);
        });
});

app.get('/editar/:id', (req, res) => {
    (async function() {
        const post = await Usuario.findAll({
            where: {
                'id': req.params.id
            }
        });
        post.length !== 0 ? res.render('editar', { post: post }) : res.send('Usuário não Existente!');
    }());
});

app.post('/editando/:id', (req, res) => {
    Usuario.update({ nome: req.body.nome, email: req.body.email }, {
            where: {
                id: req.params.id
            }
        })
        .then((sucess) => {
            if (sucess !== 0) {
                interarTable(res)
            } else {
                res.send('Usuário não Existente!');
            }
        })
        .catch((error) => {
            res.send(`ERROR: ${error}`);
        });
});

app.listen(8585, () => {
    console.log('Server On!');
});