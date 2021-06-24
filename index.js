const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ernz8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const blogsCollection = client.db(process.env.DB_NAME).collection("blogs");

  const adminCollection = client.db(process.env.DB_NAME).collection("admins");

  app.get('/admins', (req, res) => {
    adminCollection.find({})
    .toArray((err, admins) => {
      res.send(admins);
    })
  })

  app.delete('/deleteAdmin', (req, res) => {

  })

  app.get('/isAdmin', (req, res) => {
    const { email } = req.query;
    adminCollection.find({ email })
    .toArray((err, admin)=> {
      if (admin.length){
        res.send(true);
      }
      else{
        res.send(false);
      }
    })
  })

  app.post('/addAdmin', (req, res) => {
    const adminData = req.body;

    adminCollection.insertOne(adminData)
    .then(result => res.send({
      inserted: result.insertedCount > 0,
      _id: result.insertedId
    }))
  })

  app.post('/addBlog', (req, res) => {
    const blog = req.body;

    blogsCollection.insertOne(blog)
    .then(result => res.send({
      inserted: result.insertedCount > 0,
      _id: result.insertedId
    }))
  })

  app.get('/blogs', (req, res)=> {
    blogsCollection.find({})
    .toArray((err, blog) => {
      res.send(blog);
    })
  })

  app.get('/blog/:id', (req, res)=> {
    const { id } = req.params;
    blogsCollection.find({_id: ObjectId(id)})
    .toArray((err, blog) => {
      res.send(blog[0]);
    })
  })

  app.delete('deleteBlog', (req, res) => {

  })

  app.patch('updateBlog', (req, res) => {

  })
  
  //client.close();
});

app.get('/', (req, res) => {
  res.send('Hello Retro Blog!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});