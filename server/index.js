const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

app.listen(PORT, ()=>{
    console.log('Running on PORT:',PORT)
})