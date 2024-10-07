import { getServerSession } from "next-auth";
import GameHomeView from '@/views/pages/Game';

const Page = async () => {

  return (<GameHomeView  />);
};

export default Page;
