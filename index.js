const express = require("express");
const multer = require('multer');
const path = require("path");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Student = require("./models/student");

const app = express();

const storage = multer.diskStorage({
  destination: 'public/index/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }

});

app.post('/public/index',upload, async function (req, res, next) {
  try {
    let Postvalues = {
      bookName: req.body.bookName,
      author: req.body.author,
      bookcatugory: req.body.bookcatugory,
      bookpage: req.body.bookpage,
     
    };

    let Result = await Posts.create(Postvalues);
    req.flash('success','Post Created');
    res.redirect('/posts')
  } catch (err) {
    console.error(`Error while creating Post`, err.message);
    next(err);
  }
});

app.put('/api/post/book',upload, async function (req, res, next) {
  try {
    let Postvalues = {
      bookName: req.body.bookName,
      author: req.body.author,
      bookcatugory: req.body.bookcatugory,
      bookpage: req.body.bookpage,
     
    };

    res.status(201).send(await Posts.create(Postvalues));
  } catch (err) {
    res.status(404).send({message:'Post not Created'});
    next(err);
  }
});

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "./public")));

app.get("/getbooks", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post("/addbook", async (req, res) => {
  const { bookName, author, category, pages } = req.body;

  const addedBook = await Book.create(
    {
      author: author,
      category: category,
      pages: pages,
      name: bookName,
    },
    (err) => console.log(err)
  );
  res.redirect("http://localhost:9000/Addbook.html");
});

app.post("/borrowbook", async (req, res) => {
  const foundStudent = await Student.findOne({
    rollNumber: req.body.rollNumber,
  });
  if (!foundStudent) {
    const createdStudent = await Student.create({
      name: req.body.firstname,
      rollNumber: req.body.rollNumber,
      department: req.body.Department,
      borrowedBooks: [],
    });
  }

  const foundBook = await Book.findOne({ name: req.body.bookName });
  if (!foundBook)
    return res.status(404).json({ message: "Book doesn't exist" });

  const foundedStudent = await Student.findOne({
    rollNumber: req.body.rollNumber,
  });
  if (foundedStudent.borrowedBooks.includes(req.body.bookName))
    return res
      .status(400)
      .json({ message: "You can't borrow the same book more than once" });
  const borrowedBook = await Student.findOneAndUpdate(
    { rollNumber: req.body.rollNumber },
    {
      $push: {
        borrowedBooks: req.body.bookName,
      },
    }
  );
  res.redirect("http://localhost:9000/borrow.html");
});

app.post("/returnbook", async (req, res) => {
  const foundedStudent = await Student.findOne({
    rollNumber: req.body.rollNumber,
  });

  if (
    foundedStudent === null &&
    !foundedStudent?.borrowedBooks.includes(req.body.bookName)
  )
    return res.json({
      message: "You haven't borrwoed this book.",
    });

  const updatedStudent = await Student.findOneAndUpdate(
    { rollNumber: req.body.rollNumber },
    {
      $pull: {
        borrowedBooks: req.body.bookName,
      },
    }
  );
  res.redirect("http://localhost:9000/return.html");
});
