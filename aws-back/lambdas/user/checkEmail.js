const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' });

const DynamoDB = new AWS.DynamoDB.DocumentClient({
    accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
    secretAccessKey: "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"
})


//exports.handler( async (event) => {
const handler = async (event) => {
    const {email} = event.queryStringParameters;

    const params = {
        TableName: 'calculadora-juros-compostos-usuario',
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        },
    }

    try {
        const user = await DynamoDB.scan(params).promise()

        console.log(user.Count === 0);

        if (user.Count === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'E-mail válido' }),
            }
        } else {
            return{
                statusCode: 400,
                body: JSON.stringify({ error: 'E-mail já existe' }),
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
        email: "joaosantosbento@gmail.com"
    })
})
.then(a=>{console.log(a);}).catch(b=>{console.log(b);})