const express = require('express');
const requireAuth = require('../common/tokenValidator');
const config = require('../common/config.json');
const product = require('../model/productModel');
const router = express.Router();
const enums = require('../common/enums');
const log = require('../model/logModel');
const jwt = require('jsonwebtoken');
const path = require('path')
const app = express();
const multer = require('multer')

router.use(requireAuth);


let storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        debugger;
        cb(null, './image')
    }, 
    filename: (req, file, cb) => {
        debugger;
        let barcode = app.locals.barcode;
        if (file.fieldname === "file") {
            cb(null, app.locals.barcode + '.webp');
        }
        else if (file.fieldname === "fileName") {
            cb(null, app.locals.barcode + '.webp');
        }
        else if (file.fieldname === "certificate") {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
    }
    // filename: (req, file, cb) => {
    //     debugger;
    //     cb(null, file.originalname.split(".")[0] + '.webp')
    // }
})

let maxSize = 2 * 1000 * 1000;
let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    }
})




// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 10
//     },
//     fileFilter: (req, file, cb) => {
//        // checkFileType(file, cb);
//     }
// });

function checkFileType(file, cb) {
    debugger;
    if (file.fieldname === "certificate") {
        if (
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) { // check file type to be pdf, doc, or docx
            cb(null, true);
        } else {
            cb(null, false); // else fails
        }
    }
    else if (file.fieldname === "file" || file.fieldname === "profile") {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp' ||
            fiel.mimetype === 'image/gif'
        ) { // check file type to be png, jpeg, or jpg
            cb(null, true);
        } else {
            cb(null, false); // else fails
        }
    }
}

let uploadHandle = upload.single("file")
// let uploadHandle = upload.fields([{
//     name: 'file', maxCount: 1
// }, {
//     name: 'fileName', maxCount: 1
// }])

// let uploadHandle =upload.fields([{
//     name: 'file', maxCount: 1
//   }, {
//     name: 'fileName', maxCount: 1
//   }])
//const uploadHandle = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'fileName', maxCount: 1 }])

const fileName = __filename.slice(__dirname.length + 1);

router.get('/productlist', async (req, res) => {
    const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
    try {
        const result = await product.getProductList();
        res.status(200).json(result);
    } catch (err) {
        const error = err.code + ' | ' + err.sqlMessage + ' | ' + err.sql;
        log.logInfo(enums.logLevel.Error, "Product List Retrieval", error, fileName, loggedInUser);
        res.status(403).json("Error occurred");
    }
});


router.post("/productlist", async (req, res) => {
    const q = "INSERT INTO items (`SupplierID`,`Brand`,`UOM`,`ItemName`,`Price`,`Image`,`Size`) VALUES (?)"
    try {
        req.body.forEach(async element => {
            const values = [element[0].value, element[1].value, element[2].value, element[3].value, element[4].value, element[5].value, element[6].value]
            await db.query(q, [values], (err, data) => {

                console.log(err)
                console.log(data)

            })
        });
        return res.send("Book has been created successfully")
    } catch (error) {
        console.log(error)
    }
})


// router.post('/uploadBarcodeImage', async (req, res) => {
//     debugger;
//     const loggedInUser = jwt.verify(req.get("authorization"), config.secret);
//     const barcode = req.body.barcode
//     const file = req.files.file
//     debugger;
//     try {
//         const result = await store.uploadPriceDetails(selectedStote, JSON.parse(file));
//         console.log(result)
//         res.status(200).json(result);
//     } catch (err) {
//         const error = err.code + ' | ' + err.sqlMessage + ' | ' + err.sql;
//         log.logInfo(enums.logLevel.Error, "Add Store Retrieval", error, fileName, loggedInUser);
//         res.status(403).json("Error occurred");
//     }
// });

router.post('/uploadBarcodeImage/:barcode', (req, res) => {
    const barcode = req.params.barcode;
    app.locals.barcode = barcode;
    debugger;
    // const barcode = req.body.barcode
    // const file = req.files.file
    let fullnames = req.body;
    uploadHandle(req, res, function (err) {
        let fullnames = req.body;
        debugger;
        if (err instanceof multer.MulterError) {
            if (err.code == 'LIMIT_FILE_SIZE') {
                res.status(400).json({ message: "" })
            }
            return;
        }
        if (!req.file) {
            debugger;
            res.status(200).json({ message: "No file" })
        } else {
            debugger;
            res.status(200).json({ message: "File Image Upload Successfully" })
        }
    })
})




module.exports = router;
