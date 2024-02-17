const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const handler = async (event) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient({
        accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
        secretAccessKey: "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"
    });

    const { email, newCell } = JSON.parse(event.body);

    const paramsUpdate = {
        TableName: 'calculadora-juros-compostos-usuario',
        Key: {
            'email': email
        },
        UpdateExpression: 'SET #c = :newCell', // Renomeando 'cell' para '#c'
        ExpressionAttributeNames: {
            '#c': 'cell' // Renomeando 'cell' para '#c'
        },
        ExpressionAttributeValues: {
            ':newCell': newCell
        },
        ReturnValues: 'ALL_NEW'
    };

    try {
        const updateResult = await DynamoDB.update(paramsUpdate).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Número de celular atualizado com sucesso!' })
        };
    } catch (error) {
        console.error('Erro ao atualizar o número de celular:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.' }),
        };
    }
};

// Este é apenas um exemplo de evento. Você pode ajustar conforme necessário.
handler({
    body: JSON.stringify({
        newCell: "21987307705",
        oldCell: "21987295027"
    })
})
.then(a => { console.log(a); })
.catch(b => { console.log(b); });