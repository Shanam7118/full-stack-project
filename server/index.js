const express = require ('express');
const mysql = require ('mysql');
const cors = require ('cors');

const port = 5000;

const app = express ();

//middlewares

app.use(cors());
app.use(express.json());

// making connection with mysql server

let db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'postbook2'
  });

  db.connect((err) => {
    if(err){
        console.log("something went wrong while connecting to the database: ",err);
        throw err;
    }
    else {
        console.log("my sql server connected...");
    }
  })

  //getting user data from server

  app.post('/getuserInfo', (req,res) => {
   
    const {userid, password} = req.body;

    const getuserInfosql = `SELECT userId, userName, userImage FROM users WHERE users.userId = ? AND users.userPassword = ?`

    let query = db.query(getuserInfosql, [userid, password], (err,result) => {
      if(err){
        console.log("error getting user info from server: ", err);
        throw err;
      }
      else{
        res.send(result);
      }
 }); 
 });

 app.get('/getallposts', (req,res) => {
   const sqlallposts = `SELECT users.userName AS postedusername, users.userImage AS posteduserimage,posts.postid, posts.postedtime, posts.posttext, posts.postimageurl FROM posts INNER JOIN users ON posts.posteduserid=users.userId ORDER BY posts.postedtime DESC`;

   let query = db.query(sqlallposts , (err,result) => {

    if(err){
      console.log("error loading all posts from database: ", err);
      throw err;
    }

    else{
      // console.log(result);
      res.send(result);
    }

   });

 });

// getting comments of asingle post 

app.get('/getallcomments/:postid', (req,res) => {
  let id = req.params.postid;

  let sqlforallcomments = `SELECT users.userName AS commentedusername, users.userImage AS commenteduserimage, comments.commentid, comments.commentofpostid, comments.commentedtext, comments.commentedtime
FROM comments
INNER JOIN users ON comments.commenteduserid=users.userId WHERE comments.commentofpostid = ${id}`;

let query = db.query(sqlforallcomments, (err,result) => {

  if(err){
    console.log("error fetching comments from the database: ", err);
    throw err;
  }
  else{
    res.send(result);
  }

});

});

// adding new comments to a post
app.post('/postcomment', (req,res) => {
  const {commentofpostid,commenteduserid,commentedtext,commentedtime} = req.body;
  // seeing commented text
  console.log(commentedtext);
   let sqlforaddingnewcomments = `INSERT INTO comments (commentid, commentofpostid,commenteduserid, commentedtext, commentedtime) VALUES (NULL,?, ?,?, ?);`;

   let query = db.query(sqlforaddingnewcomments, [commentofpostid,commenteduserid	,commentedtext,commentedtime,],
    (err,result) => {
      if(err){
        console.log("error adding comment to the database: ",err);
      }
      else{
        res.send(result);
      }

    });


});

app.post('/addnewpost', (req,res) => {
  // destructure the req.body object

  const {posteduserid,postedtime,posttext,postimageurl} = req.body;

  // sql query

  let sqlforaddingnewpost = `INSERT INTO posts (postid, posteduserid, postedtime, posttext, postimageurl) VALUES (NULL, ?, ?, ?, ?)`;

  let query = db.query(sqlforaddingnewpost,[posteduserid,postedtime,posttext,postimageurl], (err,result) => {
    if(err){
      console.log("error while adding a new post in the database: ", err);
      throw err;
    }
    else{
      res.send(result);
    }

  });


  });

app.listen (port, () => {
    console.log (`server is running on port ${port}`);
});

