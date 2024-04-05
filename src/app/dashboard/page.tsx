import Dashboard from "@/components/dashboard";
import { Session } from "next-auth";

interface PageProps { session? : Session | null };

export default async function Page({ session } : PageProps) {

  return (
      <div className={'flex flex-col justify-center'}>
        <Dashboard />
      </div>
  );
}
