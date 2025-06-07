import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node js!");
});

app.get("/books", (req, res) => {
  const data = readData();
  res.json(data.books);
});

app.get("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = data.books.find((book) => book.id === id);
  if (!book) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
  res.json(book);
});

app.post("/books", (req, res) => {
  const data = readData();
  const body = req.body;

  const newId =
    data.books.length > 0 ? Math.max(...data.books.map((b) => b.id)) + 1 : 1;

  const newBook = {
    id: newId,
    ...body,
  };

  data.books.push(newBook);
  writeData(data);
  res.json(newBook);
});

app.put("/books/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...body,
  };

  writeData(data);
  res.json({ message: "Book updated successfully" });
});

app.delete("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  data.books.splice(bookIndex, 1);
  writeData(data);
  res.json({ message: "Book deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
