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
import { Achievement, IAchievement } from "../../data/Achievements";

export default new (class AchievementCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("achievements")
    .setDescription("View all your achievements.");

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const achievements = await Achievement.find({
      userId: interaction.user.id,
    });
    // if ( !achievements ) return interaction.followUp({ content: "You haven't earnt any Achievements!" });

    const embed = new Discord.EmbedBuilder()
      .setTitle(`🏆 Achievements`)
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1058284599282782230.gif?size=240&quality=lossless"
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ forceStatic: false }),
      })
      .setDescription(`> You have earned ${achievements.length} achievements!`)
      .setColor(Discord.Colors.Blurple)
      .setTimestamp()
      .setFooter({ text: "Your achievement journey." });

    let fields = [] as any[];
    const totalAchievements = 20;
    fields.push({
      name: "Progress",
      value: `${
        (parseInt(achievements.length as any) / totalAchievements) * 100
      }%`,
      inline: true,
    });

    embed.addFields(fields);

    await interaction.followUp({ embeds: [embed] });
  };
})();
