import { getServerSession } from "next-auth";
import PlayHomeView from '@/views/pages/Home';

const Page = async () => {

  return (<PlayHomeView  />);
};

export default Page;
