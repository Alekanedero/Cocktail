const express = require('express')
const User = require('../models/user')

/* récupération du router */
let router = express.Router()

/* routage de la ressource User */

//pour tout récupérer
router.get('', (req, res) => {
    User.findAll()
        .then( user => res.json({ data: user}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})

//récupérer un utilisateur par son id
router.get('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    //vérification si le champ id est présent et cohérent
    if(!userId){
        return res.json(400).json({ message: 'Missing parameter'})
    }

    //récupération de l'utilisateur
    User.findOne({ where: {id: userId}, raw: true})
        .then(user => {
            if ((user === null)){
                return res.status(404).json({ message: 'This user does not exist !'})
            }

            // Utilisateur trouvé
            return res.json({data: user})
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}) )
})

//pour ajouter une ressource
router.put('', (req, res) => {
    const {nom, prenom, pseudo, email, password } = req.body

    //validation des données recues
    if(!nom || !prenom || !pseudo || !email || !password){
        return res.status(400).json({ message: 'Missing Data'})
    }

    //chercher si quelqu'un exist deja, voir si cet email existe déja ?
    User.findOne({ where: { email: email}, raw: true})
        .then(user => {
            //vérification si l'utilisateur existe déja
            if( user !== null){
                return res.status(409).json({ message: `The user ${nom} already exists !`})
            }

            User.create(req.body)
                .then(user => res.json({ message: 'User Created', data:user}))
                .catch(err => res.status(500).json({ message: 'Database Error', error: err}) )
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}) )
})

//modifier une ressource
router.patch('/;id')

//supprimer une ressource
router.delete('/:id')


