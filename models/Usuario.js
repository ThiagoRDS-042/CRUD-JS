const db = require('./db');

const Usuario = db.sequelize.define('usuarios', {
    nome: {
        type: db.Sequelize.STRING(20)
    },
    email: {
        type: db.Sequelize.STRING(100)
    }
});

// Usuario.sync({ force: true });
module.exports = Usuario;