import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SatisfactoryGamerView from '@/views/pages/Satisfactory/Gamer/Home';

const Page = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className={"flex flex-col justify-center items-center w-100"}>
      <SatisfactoryGamerView />
    </div>
  );
};

export default Page;
