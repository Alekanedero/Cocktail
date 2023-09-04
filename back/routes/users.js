const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/user')

/* récupération du router */
let router = express.Router()

/* routage de la ressource User */


// pour l'ensemble des utilisateurs
router.get('', (req, res) => {
    User.findAll()
        .then( user => res.json({ data: user}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})


// récupérer un utilisateur préciser par son id, et cette id préciser dans url
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


// pour créer, ajouter une ressource
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

            // Hashage du mot de passe utilisateur
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash

                    // création de l'utilisateur
                    User.create(req.body)
                        .then(user => res.json({ message: 'User Created', data:user}))
                        .catch(err => res.status(500).json({ message: 'Database Error', error: err}) )
                })
                .catch(err => res.status(500).json({message: 'Hash Process Error', error: err}))


        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}) )
})


// modifier une ressource qui existe avec un id dans l'url
router.patch('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // vérification si le champ id est présent et cohérent
    if(!userId){
        return res.status(400).json({message: 'Missing parameter'})
    }

    //Recherche de l'utilisateur
    User.findOne({ where: {id: userId}, raw: true})
        .then(user => {
            //vérifier si l'utilisateur existe
            if(user === null){
                return res.status(404).json({message: 'This user does not exist !'})
            }

            // Mise à jour de l'utilisateur
            User.update(req.body, { where: {id: userId}})
                .then(user => res.json({ message: 'User Updated'}))
                .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
})


// récupérer le mot de passe de la poubelle
router.post('/untrash/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // vérification si le champ id est présent et cohérent
    if(!userId){
        return res.status(400).json({message: 'Missing parameter'})
    }

    User.restore({ where: {id: userId} })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
})


// mettre a la poubelle
router.delete('/trash/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // vérification si le champ id est présent et cohérent
    if(!userId){
        return res.status(400).json({message: 'Missing parameter'})
    }

    // Suppression de l'utilisateur
    User.destroy({ where: {id: userId}})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
})


// supprimer complétement l'id de ma base de donnée
router.delete('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // vérification si le champ id est présent et cohérent
    if(!userId){
        return res.status(400).json({message: 'Missing parameter'})
    }

    // Supression de l'utilisateur
    User.destroy({ where: {id: userId}, force: true})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err}))
})


module.exports = router
