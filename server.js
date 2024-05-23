const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const mysql = require('mysql');
const ports = require('./common/config.json');
const fileupload = require('express-fileupload')
const app = express();
const port = process.env.PORT || ports.port;
const swaggerDocument = require('./swagger.json');
// var cors = require('cors');
// import mysql from "mysql"
// import cors from "cors"


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "retail"
})


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Accept, Authorization, X-Requested-With");
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'DELETE, HEAD, GET, OPTIONS, POST, PUT,PATCH');
      return res.status(200).json({});
    }
    next();
  });



//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
app.use(express.json())
// app.use(cors())
// app.get("/", (req, res) => {
//     res.json("hello this is the backend")
// })


const helpController = require('./controller/helpController');
const authController = require('./controller/authController.js');
const loginController = require('./controller/loginController');
const productController = require('./controller/productController.js');
const storeController = require('./controller/storeController.js');

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/help', helpController);
app.use('/api/auth', authController);
app.use('/api/login', loginController);
app.use('/api/product', productController);
app.use('/api/store', storeController);


// app.get("/itemList", (req, res) => {
//     const q = "SELECT * FROM items;"
//     db.query(q, (err, data) => {
//         if (err) return res.json(err)
//         return res.json(data)
//     })
// })

// app.post("/books", (req, res) => {
//     const q = "INSERT INTO BOOKS (`title`,`desc`,`price`,`cover`) VALUES (?)"
//     const values = [req.body.title, req.body.desc, req.body.price, req.body.cover]

//     db.query(q, [values], (err, data) => {
//         if (err) return res.json(err)
//         return res.json("Book has been created successfully")
//     })
// })

// app.post("/itemList", async (req, res) => {
//     const q = "INSERT INTO items (`SupplierID`,`Brand`,`UOM`,`ItemName`,`Price`,`Image`,`Size`) VALUES (?)"
//     try {
//         req.body.forEach(async element => {
//             const values = [element[0].value, element[1].value, element[2].value, element[3].value, element[4].value, element[5].value, element[6].value]
//             await db.query(q, [values], (err, data) => {

//                 console.log(err)
//                 console.log(data)

//             })
//         });
//         return res.send("Book has been created successfully")
//     } catch (error) {
//         console.log(error)
//     }
// })

// app.delete("/book/:id", (req, res) => {
//     const bookId = req.params.id;
//     const q = "DELETE FROM books WHERE id = ?"
//     db.query(q, [bookId], (err, data) => {
//         if (err) return res.json(err)
//         return res.json("Book has been delete successfully")
//     })
// })


// app.put("/books/:id", (req, res) => {
//     const bookId = req.params.id;
//     const q = "UPDATE books SET `title` = ?,`desc`= ?,`price`= ?,`cover`= ? WHERE id= ? "
//     const values = [req.body.title, req.body.desc, req.body.price, req.body.cover]

//     db.query(q, [...values, bookId], (err, data) => {
//         if (err) return res.json(err)
//         return res.json("Book has been update successfully")
//     })
// })

app.listen(port, () => {
    console.log('API server started on: ' + port);
  });

