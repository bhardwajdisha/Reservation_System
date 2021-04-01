const express = require('express');
const router = express.Router();
const axios = require('axios');
const registry = require('./registry.json') 
const fs = require('fs')

router.all('/:path/:api',(req,res)=>{
    const service = registry.services[req.params.path];
    if(service){
        axios({
            method : req.method,
            url : service.url + req.params.api,
            headers : req.headers,
            data: req.body
        }).then((response)=>{
            res.send(response.data);
        }).catch(err=>{
            res.send(err);
        })
    }else{
        res.send("Not such path exist")
    }
})

router.post('/register',(req,res)=>{
    const registrationInfo = req.body;
    registrationInfo.url = registrationInfo.protocol+"://" + registrationInfo.host +":"+registrationInfo.port+"/";
        registry.services[registrationInfo.pathName] = { ...registrationInfo }
        fs.writeFile('./indiaRoute/registry.json', JSON.stringify(registry), (err)=>{
            if(err){
                res.send('Could not register ' +registrationInfo.pathName + "\n" + err)
            }else{
                res.send(`Successfully registered ${registrationInfo.pathName}`)
            }
        })
    
})
module.exports = router;
