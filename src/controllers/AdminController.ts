import { handler as _authHandler, getServerSession as _getServerSession } from '@/services/AuthService'
import { getCharactersByPlayerId } from "@/services/CharacterService";
import { getUserByDiscordId, getUserBySlug } from "@/services/ProfileService";
import { redirect } from "next/navigation";
import DatabaseService from '@/services/DatabaseService';

export const getAdminDashboardPageProps = async (userSlug: string) => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const sessionUser: any = await getUserByDiscordId(session?.user?.id);
  
  // Check if the user has admin privileges
  if (!sessionUser?.admin) {
    redirect("/");
  }

  const viewedUser: any = await getUserBySlug(userSlug);
  const characters = await getCharactersByPlayerId(viewedUser.id);

  const users = await DatabaseService.user.findMany();
  const userDiscords = await DatabaseService.userDiscord.findMany();

  return {
    session,
    viewedUser,
    sessionUser,
    characters,
    users,
    userDiscords,
  };
};

export const authHandler = _authHandler;
export const getServerSession = _getServerSession;