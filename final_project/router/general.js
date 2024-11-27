const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      res.send({ message: "User registered successfully" });
    } else {
      res.status(406).json({
        message: "Username is invalid.",
      });
    }
  } else
    res.status(406).json({
      message: "Username or password not provided, please check your request.",
    });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (isbn) {
    if (Object.keys(books).includes(isbn)) {
      res.send(books[isbn]);
    } else {
      res.send("There is no book associated with ISBN " + isbn + ".");
    }
  } else {
    res.status(406).json({
      message: "Request malformed.",
    });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let existingBooks = Object.values(books).filter(
    (book) => book.author === author
  );

  if (existingBooks.length > 0) {
    res.send({ booksbyauthor: existingBooks });
  } else {
    res.send("No books found by author " + author + ".");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let existingBooks = Object.values(books).filter(
    (book) => book.title === title
  );

  if (existingBooks.length > 0) {
    res.send({ booksbytitle: existingBooks });
  } else {
    res.send("No books with title " + title + " exist.");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (isbn) {
    if (Object.keys(books).includes(isbn)) {
      res.send(books[isbn].reviews);
    } else {
      res.send("There is no book associated with ISBN " + isbn + ".");
    }
  } else {
    res.status(406).json({
      message: "Request malformed.",
    });
  }
});

module.exports.general = public_users;
