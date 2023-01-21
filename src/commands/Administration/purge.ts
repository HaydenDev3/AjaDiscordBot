import {
  BaseChannel,
  Channel,
  ChatInputCommandInteraction,
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
import { SlashCommand } from "../../services/registery.service";
import { Client } from "../../utils/Client";

export default new (class PurgeCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("delete")
    .setDescription(
      "Deletes a specified number of messages in the current channel"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption((option: SlashCommandNumberOption) =>
      option
        .setName("amount")
        .setDescription("The number of messages to delete.")
        .setRequired(true)
    );

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const channel = interaction.channel as TextChannel;

    // Get the amount of messages to delete from the command options
    const amount = interaction.options.getNumber("amount");

    // Delete the messages in the channel
    await channel.bulkDelete(amount as number);
  };
})();
