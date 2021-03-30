const express = require('express');
const app= express();
const routes = require('./routes')
const helmet = require('helmet');

app.use(helmet());
app.use(express.json());

app.use('/',routes)

app.listen(3000,(req,res)=>{
    console.log(' Gateway server started on port 3000');
})