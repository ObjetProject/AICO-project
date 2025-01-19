var mysql = require('mysql2');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2'
});

const connection = mysql.createConnection({
    host: process.env.RDS_ENDPOINT,
    user: 'root',
    password: process.env.RDS_PASSWORD,
    database: 'aico_db'
});

connection.connect((err) => {
    if(err){
        console.error('Error connecting to the database: ' + err.stack);
    } else{
        console.log('Connected to the database as id ' + connection.threadId);
    }
});

module.exports = connection;