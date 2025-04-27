"use client"

import axios from "axios";
import { Loader, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

function NewBook() {
  const [file,setFile] = useState<Blob | null>();
  const [name,setName] = useState<string>();
  const [isLoading,setLoading] = useState(false);
 
  const router = useRouter();

  const handleChange = (file:Blob) => {
    const selectedFile = file as File;
    setFile(file);
    setName(selectedFile.name)
  };

  const onSubmit = async (e:any) => {
    try{
      e.preventDefault();
      setLoading(true);

      const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NODE_SERVER}/file`,{
        name,
        file
      },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
        }
      }
    ) 

      if(data.status !== "success"){
        console.error("Error Creating App");
        return Promise.reject(data);
      }
     
      setName("");
      setFile(null);

      setLoading(false);
      router.refresh();
    }catch(err){
      console.error(err);
      return Promise.reject(err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border shadow-lg rounded-md bg-white max-w-lg w-full">
        <div>
          <div className="flex justify-between mt-4 px-6">
            <h3 className="text-3xl font-semibold text-gray-800">Add New File</h3>
            <button
              onClick={router.back}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <X />
            </button>
          </div>
          <div className="mt-4 px-7 py-3">
            <form
              className="grid grid-cols-1 gap-y-8"
              onSubmit={onSubmit}
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="file" className="text-lg font-medium text-gray-700">
                  Upload Image
                </label>
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={["jpg", "jpeg", "png", "webp"]}
                  label={"Drag or click to upload an image"}
                  required
                  fileOrFiles={file}
                />
              </div>

              <div className="flex gap-6 items-end justify-center">
                <button
                  type="submit"
                  value="Submit"
                  className="w-full border-2 border-blue-500 bg-blue-100 text-blue-700 rounded-md py-2 px-4 hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-center items-center"
                >
                  {!isLoading ? (
                    "Submit"
                  ) : (
                    <Loader className="h-6 w-6 animate-spin" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewBook;
