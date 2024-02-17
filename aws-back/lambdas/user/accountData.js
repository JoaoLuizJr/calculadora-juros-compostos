const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

//exports.handler( async (event) => {
const handler = async (event) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient({
        accessKeyId: "AKIA6BUH7KBCZZA6QDPY",
        secretAccessKey: "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"
    })

    const { email } = event.queryStringParameters;

    console.log(event.body);

    const params = {
        TableName: 'calculadora-juros-compostos-usuario',
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        },
    }

    try {
        const user = await DynamoDB.scan(params).promise();

        if (user.Count > 0) {
            const dataUser = user.Items[0]; // Assuming we are finding only one user
            return {
                statusCode: 200,
                body: JSON.stringify({
                    name: dataUser.name,
                    email: dataUser.email,
                    cell: dataUser.cell
                })
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ mensagem: 'Usuário não encontrado' })
            };
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
        email: "jjjoaoluizjr@gmail.com"
    })
})
.then(a=>{console.log(a);}).catch(b=>{console.log(b);})