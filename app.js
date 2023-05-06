const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
//init app and middleware
const app = express();
app.use(express.json());

//db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000! Success");
    });
    db = getDb();
  }
});
app.get("/", (req, res) => {
  res.send("Jedi loves all");
});

//routes
app.get("/student", (req, res) => {
  const page=req.query.p || 0
  const booksPerPage=3
  let students = [];
  db.collection("Student")
    .find() //returns a cursor
    //.sort({author: 1})//returns a cursor
    .skip(page*booksPerPage)
    .limit(booksPerPage)
    .forEach((student) => students.push(student))
    .then(() => {
      res.status(200).json(students);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
  //res.json({msg:"welcome to the api"})
});

app.get("/student/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("Student")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ err: "Couldnt fetch the doc" });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});

app.post("/student", (req, res) => {
    //console.log(req)
 const student = req.body;
//   console.log(student)
  db.collection('Student')
  .insertOne(student)
  .then(result=>{
    res.status(201).json(result)
  })
  .catch(err=>{
    res.status(500).json({error:"Could not find the doc"})
  })
});

app.delete('/student/:id',(req,res)=>{
  if(ObjectId.isValid(req.params.id)){
    db.collection('Student')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then(result=>{
      res.status(200).json(result)
    })
    .catch(err=>{
      res.status(500).json({err:'Could not fetch the document'})
    })
  }else{
    res.status(500).json({error: 'Not a valid doc id'})
  }
});

app.patch("/student/:id",(req,res)=>{
    const updates = req.body
    if(ObjectId.isValid(req.params.id)){
      db.collection('Student')
      .updateOne({_id: new ObjectId(req.params.id)},{$set:updates})
      .then(result=>{
        res.status(200).json(result)
      })
      .catch(err=>{
        res.status(500).json({err:'Could not fetch the document'})
      })
    }else{
      res.status(500).json({error: 'Not a valid doc id'})
    }

});