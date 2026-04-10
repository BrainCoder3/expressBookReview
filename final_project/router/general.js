const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password){
    return res.status(404).send("All fields required")
  }
  userExisting = users.find((user)=>user.username === username);
  if (userExisting) {
    return res.status(404).send('this userName is already taken')
  }
  try {
    const data = {username:username,password:password}
    users.push(data);
    return res.status(200).json(users)
  } catch (error) {
    return res.status(404).send("An error occured ",error)
  }

 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn =req.params.isbn;
  if (!isbn) {
    return res.status(404).send("No params")
  }
  const book = books[isbn];
  return res.status(200).json(JSON.stringify(book));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author =req.params.author;
  if (!author) {
    return res.status(404).send("No params")
  }
  try {
    const book =[];
    const decoder = decodeURIComponent(author).trim().toLowerCase();
    for (const key in books) {
        if (books[key]['author'].trim().toLowerCase()===decoder) {
            book.push(books[key])
            
        }
    }
    return res.status(200).json(JSON.stringify(book))
  } catch (error) {
    return res.status(404).send("error occured:",error)
  }
 
});

// Get all books based on isbn
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn =req.params.isbn;
  if (!isbn) {
    return res.status(404).send("No params")
  }
  try {
    const book =[];
    const decoder = decodeURIComponent(isbn).trim().toLowerCase();
    for (const key in books) {
        if (books[key]['isbn'].trim().toLowerCase()===decoder) {
            book.push(books[key])
            
        }
    }
    return res.status(200).json(JSON.stringify(book))
  } catch (error) {
    return res.status(404).send("error occured:",error)
  }
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn =req.params.isbn;
  if (!isbn) {
    return res.status(404).send("No params")
  }
  try {
   
    const decoder = decodeURIComponent(isbn).trim().toLowerCase();
    const reviews = books[decoder]['reviews'];
    
    return res.status(200).json(JSON.stringify(reviews))
  } catch (error) {
    return res.status(404).send("error occured:",error)
  }
 
});

module.exports.general = public_users;
