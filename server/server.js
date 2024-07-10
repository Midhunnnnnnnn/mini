const express = require("express");
const mysql = require('mysql2');
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Midhunsm@23',
  database: 'ecommerce_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id', connection.threadId);
});

async function fetchAndStoreProducts() {
  try {
    const response = await axios.get("https://fakestoreapiserver.reactbd.com/products");
    const products = response.data;

    products.forEach(product => {
      const { title, description, price, category, image } = product;

      const query = `INSERT INTO Product (ProductName, ProductDescription, UnitPrice, CategoryID, Picture) VALUES (?, ?, ?, (SELECT CategoryID FROM Category WHERE CategoryName = ? LIMIT 1), ?) ON DUPLICATE KEY UPDATE ProductDescription=VALUES(ProductDescription), UnitPrice=VALUES(UnitPrice), Picture=VALUES(Picture)`;

      connection.query(query, [title, description, price, category, image], (err, results) => {
        if (err) {
          console.error('Error inserting product:', err.stack);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/pay", async (req, res) => {
  try {
    await Stripe.charges.create({
      source: req.body.token.id,
      amount: req.body.amount,
      currency: "usd",
    });
    res.status(200).send("Payment successful");
  } catch (error) {
    res.status(500).send("Payment failed");
  }
});

app.get("/customers", (req, res) => {
  connection.query('SELECT * FROM Customer', (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results);
    }
  });
});

app.get("/customers/:id", (req, res) => {
  const customerId = req.params.id;
  connection.query('SELECT * FROM Customer WHERE CustomerID = ?', [customerId], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results[0]);
    }
  });
});

app.get("/products", (req, res) => {
  connection.query('SELECT * FROM Product', (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results);
    }
  });
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  connection.query('SELECT * FROM Product WHERE ProductID = ?', [productId], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results[0]);
    }
  });
});

app.post("/customers", (req, res) => {
  const { _id, name, email, image } = req.body;

  connection.query('SELECT * FROM Customer WHERE CustomerID = ?', [_id], (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (results.length > 0) {
      const updateQuery = `UPDATE Customer SET FirstName = ?, Email = ?, BillingAddress = ? WHERE CustomerID = ?`;
      connection.query(updateQuery, [name, email, image, _id], (updateError, updateResults) => {
        if (updateError) {
          res.status(500).send(updateError);
        } else {
          res.status(200).send("Customer details updated successfully");
        }
      });
    } else {
      const insertQuery = `INSERT INTO Customer (CustomerID, FirstName, Email, BillingAddress) VALUES (?, ?, ?, ?)`;
      connection.query(insertQuery, [_id, name, email, image], (insertError, insertResults) => {
        if (insertError) {
          res.status(500).send(insertError);
        } else {
          res.status(201).send("New customer added successfully");
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});

fetchAndStoreProducts();