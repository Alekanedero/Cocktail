/*  import des modules nécessaires */
const express = require('express')
const cors = require('cors')

/*  import de connexion a la db */
let DB = require('./db.config')

/*  initialisation de l'api */
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extented: true}))  /* pour activer l'encodage 'confort */

/*  mise en place du routage */
app.get('/', (req, res) => res.send('je suis online makake'))

app.get('*', (req, res) => res.status(501).send('ressource existe pas'))  /*  route par défault */

/*  start server avec test database */
DB.authenticate()
    .then( () => console.log(`connecter a la base de donnée "${process.env.DB_NAME}"!`))
    .then( () => {
        app.listen(process.env.SERVER_PORT, () =>
            console.log(`server fonctionne sur port ${process.env.SERVER_PORT}.`)
        )
    })
    .catch(err => console.log('Database Error', err))

