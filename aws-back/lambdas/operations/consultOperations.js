const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const DynamoDB = new AWS.DynamoDB.DocumentClient({
    accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
    secretAccessKey: "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"
})

//exports.handler = async (event) =>{
const handler = async (event) =>{
    const {accessId} = event.queryStringParameters;

    try {
        const params = {
            TableName: 'calculadora-juros-compostos-operacoes',
            FilterExpression: 'accessId = :accessId', // Filtrando os acessos pelo e-mail do usuário
            ExpressionAttributeValues: {
                ':accessId': accessId
            },
        }

        const operations = await DynamoDB.scan(params).promise();
        
        if (operations.Count === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Nenhuma operação encontrada nesse acesso!' })
            };
        }

        return{
            statusCode: 200,
            body: JSON.stringify(operations)
        }      
    } catch (error) {
        console.error('Erro ao consultar as operações:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.', details: error.message })
        };
    }
}

handler({
    body: JSON.stringify({
        accessId: "a943e640-d573-4ab3-b627-10b3e4ee310b"
    })
}).then(a=>{console.log(a);}).catch(b=>{console.log(b)})