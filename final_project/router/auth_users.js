const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    res.send("User logged in successfully.");
  } else {
    res.status(403).json({
      message: "User not registered.",
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (Object.keys(books).includes(isbn)) {
    const username = req.session.authorization["username"];
    const review = req.query.review;

    books[isbn].reviews[username] = review;
    res.send(
      "Review for '" +
        books[isbn].title +
        "' by user " +
        username +
        " has been published successfully."
    );
  } else {
    res.status(404).json({
      message: "Book for given ISBN " + isbn + " not found.",
    });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (Object.keys(books).includes(isbn)) {
    const username = req.session.authorization["username"];
    const book = books[isbn];
    if (Object.keys(book.reviews).includes(username)) {
      delete books[isbn].reviews[username];
      res.send(
        "Review for '" +
          book.title +
          "' by user " +
          username +
          " has been deleted successfully."
      );
    } else {
      res.status(404).json({
        message:
          "User " +
          username +
          " has not given a review for " +
          book.title +
          ".",
      });
    }
  } else {
    res.status(404).json({
      message: "Book for given ISBN " + isbn + " not found.",
    });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
