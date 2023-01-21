import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  APIApplicationCommandOptionChoice,
  APIEmbed,
  BaseChannel,
  BaseSelectMenuBuilder,
  Channel,
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  ComponentType,
  EmbedBuilder,
  Guild,
  GuildChannel,
  GuildMember,
  PermissionFlagsBits,
  Role,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandNumberOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  SlashCommandUserOption,
  TextChannel,
  User,
  UserResolvable,
} from "discord.js";
import { GuildDocument, SavedGuild } from "../../data/guild";
import { SlashCommand } from "../../services/registery.service";
import { Client } from "../../utils/Client";
import emojis from "../../services/emojis.json";

export default new (class AntiLinkCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("Setup the anti-link system on your server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName("log")
        .setDescription("Setup the logging channel")
        .addChannelOption((ch: SlashCommandChannelOption) =>
          ch
            .setName("channel")
            .setRequired(true)
            .setDescription("Select the channel")
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub.setName("toggle").setDescription("Toggle the anti-link system.")
    )
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName(`whitelist`)
        .setDescription(`Whitelist a link`)
        .addStringOption((opt: SlashCommandStringOption) =>
          opt
            .setName("link")
            .setDescription("Whitelist this link")
            .setRequired(true)
        )
    )
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName(`embed`)
        .setDescription(`Customize the logging embed`)
        .addStringOption((opt: SlashCommandStringOption) =>
          opt.setName("title").setDescription("Set the title").setRequired(true)
        )
        .addStringOption((opt: SlashCommandStringOption) =>
          opt
            .setName("description")
            .setDescription("Set the description")
            .setRequired(false)
        )
        .addStringOption((opt: SlashCommandStringOption) =>
          opt
            .setName("field1n")
            .setDescription("Set field1 name.")
            .setRequired(false)
        )
        .addStringOption((opt: SlashCommandStringOption) =>
          opt
            .setName("field1v")
            .setDescription("Set the field1 value")
            .setRequired(false)
        )
        .addStringOption((opt: SlashCommandStringOption) =>
          opt
            .setName("color")
            .setDescription("Set the embed color")
            .setRequired(false)
            .addChoices(
              {
                name: "Blue",
                value: "blue",
              },
              {
                name: "Blurple",
                value: "blurple",
              },
              {
                name: "Black",
                value: "black",
              },
              {
                name: "Purple",
                value: "purple",
              },
              {
                name: "Tan",
                value: "tan",
              },
              {
                name: "Dark Blue",
                value: "darkblue",
              },
              {
                name: "Dark Purple",
                value: "darkpurple",
              },
              {
                name: "Dark Red",
                value: "darkred",
              },
              {
                name: "Pink",
                value: "pink",
              },
              {
                name: "Red",
                value: "red",
              }
            )
        )
    );

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const savedGuild =
      (await SavedGuild.findOne({ _id: interaction.guild?.id })) ||
      (await SavedGuild.create({ _id: interaction.guild?.id }));

    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "toggle": {
        savedGuild.antiLink.toggle = !savedGuild.antiLink.toggle;
        await savedGuild.save();

        await interaction.followUp({
          embeds: [
            {
              title: `${
                savedGuild.antiLink.toggle ? "Disabled" : "Enabled"
              } the Anti-Link system.`,
              color: Colors.Blurple,
              description: `> ${
                emojis.un.reply
              } Use the command again in-order to turn ${
                savedGuild.antiLink.toggle ? "off" : "on"
              } the module.`,
              thumbnail: {
                url: interaction.guild?.iconURL({ forceStatic: false }),
              },
            } as APIEmbed,
          ],
        });
        break;
      }
      case "whitelist": {
        break;
      }
    }
  };
})();
