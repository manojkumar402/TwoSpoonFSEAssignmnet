"use client"
import axios from "axios";
import { Loader} from "lucide-react";
import { useRouter } from "next/navigation";
import {  useState } from "react";

type UpdateProps = {
  id:string,
  bookName:string,
}

function UpdateBook({id,bookName}:UpdateProps) {
  const router = useRouter();
  const [name,setName] = useState<string>(bookName);
  const [isLoading,setLoading] = useState(false);  

  const onUpdate = async (e:any) => {
    try{
      e.preventDefault();
      setLoading(true);
      console.log(name);
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NODE_SERVER}/file/${id}`,{
        name
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
      setLoading(false);
      router.push("/");
    }catch(err){
      console.error(err);
      return Promise.reject(err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <form
          className="space-y-6"
          onSubmit={onUpdate}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Edit File Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Atomic Habits"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="p-3 text-base rounded-md border border-gray-300 placeholder:text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
  
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md py-2 px-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
              disabled={isLoading}
            >
              {!isLoading ? "Submit" : <Loader className="h-5 w-5 animate-spin" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  
}

export default UpdateBook;