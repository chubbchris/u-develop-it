const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost' ,
        user: 'root' ,
        password: 'chubb1',
        database: 'election'
    },
    console.log('connected to election database.')
);
db.query(`SELECT * FROM candidates`, (err,rows)=>{
    console.log(rows);
});
app.use((req,res)=>{
    res.status(404).end();
});

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
});