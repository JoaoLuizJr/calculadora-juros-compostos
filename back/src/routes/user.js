const express = require('express');

const router = express.Router();

const User = require('../models/user');

router.get('/', (req, res)=>{ 
});

router.post('/register', async(req, res)=>{
    let { name, cell, email, password } = req.body;  

   try {
    let user = await User.create({ name, cell, email, password });
        res.status(200).json(user);
    } catch (error) {
        res.status(422).json(error)
    }  
});

router.post('/checkEmail', async(req, res) =>{
    let {email} = req.body;

    try {
        let checkEmail = await User.findOne({email});
        if (checkEmail) {
            return res.status(400).json({ error: 'O email já existe no banco de dados.' });
        }else{
            return res.status(200).json({ message: 'Email disponível.' })
        }
    } catch (error) {
        console.error('Erro ao verificar o email:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
})

router.post('/checkCell', async(req, res)=>{
    let {cell} = req.body;

    try {
        let checkCell = await User.findOne({cell});

        if (checkCell) {
            return res.status(400).json({ error: 'O celular já existe no banco de dados.' });
        } else {
            return res.status(200).json({ message: 'Celular disponível.' })
        }
    } catch (error) {
        console.error('Erro ao verificar o celular:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
})

router.post('/login', async(req, res)=>{
    let {email, password} = req.body;

    try {
        let login = await User.findOne({email, password});

        if (login) {
            return res.status(200).json({ message: 'Usuário encontrado!' });
        } else {
            return res.status(400).json({ error: 'Usuário não encontrado! Cadastre-se' })
        }
    } catch (error) {
        console.error('Erro ao verificar o Login:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
})

router.put('/', (req, res)=>{});

router.delete('/', (req, res)=>{});

module.exports = router;