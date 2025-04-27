import ListBooks from "@/components/ListBooks";
import NewBook from "@/components/NewBook";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic'

type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined;
};

export default async function Home({ searchParams }: SearchParamProps) {
  const add = searchParams?.add;
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_NODE_SERVER}/files`);
  const model = add == "true" ? true : false

  if (data.status != "success") {
    console.error("Error Fetching apps");
    return Promise.reject(data);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main>
        <ListBooks Files={data.data} />
        {model && <NewBook/>}
      </main>

      {/* Floating Action Button */}
      <Link href="/?add=true" className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-4 rounded-full shadow-lg transition cursor-pointer flex items-center space-x-2">
        <Plus />
        <span className="text-white font-medium">New</span>
      </Link>

    </div>
  )
}
