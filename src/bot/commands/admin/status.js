import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { cronJobManager, apiManager } from '../../Launcher.js';
import os from 'os';

export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Shows the bot status and active cron jobs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only admins can use this command
    
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    try {
      // Get system info
      const uptime = process.uptime();
      const uptimeStr = formatUptime(uptime);
      const memoryUsage = process.memoryUsage();
      const memoryUsedMB = Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100;
      const totalMemoryMB = Math.round(os.totalmem() / 1024 / 1024 * 100) / 100;
      
      // Get active cron jobs
      const activeJobs = cronJobManager.getRunningJobs();
      
      // Check API status
      const apiStatus = await apiManager.isApiAvailable() ? '✅ Connected' : '❌ Disconnected';
      
      // Create embed
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('FumbleBot Status')
        .setDescription('Current system status and active cron jobs')
        .addFields(
          { name: '🤖 Bot Uptime', value: uptimeStr, inline: true },
          { name: '💾 Memory Usage', value: `${memoryUsedMB} MB / ${totalMemoryMB} MB`, inline: true },
          { name: '🌐 API Status', value: apiStatus, inline: true },
          { name: '🔄 Active Cron Jobs', value: activeJobs.length > 0 ? activeJobs.join('\n') : 'No active cron jobs' }
        )
        .setTimestamp()
        .setFooter({ text: 'Crit Fumble Bot', iconURL: interaction.client.user.displayAvatarURL() });
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred while checking the bot status.' });
    }
  },
};

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (secs > 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
  
  return parts.join(', ');
}
