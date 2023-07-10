const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());

require('./db/connection')


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

//for signup
app.post('/api/register', async(req,res)=>{
    try {
        const {fullName, email, password} = req.body;
        if(!fullName || !email || !password){
            res.status(400).send('Please fill all required details');
        }
        else{
            const alreadyExists = await Users.findOne({email});
            if(alreadyExists){
                res.status(400).send('Email already registered, please login')
            }
            else{
                const newUser = new Users({email, fullName});
                bcrypt.hash(password, 10, (err, hashedPassword)=>{
                    newUser.set('password', bcrypt.hashedPassword);
                    newUser.save();
                    next();
                })
                return res.status(200).send('User regisetered successfully')
            }
        }
    } catch (error) {
        
    }
})



app.listen(PORT, ()=>{
    console.log('Running on PORT:',PORT)
})