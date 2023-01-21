import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  BaseChannel,
  BaseSelectMenuBuilder,
  Channel,
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
  SlashCommandNumberOption,
  SlashCommandUserOption,
  TextChannel,
  User,
  UserResolvable,
} from "discord.js";
import { GuildDocument, SavedGuild } from "../../data/guild";
import { SlashCommand } from "../../services/registery.service";
import { Client } from "../../utils/Client";

export const toggleChecker = (option: any, text: string) => {
  const enabledEmoji = "<:icons_on:1013381184530685972>";
  const disabledEmoji = "<:icons_off:1013381200661971005>";

  return `${option ? enabledEmoji : disabledEmoji} ${text}`;
};

export const labelToggleChecker = (option: any) => {
  const enabledEmoji = "<:icons_on:1013381184530685972>";
  const disabledEmoji = "<:icons_off:1013381200661971005>";

  return `${option ? "Enabled" : "Disabled"}`;
};

const enabledEmojiID = "1013381184530685972";
const disabledEmojiID = "1013381200661971005";

export default new (class AntiSpamCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("antispam")
    .setDescription("Setup the anti-spam system on your server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

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
  };
})();
