const express = require('express');
const app= express();
const axios = require('axios');
const PORT= 3003
const HOST = "localhost";

app.get('/test',(req,res)=>{
    res.send("Okay working!")
})

app.listen(PORT,()=>{
    axios({
        method:'POST',
        url : 'http://localhost:3002/register',
        headers :{'Content-Type': 'application/json'},
        data: {
            pathName :"Delhi",
            protocol:"http",
            host :HOST,
            port : PORT,
        }
    }).then((res)=>{
        console.log(res.data);
    }).catch(err=>{
        console.log(err.message);
    })
    console.log(' Delhi server started on port 3003');
})