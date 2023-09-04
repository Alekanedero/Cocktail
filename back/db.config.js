/*  import des modules nécessaires */
const { Sequelize } = require('sequelize')

/*  connexion a la base de données */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)

/*  synchronisation des modèles */
/*sequelize.sync() */

module.exports = sequelize
