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
        console.log('error ', error )
    }
})
//for login
app.post('/api/login', async(req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).send('Please fill all required fields');
        }
        else{
            const user = await Users.findOne({email});
            if(!user){
                res.status(400).send('Email not registered');
            }
            else{
                const validateUser = await bcrypt.compare(password, user.password);
                if(!validateUser){
                    res.status(400).send('Password does not match');
                }
                else{
                    const payload = {
                        userId:user._id,
                        email:user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_SECRET_KEY';
                    jwt.sign(payload, JWT_SECRET_KEY, async(err,token)=>{
                        if(err){
                            console.log('error ', err);
                            res.status(500).send('Error generating token')
                        }
                        else{
                            await Users.updateOne({_id:user._id}, {$set:{token}})
                            user.token = token;
                            await user.save();
                            res.status(200).json({user})
                        }
                    })
                }
            }
        }
    } catch (error) {
        console.log('error ', error )
    }
})



app.listen(PORT, ()=>{
    console.log('Running on PORT:',PORT)
})