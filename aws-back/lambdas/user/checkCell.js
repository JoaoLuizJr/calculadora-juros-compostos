const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' });

const DynamoDB = new AWS.DynamoDB.DocumentClient({
    accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
    secretAccessKey: "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"
})


//exports.handler( async (event) => {
const handler = async (event) => {
    const {cell} = event.queryStringParameters;

    const params = {
        TableName: 'calculadora-juros-compostos-usuario',
        FilterExpression: 'cell = :cell',
        ExpressionAttributeValues: {
            ':cell': cell
        },
    }

    try {
        const user = await DynamoDB.scan(params).promise()

        console.log(user.Count === 0);

        if (user.Count === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Celular válido' }),
            }
        } else {
            return{
                statusCode: 400,
                body: JSON.stringify({ error: 'Celular já está cadastrado' }),
            }
        }
    } catch (error) {
        console.error('Erro ao encontrar os dados:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.' }),
        };
    }
}

handler({
    body: JSON.stringify({
        cell: "21987307705"
    })
})
.then(a=>{console.log(a);}).catch(b=>{console.log(b);})