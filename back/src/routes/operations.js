const express = require('express');
const Operations = require('../models/operations');
const User = require('../models/user')
const Access = require('../models/access')

const router = express.Router();

router.post('/calculate', async (req, res) => {
    let { email, resultsInvest, resultsFees, resultsInvestFees } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            // Encontre um documento Access relacionado ao usuário
            let access = await Access.findOne({ user: user._id }).sort({ date: -1 }).limit(1);

            if (access) {
                // Aqui você pode acessar o ID do documento Access
                let accessId = access._id;

                // Agora, você pode usá-lo conforme necessário
                let operation = await Operations.create({
                    totalInvest: resultsInvest,
                    totalFees: resultsFees,
                    total: resultsInvestFees,
                    user: user._id,
                    access: accessId
                });

                return res.status(200).json({ message: 'Operação realizada' });
            } else {
                return res.status(400).json({ error: 'Documento Access não encontrado para o usuário' });
            }
        } else {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao realizar a operação:', error);
        res.status(500).json({ error: 'Erro interno do servidor.', details: error.message });
    }
});

module.exports = router;