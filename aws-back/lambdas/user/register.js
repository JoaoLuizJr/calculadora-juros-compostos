const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

//exports.handler( async (event) => {
const handler = async (event) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient({
        accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
        secretAccessKey: "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"
    })

    const { name, cell, email, password } = JSON.parse(event.body);

    console.log(event.body);

    try {
        const user = await DynamoDB.put({
            TableName: 'calculadora-juros-compostos-usuario',
            Item: {
                name: name,
                cell: cell,
                email: email,
                password: password
            }
        }).promise()

        return{
            statusCode: 200,
            body: JSON.stringify({ message: 'Usuário criado com sucesso!' }),
        }
    } catch (error) {
        console.error('Erro ao criar usuário:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.' }),
        };
    }
}

handler({
    body: JSON.stringify({
        name: "Giullia Aiko",
        email: "giulliaaiko14@gmail.com",
        cell: "21981624028",
        password: "1234",
    })
})
.then(a=>{console.log(a);}).catch(e=>{console.log(e);})