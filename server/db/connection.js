const mongoose = require('mongoose')
const uri = 'mongodb+srv://chat_app_admin:qwerty1234@cluster0.grwebtl.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Connected to DB')
}).catch((error)=>{
    console.log('Error: ', error)
})