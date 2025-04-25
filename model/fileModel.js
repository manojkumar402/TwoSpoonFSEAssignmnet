const mongoose = require("mongoose");


const fileSchema = mongoose.Schema({
    name: {
        type:String,
        required:[true, "File should have name"],
    },
    imageUrl:{
        type:String,
        required:[true,"File should have image"],
    },
    key:{
        type:String,
        required:[true, "File should have key"],
    },
})

module.exports = mongoose.model("File", fileSchema);