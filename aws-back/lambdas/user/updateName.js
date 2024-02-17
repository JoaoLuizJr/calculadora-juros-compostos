const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const handler = async (event) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient({
        accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
        secretAccessKey: "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"
    });

    const { email, newName } = JSON.parse(event.body);

    const paramsUpdate = {
        TableName: 'calculadora-juros-compostos-usuario',
        Key: {
            'email': email
        },
        UpdateExpression: 'SET #n = :newName',
        ExpressionAttributeNames: {
            '#n': 'name'
        },
        ExpressionAttributeValues: {
            ':newName': newName
        },
        ReturnValues: 'ALL_NEW'
    };

    try {
        await DynamoDB.update(paramsUpdate).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Nome atualizado!' })
        };
    } catch (error) {
        console.error('Erro ao atualizar o nome:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.' }),
        };
    }
};

// Este é apenas um exemplo de evento. Você pode ajustar conforme necessário.
handler({
    body: JSON.stringify({
        newName: "João Luiz",
        email: "jjjoaoluizjr@gmail.com"
    })
})
.then(a => { console.log(a); })
.catch(b => { console.log(b); });
