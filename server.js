const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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
app.get('/api/candidates',(req,res)=>{
    const sql=`SELECT * FROM candidates`;
 db.query(sql,(err,rows)=>{
     if(err){
         res.status(500).json({error: err.message});
         return;
     }
     res.json({
         message: 'success',
         data: rows
     });
 });
});

db.query(`SELECT * FROM candidates WHERE id = 1`, (err,row)=>{
    if (err){
       console.log(err);
    }
    console.log(row);
});
app.delete('/api/candidates/:id',(req,res)=>{
const sql = `DELETE FROM candidates WHERE id = ?`;
const params = [req.params.id];
db.query(sql,params,(err,result)=>{
    if (err){
        res.statusMessage(400).json({error: res.message});
    } else if (!result.affectedRows){
        res.json({
            Message: 'canidate not found'
        });
    } else {
        res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
        });
    }
});
});
app.post('/api/candidates',({body},res)=>{
    const errors = inputCheck(body, 'first_name','last_name','industry_connected');
    if (errors){
        res.status(400).json({errors:errors});
        return;
    }
    const sql =`INSERT INTO candidates (first_name,last_name,industry_connected)
    values (?,?,?)`;
    const params = [body.first_name,body.last_name,body.industry_connected];

    db.query(sql,params,(err,result)=>{
        if(err){
            res.status(400).json({error:err.message})
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});
app.use((req,res)=>{
    res.status(404).end();
});

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
});