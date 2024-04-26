import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

const isAdminSession = async (session: import("next-auth").Session | null) => {
  // TODO: validate that this user is an admin through a database query

  return false;
}

const Page = async () => {
  const session = await getServerSession();
  const isAdmin = await isAdminSession(session);

  if (!session || !isAdmin) {
    redirect("/");
  }

  return (
      <div className={"flex flex-col justify-center items-center"}>
        <div className="flex flex-row">
          <div className={"flex justify-center items-center"}>
            <Image className="rounded-full" src={"/img/cfg-logo.jpg"} alt={"Logo"} width={128} height={128} />
          </div>
          <div className={"flex flex-col justify-center items-center"}>
            <h1 className={"p-4 text-4xl font-bold"}>Welcome to the Admin Dashboard, {session.user.name}!</h1>
            <p>This is a Work-In-Progress, admin only area.</p>
            <div>
              You can <a className="font-bold underline" href="/api/auth/signout">click here to logout</a>.
            </div>
          </div>
        </div>
      </div>
    );
};

export default Page;
