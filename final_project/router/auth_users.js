const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"noe",password:"123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const existingUsers = users.filter((user)=>user.username === username)
return existingUsers.length > 0
}



const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const existingUsers = users.filter((user)=>user.username ===username && user.password === password)
return existingUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username =req.body.username;
  const password = req.body.password;
  if (!authenticatedUser(username,password)) {
    return res.status(403).json({ message: "Invalid username or password" });
  }
  try {
    const token = jwt.sign({data:username},"fingerprint_customer",{expiresIn:'1h'});
    req.session.authorization = {
        token:token,
        username:username
    }
    return res.status(200).json({message :"Login successfully"})
  } catch (error) {
    return res.status(404).send("An error occured",error);
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).send("no params")
  }
  
    const review = req.body.reviews;
    if (!review) {
        return res.status(404).send("Nothing to add")
    }
    const username = req.session.authorization ? req.session.authorization.username :null
  try {
    books[isbn].reviews[username]=review;
   
    return res.status(200).json(books[isbn]);
  } catch (error) {
    return res.status(500).send("an error occured",error)
  }
 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;
  
    if (!isbn) {
      return res.status(400).send("ISBN is required");
    }
    if (!username) {
      return res.status(403).send("User not logged in");
    }
  
    try {

      if (books[isbn] && books[isbn].reviews[username]) {
        
        delete books[isbn].reviews[username];
  
        return res.status(200).json({
          message: `Review for ISBN ${isbn} by user ${username} deleted.`,
          reviews: books[isbn].reviews
        });
      } else {
        return res.status(404).send("Review or Book not found");
      }
    } catch (error) {
      return res.status(500).send("An error occurred");
    }
  });

  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
