const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

AWS.config.update({ region: 'us-east-1' });
const DynamoDB = new AWS.DynamoDB.DocumentClient({
    accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
    secretAccessKey: "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"
});

//exports.handler = async (event) => {
const handler = async (event) => {
    const { to, subject, body } = JSON.parse(event.body);

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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'E-mail enviado com sucesso!' })
        };
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.' })
        };
    }
};

handler({
    body: JSON.stringify({
        to: "giulliaaiko14@gmail.com",
        subject: "Suas operações com muito amor. Glatinho S2. TE AMOOOO",
        body: JSON.stringify([
            {
                initial: 5000,
                monthly: 500,
                fees: "1% ao mês",
                temp: "3 anos",
                totalInvest: 23000,
                totalFees: 5692.28,
                total: 28692.28
            },
            {
                initial: 5000,
                monthly: 400,
                fees: "1% ao mês",
                temp: "3 anos",
                totalInvest: 19400,
                totalFees: 4984.6,
                total: 24384.6
            }
        ])
    })
}).then(a => {console.log(a);}).catch(b => {console.log(b);});
