const { app } = require('@azure/functions');
const { Client } = require("pg");


app.http('saveemail', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let email = request.query.get('email');
        console.log(`Received email: ${email}`);

    if (!email) {
        return {
            status: 400,
            body: "Email parameter is required."
        };

    }

    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await client.connect();
        const query = "INSERT INTO emails (email) VALUES ($1)";
        await client.query(query, [email]);

        return{
            status: 200,
            body: `Email ${email} signed up successfully.`
        };
    } catch (error) {
        context.log(`Database error: ${error.message}`);
        return {
            status: 500,
            body: error.message
        };
    } finally {
        await client.end();
    }

    }
});