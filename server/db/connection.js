const mongoose = require('mongoose')
const uri = 'mongodb+srv://Pranay:sohanlal@cluster1.o9c1ofg.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Connected to DB')
}).catch((error)=>{
    console.log('Error: ', error)
})