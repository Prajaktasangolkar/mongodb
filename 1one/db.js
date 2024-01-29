const {MongoClient} =require('mongodb')

let dbConnection


// 1.make connection 2.get data from connection

module.exports={
    connectToDb:(cb)=>{
        MongoClient.connect('mongodb://localhost:27017/bookstore2701')
        .then((client)=>{
            dbConnection=client.db()
            return cb()
        })
        .catch(err=>{
            console.log(err);
            return cb(err)
        })
    },
    getDb:()=>dbConnection
}