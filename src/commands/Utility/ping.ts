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
import { Achievement } from "../../data/Achievements";

export default new (class PingCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("The best command ever created!");

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    let pingEmbed: Discord.APIEmbed = {
      color: Colors.Blurple,
      title: "Ping Pong! 🏓",
      // thumbnail: `${bot.user?.avatarURL}`,
      fields: [
        {
          name: "API Latency",
          value: `${bot.ws.ping}ms`,
          inline: true,
        },
      ],
    };

    // Start the mongoose ping timer
    const mongooseStart = Date.now();
    try {
      const mongoosePing = Date.now() - mongooseStart;

      pingEmbed.fields?.push({
        name: "Mongoose Latency",
        value: `${mongoosePing}ms`,
        inline: true,
      });
      await interaction.followUp({ embeds: [pingEmbed] });
    } catch (error: any) {
      pingEmbed.fields?.push({
        name: "Mongoose Error",
        value: error.message,
        inline: true,
      });
      await interaction.followUp({ embeds: [pingEmbed] });
    }
  };
})();
