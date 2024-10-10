import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import SatisfactoryAdminView from '@/views/pages/Satisfactory/Admin/Home'

const Page = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className={"flex flex-col justify-center items-center w-100"}>
      <SatisfactoryAdminView />
    </div>
  );
};

export default Page;
