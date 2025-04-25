const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const {getAllFiles, createFile, updateFile, deleteFile, getOneFile} = require("./controller/fileController");

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Database Connected successfully");
}).catch((err) =>{
    console.error(err);
})

const app = express();

app.use(cors());
app.use(express.json());

app.get("/files",getAllFiles);
app.get("/file/:id",getOneFile);
app.post("/file", fileUpload(),createFile);
app.patch("/file/:id",fileUpload(),updateFile);
app.delete("/file/:id",deleteFile);

app.listen(process.env.PORT, () =>{
    console.log("Server Running on port 5000");
})