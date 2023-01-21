import {
  ActionRow,
  ActionRowBuilder,
  AnyComponentBuilder,
  ApplicationCommandData,
  ApplicationCommandDataResolvable,
  BaseSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../services/registery.service";
import { Client } from "../../utils/Client";
import Discord from "discord.js";
import { Achievement } from "../../data/Achievements";
import emojis from "../../services/emojis.json";

export default new (class PingCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("help")
    .setDescription(
      "Unlock the full potential of your Discord server with our helpful commands!"
    );

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${bot.user?.username}'s Guidance Center`,
        iconURL: bot.user?.displayAvatarURL({ forceStatic: false }),
      })
      .setColor(Colors.Blurple)
      .setDescription(
        `> ${emojis.un.reply} Elevate your server experience with our cutting-edge bot featuring lockdown, leveling, welcoming and advanced auto-moderation features - "the ultimate administration tool."`
      );

    const selectMenu = new BaseSelectMenuBuilder({
      custom_id: "guide",
      placeholder: "Select a guide to get started with the bot.",
      type: 3,
      options: [
        {
          label: "Commands",
          description:
            "Unleash the full power of your server with our sleek and modern Discord bot commands guide.",
          value: "commands-guide",
          emoji: {
            name: "BotFlag",
            id: "936868646515535932",
          },
        },
        {
          label: "Statistics",
          description:
            "Statistics is a branch of mathematics that deals with the collection.",
          value: "stats-guide",
          emoji: {
            name: "icons_growth",
            id: "1043334722249568328",
          },
        },
        {
          label: "Growing",
          description: "Gives you advice on growing your server.",
          value: "growing-guide",
          emoji: {
            name: "icons_growth",
            id: "1043334722249568328",
          },
        },
      ],
    });

    const buttons = [
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Support Server")
        .setURL("https://discord.gg/F53ZZkTB")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Vote For Aja")
        .setURL("https://discord.gg/F53ZZkTB")
        .setDisabled(true),
    ];

    await interaction.followUp({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(buttons),
        new ActionRowBuilder<any>().addComponents(selectMenu),
      ],
    });
  };
})();
