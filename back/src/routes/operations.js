const express = require('express');
const nodemailer = require('nodemailer');

const Operations = require('../models/operations');
const User = require('../models/user')
const Access = require('../models/access');

const router = express.Router();

router.post('/getAccesses', async(req,res)=>{
    let{email} = req.body

    try {
        let user = await User.findOne({ email });
        let accesses  = await Access.find({user: user}).sort({data: -1})

        res.json(accesses);
    } catch (error) {
        console.error('Erro ao obter acessos:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
})

router.post('/calculate', async (req, res) => {
    let { email, resultsInvest, resultsFees, resultsInvestFees, resultsInitial, resultsMonthly, percentageFees, resultsTemp,} = req.body;

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
                    initial: resultsInitial,
                    monthly: resultsMonthly,
                    fees: percentageFees,
                    temp: resultsTemp,
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

router.post('/consultOperations', async(req, res)=>{
    let {accessId} = req.body;

    try {
        let operation = await Operations.find({access: accessId}).sort({data: -1});

        if (operation) {
            res.json(operation);
        } else {
            res.status(404).json({ mensagem: 'Não existe operações' });
        }
    } catch (error) {
        console.error('Erro ao realizar a operação:', error);
        res.status(500).json({ error: 'Erro interno do servidor.', details: error.message });
    }
})

router.post('/send-email', async (req, res) => {
    const { to, subject, body } = req.body;

    try {
        // Obter operações do corpo do e-mail (json)
        const operations = JSON.parse(body);

        // Construir corpo do e-mail formatado
        let emailBody = `
            <html>
                <head>
                    <style>
                        /* Adicione estilos CSS aqui para estilizar o e-mail */
                        h2 {
                            color: black;
                        }
                        body {
                            font-family: 'Arial', sans-serif;
                            color: black;
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            padding: 4px 7px;
                            text-align: left;
                        }
                        th {
                            border: 1px solid black;
                            background-color: green;
                            color: white;
                        }
                        td {
                            border: 1px solid green;
                            color: black
                        }
                        p {
                            color: green;
                        }
                    </style>
                </head>
                <body>
                    <h2>Lista de Operações</h2>
                    <table>
                        <tr>
                            <th>Valor Inicial</th>
                            <th>Valor Mensal</th>
                            <th>Aplicação de Juros</th>
                            <th>Duração</th>
                            <th>Total Investido</th>
                            <th>Total de Ganhos em Juros</th>
                            <th>Total</th>
                        </tr>`;

        operations.forEach(operation => {
            emailBody += `
                        <tr>
                            <td>${operation.initial}</td>
                            <td>${operation.monthly}</td>
                            <td>${operation.fees}</td>
                            <td>${operation.temp}</td>
                            <td>${operation.totalInvest}</td>
                            <td>${operation.totalFees}</td>
                            <td><p>${operation.total}</p></td>
                        </tr>`;
        });

        emailBody += `
                    </table>
                </body>
            </html>`;

        // Configurar o transporte do Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'calculadoradejuroscompostos@gmail.com',
                pass: 'vekd mwgi cecz qjcq'
            }
        });
        
        // Definir opções de envio
        const mailOptions = {
            from: 'calculadoradejuroscompostos@gmail.com',
            to: to,
            subject: subject,
            html: emailBody,
            attachments: [
                {
                    filename: 'calculadora_juros.csv',  // Nome do arquivo no e-mail
                    content: 'Valor Inicial,Valor Mensal,Aplicação de Juros,Duração,Total Investido,Total de Ganhos em Juros,Total\n5000,500,1% ao mês,3 anos,23000,5692.28,28692.28\n5000,400,1% ao mês,3 anos,19400,4984.6,24384.6\n',
                    encoding: 'utf-8',  // Codificação do conteúdo
                    contentType: 'text/csv'  // Tipo de conteúdo do anexo
                }
            ]
        };

        // Enviar e-mail
        console.log('Enviando E-mail...');
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado!');

        res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;