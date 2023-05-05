import { useSession, signIn, signOut } from "next-auth/react"
import Layout from "@/components/Layout";

export default function Home() {
  const {data: session} = useSession();
  console.log(session);
  return(
    <Layout>
      <div className="text-blue-900 flex justify-between ">
        <h2>
        Hello, {session?.user?.name}
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black">
          <img src={session?.user?.image} alt="" className="w-8 h-8" />
          <span className="py-1 px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>
  );
}
