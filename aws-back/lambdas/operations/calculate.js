const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: 'us-east-1' });
const DynamoDB = new AWS.DynamoDB.DocumentClient({
    accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
    secretAccessKey: "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"
});

//exports.handler = async (event) => {
const handler = async (event) => {
    const { email, resultsInvest, resultsFees, resultsInvestFees, resultsInitial, resultsMonthly, percentageFees, resultsTemp } = JSON.parse(event.body);

    try {
        // Consulta para obter o ID do usuário com base no email
        const userParams = {
            TableName: 'calculadora-juros-compostos-usuario',
            Key: { email }
        };

        const userQueryResult = await DynamoDB.get(userParams).promise();

        if (!userQueryResult.Item) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Usuário não encontrado' })
            };
        }

        const userId = userQueryResult.Item.email;

        // Consulta para obter o último acesso do usuário
        const accessParams = {
            TableName: 'calculadora-juros-compostos-acessos',
            FilterExpression: '#userId = :userId', // Usando um alias para evitar conflito com palavra reservada
            ExpressionAttributeNames: {
                '#userId': 'userId' // Definindo um alias para o nome do campo real
            },
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false,
        };

        const accessQueryResult = await DynamoDB.scan(accessParams).promise();

        console.log(accessQueryResult);

        if (accessQueryResult.Items.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Documento Access não encontrado para o usuário' })
            };
        }

        const accessId = accessQueryResult.Items[0]._id;

        // Cria uma nova operação
        const operationParams = {
            TableName: 'calculadora-juros-compostos-operacoes',
            Item: {
                _id: uuidv4(),
                initial: resultsInitial,
                monthly: resultsMonthly,
                fees: percentageFees,
                temp: resultsTemp,
                totalInvest: resultsInvest,
                totalFees: resultsFees,
                total: resultsInvestFees,
                userId,
                accessId
            }
        };

        await DynamoDB.put(operationParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Operação realizada' })
        };
    } catch (error) {
        console.error('Erro ao realizar a operação:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.', details: error.message })
        };
    }
};

handler({
    body: JSON.stringify({
        email: "teste@gmail.com",
        resultsInitial: "6000",
        resultsMonthly: "600",
        percentageFees: "10",
        resultsTemp: "5",
        resultsInvest: "6600",
        resultsFees: "660",
        resultsInvestFees: "12000"
    })
})
.then(a => { console.log(a); })
.catch(b => { console.log(b); });
