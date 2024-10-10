import { getUserPageProps } from '@/controllers/user';
import PlayHomeView from '@/views/pages/Play';

const Page = async () => {
  const props = await getUserPageProps();

  return (<PlayHomeView {...props} />);
};

export default Page;
