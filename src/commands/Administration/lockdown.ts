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
  SlashCommandUserOption,
  TextChannel,
  User,
  UserResolvable,
} from "discord.js";
import { SlashCommand } from "../../services/registery.service";
import { Client } from "../../utils/Client";

export default new (class LockdownCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("Lockdown your server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addBooleanOption((option: SlashCommandBooleanOption) =>
      option
        .setName("lock")
        .setDescription(
          "Set whether or not you want the server to go on lockdown or unlock the server."
        )
        .setRequired(true)
    );

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const role = interaction.guild?.roles.everyone as Role;
    const channels = interaction.guild?.channels.cache;

    try {
      channels?.forEach((channel: any) => {
        if (interaction.options.getBoolean("lock") == false) {
          channel.permissionOverwrites.edit(role, { SendMessages: null });
          // channel.send("Channel unlocked. Everyone can send messages again.");
        } else {
          channel.permissionOverwrites.edit(role, { SendMessages: false });
          // channel.se("Channels locked down. No one can send messages.");
        }
      });
    } catch (err: any) {
      console.log(err.stack);
    }
  };
})();
