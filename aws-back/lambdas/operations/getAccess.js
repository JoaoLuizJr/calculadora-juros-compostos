const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' });

const DynamoDB = new AWS.DynamoDB.DocumentClient({
    accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
    secretAccessKey: "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"
})

//exports.handler( async (event) => {
const handler = async (event) => {
    const { email } = event.queryStringParameters;

    const paramsQuery = {
        TableName: 'calculadora-juros-compostos-usuario',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    };

    try {
        const userQueryResult = await DynamoDB.query(paramsQuery).promise();

        if (userQueryResult.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Usuário não encontrado' })
            };
        }

        const userEmail = userQueryResult.Items[0].email;

        const paramsAccesses = {
            TableName: 'calculadora-juros-compostos-acessos',
            FilterExpression: 'userId = :userEmail', // Filtrando os acessos pelo e-mail do usuário
            ExpressionAttributeValues: {
                ':userEmail': userEmail
            }
        };

        const accessesQueryResult = await DynamoDB.scan(paramsAccesses).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify(accessesQueryResult.Items)
        };
    } catch (error) {
        console.error('Erro ao obter acessos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.' }),
        };
    }
};

// Este é apenas um exemplo de evento. Você pode ajustar conforme necessário.
handler({
    body: JSON.stringify({
        email: "jjjoaoluizjr@gmail.com"
    })
})
.then(a => { console.log(a); })
.catch(b => { console.log(b); });