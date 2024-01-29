const express=require("express")
const { ObjectId } = require('mongodb');
const {connectToDb,getDb}=require('./db')

//init app & middleware
const app=express()
app.use(express.json())


//db connection
let db

connectToDb((err)=>{
     if (!err){
        app.listen(3000,()=>{
            console.log('app listening on port 3000');
        });
        db=getDb()
     }
})



//routes
app.get('/books',(req,res)=>{
    //current page
    //localhost:3000/books?p=1  --- pagination

    const page=req.query.p || 0
    const booksPerPage=3  //3 documents for each page 

    let books=[]

    db.collection('books')
    .find() //cursor toArray forEach
    .sort({author:1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book=>books.push(book))
    .then(()=>{
        res.status(200).json(books)
    })
    .catch(()=>{
        res.status(500).json({error:'Could not fetch the documents'})
    })

    // res.json({mssg:"Welcome to api"})
})

app.get('/books/:id',(req,res)=>{
    
    if (ObjectId.isValid(req.params.id)){
        // console.log(req.params.id);
        db.collection("books")
        .findOne({ _id: new ObjectId(req.params.id)})
        .then (doc=>{
            res.status(200).json(doc)
        })
        .catch(err=>{
            res.status(500).json({err:'Could not fetch the documents'})
        })
    }
    else{
        res.status(500).json({err:'Not a valid Id'})
    }

})

app.post('/books',(req,res)=>{
    const book=req.body

    db.collection('books')
    .insertOne(book)
    .then (result =>{
        res.status(201).json(result)
    })
    .catch(err=>{
        res.status(500).json({err:'Could not create a new document'})
    })
})


app.delete('/books/:id',(req,res)=>{
    if (ObjectId.isValid(req.params.id)){
        // console.log(req.params.id);
        db.collection("books")
        .deleteOne({ _id: new ObjectId(req.params.id)})
        .then (result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({err:'Could not delete the documents'})
        })
    }
    else{
        res.status(500).json({err:'Not a valid Id'})
    }    
})

app.patch('/books/:id',(req,res)=>{
    const updates=req.body
//    {"title":"new value","rating":6}   -->updates

    if (ObjectId.isValid(req.params.id)){
        // console.log(req.params.id);
        db.collection("books")
        .updateOne({ _id: new ObjectId(req.params.id)},{$set:updates})
        .then (result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(500).json({err:'Could not delete the documents'})
        })
    }
    else{
        res.status(500).json({err:'Not a valid Id'})
    }  
    
})