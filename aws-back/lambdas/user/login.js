// Se você estiver configurando diretamente na função Lambda:
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: 'us-east-1' });


//exports.handler = async (event) => {
const handler = async (event) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient({
        accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
        secretAccessKey: "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"
    });

    // Extrai os dados da requisição
    const { email, password } = JSON.parse(event.body);

    console.log(event.body);

    try {
        // Consulta no DynamoDB usando o método query
        const userQueryResult = await DynamoDB.scan({
            TableName: 'calculadora-juros-compostos-usuario',
            FilterExpression: 'email = :email AND password = :password',
            ExpressionAttributeValues: {
                ':email': email,
                ':password': password
            }
        }).promise();

        // Verifica se o usuário foi encontrado
        if (userQueryResult.Items.length > 0) {
            // Registra o acesso na tabela de acessos
            await DynamoDB.put({
                TableName: 'calculadora-juros-compostos-acessos',
                Item: {
                    _id: uuidv4(),
                    date: new Date().toISOString(), // Data atual
                    userId: userQueryResult.Items[0].email, // Obtém o ID do usuário
                }
            }).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Usuário encontrado!' }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Usuário não encontrado! Cadastre-se' }),
            };
        }
    } catch (error) {
        console.error('Erro ao verificar o Login:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.' }),
        };
    }
};

handler({
    body: JSON.stringify({
        email: "teste@gmail.com",
        password: "1234"
    })
})
.then(d => {console.log(d)}).catch(e=>{console.log(e)})
