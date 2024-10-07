import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className={"flex flex-col justify-center items-center w-100"}>
      <iframe style={{height: 'calc(100vh - 92px)'}} className="w-[100vw]" src="https://satisfactory-calculator.com/en/interactive-map" />
    </div>
  );
};

export default Page;
