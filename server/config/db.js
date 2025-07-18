const mongoose = require('mongoose')

const ConnectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB connected successfully')
    } catch (error) {

        console.error("DB failed to connect", error)
    }
}


module.exports = ConnectDB;
