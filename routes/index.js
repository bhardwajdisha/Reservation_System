const express = require('express');
const router= express.Router();
const axios = require('axios');
const registry = require('./registry.json') 
const fs = require('fs')
const loadbalancer = require('../util/loadbalancer');

router.all('/:apiName/:path/:api',(req,res)=>{
    const service = registry.services[req.params.apiName]
    if(service)
    {
        if(!service.loadbalancerStratergy){
            service.loadbalancerStratergy= "ROUND_ROBIN";
            fs.writeFile('./routes/registry.json', JSON.stringify(registry), (err)=>{
                if(err){
                    res.send('Could not add load balancer Stratergy' , err)
                }
            })
        }
        const newIndex = loadbalancer[service.loadbalancerStratergy](service)
        const url = service.instances[newIndex].url;
        console.log(url);
        axios({
            method : req.method,
            url : url+req.params.path + "/" + req.params.api,
            headers : req.headers,
            data: req.body
        }).then((response)=>{
            res.send(response.data);
        }).catch(err=>{
            res.send(err)
        })
    }else{
        res.send('Undefined API call')
    }
})

router.post('/register',(req,res)=>{
    const registrationInfo = req.body;
    registrationInfo.url = registrationInfo.protocol+"://" + registrationInfo.host +":"+registrationInfo.port+"/";
    if(apiExist(registrationInfo)){
        res.send('Already exist url:'+registrationInfo.url)
    }else{
        registry.services[registrationInfo.apiName].instances.push({ ...registrationInfo })
        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (err)=>{
            if(err){
                res.send('Could not register' +registrationInfo.apiName + "\n" + err)
            }else{
                res.send(`Successfully registered ${registrationInfo.apiName}`)
            }
        })
    }
})
 
router.post('/unregister',(req,res)=>{
    const registrationInfo = req.body;
    if(apiExist(registrationInfo))
    {
        const index= registry.services[registrationInfo.apiName].instances.findIndex((instances)=>{
            return  registrationInfo.url===instances.url;
        })
    
        registry.services[registrationInfo.apiName].instances.splice(index,1);
        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (err)=>{
            if(err){
                res.send('Could not unregister' +registrationInfo.apiName + "\n" + err)
            }else{
                res.send(`Successfully unregistered ${registrationInfo.apiName}`)
            }
        })

    }else{
        res.send('Configuration does not exist:'+registrationInfo.apiName)
    }
})
const apiExist = (registerInfo)=>{
    let exists= false
    registry.services[registerInfo.apiName].instances.forEach(instances=>{
        if(instances.url===registerInfo.url){
            exists=true;
            return
        }
    })
    return exists;
} 
module.exports = router;

//registry.services[req.params.apiName].url+req.params.path