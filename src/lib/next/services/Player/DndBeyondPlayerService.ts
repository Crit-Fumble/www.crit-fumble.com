import prisma from '../DatabaseService';
import { withDb } from '../DatabaseService';

/**
 * Service for handling D&D Beyond related operations
 */

export const DndBeyondService = {
  /**
   * Find or create a D&D Beyond user
   * @param dndBeyondId The D&D Beyond user ID
   * @returns The UserDndBeyond record
   */
  async findOrCreateDndBeyondUser(dndBeyondId: string) {
    return withDb(async () => {
      // Check if the user already exists
      let dndBeyondUser = await prisma.userDndBeyond.findUnique({
        where: { id: dndBeyondId }
      });

      // If not, create a new one
      if (!dndBeyondUser) {
        dndBeyondUser = await prisma.userDndBeyond.create({
          data: {
            id: dndBeyondId,
            name: dndBeyondId, // Using ID as name by default
            // Add any other default fields here
          }
        });
      }

      return dndBeyondUser;
    });
  },

  /**
   * Link a D&D Beyond account to a user
   * @param userId The user ID to link to
   * @param dndBeyondId The D&D Beyond user ID
   * @returns The updated user record
   */
  async linkDndBeyondAccount(userId: string, dndBeyondId: string) {
    return withDb(async () => {
      // First ensure the D&D Beyond user exists
      await this.findOrCreateDndBeyondUser(dndBeyondId);

      // Then update the user record
      return prisma.user.update({
        where: { id: userId },
        data: {
          dd_beyond: dndBeyondId,
          updatedAt: new Date()
        },
        select: {
          id: true,
          dd_beyond: true,
          updatedAt: true
        }
      });
    });
  },

  /**
   * Unlink a D&D Beyond account from a user
   * @param userId The user ID to unlink from
   * @returns The updated user record
   */
  async unlinkDndBeyondAccount(userId: string) {
    return withDb(async () => {
      return prisma.user.update({
        where: { id: userId },
        data: {
          dd_beyond: null,
          updatedAt: new Date()
        },
        select: {
          id: true,
          dd_beyond: true,
          updatedAt: true
        }
      });
    });
  }
};

export default DndBeyondService;
