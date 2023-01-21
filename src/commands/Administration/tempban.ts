import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandUserOption,
  User,
  UserResolvable,
} from "discord.js";
import { SlashCommand } from "../../services/registery.service";
import { Client } from "../../utils/Client";

export default new (class TempBanCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Temporarly bans a member thats mentioned")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option: SlashCommandUserOption) =>
      option
        .setName("user")
        .setDescription("Mention a user to temporarly ban them.")
        .setRequired(true)
    );

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const guild = interaction.guild as Guild;
    const taggedUser = interaction.options.getUser("user") as any;

    try {
      await guild.members.ban(taggedUser, { reason: "Temporary ban" });
      interaction.followUp(`${taggedUser.tag} has been temporarily banned.`);
      setTimeout(async () => {
        await guild.members.unban(
          taggedUser as UserResolvable,
          "Ban time expired"
        );
        interaction.followUp(`${taggedUser.tag} ban has been lifted.`);
      }, 5000);
    } catch (error) {
      console.error(error);
      interaction.followUp("There was an error tempbanning the user.");
    }
  };
})();
