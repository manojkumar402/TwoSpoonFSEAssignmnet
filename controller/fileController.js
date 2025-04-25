const File = require("../model/fileModel");
const { v4 } = require("uuid");
const { putObject } = require("../util/putObject");
const { deleteObject } = require("../util/deleteObject");
const { getObject } = require("../util/getObject");

exports.getAllFiles = async (req,res) =>{
    try {
        const file = await File.find().sort({ _id: -1 });
        
        if(!file){
            return res.status(400).json({
                "status": "error",
                "data": file,
            });
        }

        return res.status(200).json({
            "status":"success",
            "data": file,
        });
    } catch (err) {
        console.error(err);
    }
}

exports.getOneFile = async (req,res) =>{
    try {
        const {id}= req.params;
        const file = await File.findById(id);
        
        if(!file){
            return res.status(400).json({
                "status": "error",
                "data": file,
            });
        }

        //Get Object from S3 Bucket
        await getObject(file.key);
        //
        return res.status(200).json({
            "status":"success",
            "data": file,
        });
    } catch (err) {
        console.error(err);
    }
}

exports.createFile = async(req,res) => {
    try {
        const {name} = req.body;

        const {file} = req.files;
        const fileName = "images/"+v4();

        if(!name || !file){
            return res.status(400).json({
                "status": "error",
                "data": "name and file required"
            })
        }
        //Upload image to S3
        const {url,key} = await putObject(file.data,fileName);

        if(!url || !key){
            return res.status(400).json({
                "status": "error",
                "data": "Image is not uploaded",
            });
        }

        const book = await File.create({name,imageUrl:url,key});
        
        if(!book){
            return res.status(400).json({
                "status": "error",
                "data": book,
            });
        }

        return res.status(201).json({
            "status":"success",
            "data": book,
        })
    } catch (err) {
        console.error(err);
    }
}

exports.updateFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const file = await File.findById(id);
        if (!file) {
            return res.status(400).json({
                status: "error",
                message: "File not found",
            });
        }

        const updatedFile = await File.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        if (!updatedFile) {
            return res.status(400).json({
                status: "error",
                message: "Failed to update file name",
            });
        }

        return res.status(200).json({
            status: "success",
            data: updatedFile,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};


exports.deleteFile = async (req,res) =>{
    try {
        const {id} = req.params;
        const file = await File.findById(id);
        if(!file){
            return res.status(400).json({
                "status": "error",
                "data": file,
            })
        }

        //Delete Object in S3 Bucket
        const data = await deleteObject(file.key);

        if(data.status != 204){
            return res.status(400).json({
                "status": "error",
                "data": data.data,
            })
        }

        const deletedFile = await File.findByIdAndDelete(id,{
            new:true,
        });

        if(!deletedFile){
            return res.status(400).json({
                "status": "error",
                "data": file,
            })
        }

        return res.status(204).json({
            "status": "success",
            "data": null,
        })
    } catch (err) {
        console.error(err);
    }
}