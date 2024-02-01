const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Access = require('../models/access');


router.post('/accountData', async(req, res)=>{
    let { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            // Se o usuário foi encontrado, retorna os dados
            res.status(200).json({
                name: user.name,
                email: user.email,
                cell: user.cell 
            });
        } else {
            // Se o usuário não foi encontrado, retorna um status 404
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor', error });
    }
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
        let user = await User.findOne({email, password});

        if (user) {
            let access = await Access.create({
                date: new Date(),
                user: user._id,  
                operations: []  
            });

            return res.status(200).json({ message: 'Usuário encontrado!' });
        } else {
            return res.status(400).json({ error: 'Usuário não encontrado! Cadastre-se' });
        }
    } catch (error) {
        console.error('Erro ao verificar o Login:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

router.put('/name', async(req, res)=>{

    let { name, oldName } = req.body;

    try {
        let result = await User.updateOne({ name: oldName }, { $set: { name } });
        return res.status(200).json({ message: 'Nome atualizado!' });
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao atualizar o nome!' })
    }
});

router.put('/cell', async(req, res)=>{

    const { cell, oldCell } = req.body;

    try {
        let result = await User.updateOne({ cell: oldCell }, { $set: { cell } });
        return res.status(200).json({ message: 'Celular atualizado!' });
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao atualizar o celular!' })
    }

});

router.delete('/', (req, res)=>{});

module.exports = router;