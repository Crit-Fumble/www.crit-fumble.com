import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

const isPlayerSession = async (session: import("next-auth").Session | null) => {
  // TODO: validate that this user is a player through a database query

  return false;
}

const Page = async () => {
  const session = await getServerSession();
  const isPlayer = await isPlayerSession(session);
  // TODO: SEO and things

  if (!session || !isPlayer) {
    redirect("/");
  }

  return session ? (
    <div className={"flex flex-col justify-center items-center w-100"}>
      <div className="flex flex-row">
        <div className={"flex justify-center items-center"}>
          <Image className="rounded-full" src={"/img/cfg-logo.jpg"} alt={"Logo"} width={128} height={128} />
        </div>
        <div className={"flex flex-col justify-center items-center"}>
          <h1 className={"p-4 text-4xl font-bold"}>Welcome to the Player Dashboard, {session.user.name}!</h1>
          <p>This is a Work-In-Progress, players only area.</p>
          {/* <iframe className="w-[100vw] h-[75vh]" src="https://og-csrd.crit-fumble.com/og-cspg.html" /> */}
          {/* <iframe className="w-[100vw] h-[75vh]" src="https://5etools.crit-fumble.com/quickreference.html" /> */}
          <div>
            You can <a className="font-bold underline" href="/api/auth/signout">click here to logout</a>.
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div></div>
      </div>
    </div>
  ) : (
    <div className={"flex flex-col justify-center items-center"}>
      <div>
        You must <a className="font-bold underline" href="/api/auth/signin">login to continue</a>.
      </div>
    </div>
  );
};

export default Page;
