const express = require('express');
const app= express();
const axios = require('axios');
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const localStratergy = require('passport-local')
const User = require('./models/users');
const Flights = require('./models/flight')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const flash = require('connect-flash')

const PORT= 3003
const HOST = "localhost";

const transporter = nodemailer.createTransport(sendgrid({
    auth:{
        api_key:"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"
    }
}))
mongoose.connect('mongodb+srv://flights:9582533456@cluster0.n33by.mongodb.net/Reservations',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Done");
});

mongoose.set('useFindAndModify', false);
app.use(express.json())
app.use(express.urlencoded({extended:true}));

const sessionConfig ={
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/test',(req,res)=>{
    res.send("Okay working!")
})

app.get('/flight',async (req,res)=>{
    const { source, destination} = req.query;
    const flight = await Flights.find({source: source , destination: destination});
    res.send(flight);
})
app.get('/flights/:id',async(req,res)=>{
    const flight = await Flights.findById(req.params.id);
    try{
        res.send(flight);
    }catch(e){
        res.status(404).json('Not found');
    }
}) 

app.post('/login',passport.authenticate('local',({failureFlash:true,failureRedirect:'/login'})),async(req,res)=>{
    try{
    res.json(req.session);
    }catch(e){
        res.json("Invalid username or password")
    }
})

app.get('/logout',(req,res)=>{
    req.logout();
    res.json(req.session);
})
app.post('/register',async(req,res)=>{
    try{
        const {email , username , password}=req.body;
        const user = new User({email,username});
        const newUser = await User.register(user,password);
        req.login(newUser, err=>{
            if(err)
                return next(err);
         res.json(newUser);
         })
    }catch(e){
        console.log(e.message);
    }   
})

app.post('/reset-password',async(req,res)=>{
    crypto.randomBytes(32,async(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString('hex')
        await User.findOne({email:req.body.email}).then(user=>{
            if(!user){ 
                return res.status(422).json({error:"User doesn't exist.Verify the given email address"});
            }
            user.resetToken = token;
            console.log(token);
            user.expireToken = Date.now() + 3600000
            user.save().then(result=>{
                transporter.sendMail({
                    to: user.email,
                    from: 'oholivia876@gmail.com', 
                    subject: 'Reset password',
                    html: `
                            <h2>Password Reset</h2>
                            <p><strong>Click this <a href="https://www.google.com">link</a> to reset your password </strong></p>
                         `,
                }).then(() => {
                    console.log('Email sent')
                  })
                  .catch((error) => {
                    console.error(error)
                  })
            })
            res.json({message:"Check your email"})
        })

    })
})

app.post('/new-password',(req,res)=>{
    const newPassword = req.body.password;
    const sentToken = req.body.resetToken;
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({message:"Try again,Session expired"})
        }
        user.resetToken =undefined;
        user.expireToken= undefined;
        user.setPassword(newPassword, ()=>{
                user.save();
                res.status(200).json({message: 'password reset successful'});
        });
    }).catch(err=>{
        res.json(err)
    })
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

//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

