import {
  ApplicationCommandData,
  ApplicationCommandDataResolvable,
  ChatInputCommandInteraction,
  Colors,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../services/registery.service";
import { Client } from "../../utils/Client";
import Discord from "discord.js";
import { SavedMember } from "../../data/member";

export default new (class RankCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check your level!");

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const savedMember = await SavedMember.findOne({ _id: interaction.user.id });
    if (!savedMember) return;

    let RANK_EMBED: Discord.APIEmbed = {
      color: Colors.Blurple,
      title: "Ping Pong! 🏓",
      // thumbnail: `${bot.user?.avatarURL}`,
      description: `> \`XP/${savedMember.exp}\`, \`Level/${savedMember.level}\``,
    };

    let titles = [
      "🏓 View Your Rank!",
      "🎾 Tennis Anyone?",
      "🏀 Let's Play Basketball!",
      "🥎 Softball Squad!",
      "🏈 Touchdown!",
    ];
    RANK_EMBED.title = titles[Math.floor(Math.random() * titles.length)];

    await interaction.followUp({ embeds: [RANK_EMBED] });
  };
})();
