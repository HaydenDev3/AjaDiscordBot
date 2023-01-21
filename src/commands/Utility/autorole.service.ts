import {
  ApplicationCommandData,
  ApplicationCommandDataResolvable,
  ChatInputCommandInteraction,
  Colors,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandRoleOption,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../services/registery.service";
import { Client } from "../../utils/Client";
import Discord from "discord.js";
import { GuildDocument, SavedGuild } from "../../data/guild";

export default new (class AutoRoleCommand implements SlashCommand {
  data = new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Manage all your auto join-roles.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName("add")
        .setDescription("Add a auto join-role to the list.")
        .addRoleOption((option: SlashCommandRoleOption) =>
          option
            .setName("role")
            .setDescription("Add a role to the autorole list.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
      sub
        .setName("remove")
        .setDescription("Remove an auto join-role from the list.")
        .addRoleOption((option: SlashCommandRoleOption) =>
          option
            .setName("role")
            .setDescription("Remove an role from the autorole list.")
            .setRequired(true)
        )
    );

  execute = async ({
    bot,
    interaction,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const savedGuild = (await SavedGuild.findOne({
      _id: interaction.guild?.id,
    })) as GuildDocument;

    switch (interaction.options.getSubcommand()) {
      case "add":
        {
          const role = (await interaction.options.getRole(
            "role"
          )) as Discord.Role;

          if (savedGuild.autoRole) {
            if (savedGuild.autoRole.roleIds.length < 10) {
              savedGuild.autoRole.roleIds.push(role.id);
              await savedGuild.save();
              interaction.followUp(
                `The role ${role.name} has been added to the auto-join roles.`
              );
            } else {
              interaction.followUp(
                "The maximum limit of 10 roles has been reached."
              );
            }
          }
        }
        break;
      case "remove":
        {
          const role = (await interaction.options.getRole(
            "role"
          )) as Discord.Role;

          if (savedGuild) {
            const roleIndex = savedGuild.autoRole.roleIds.indexOf(role.id);
            if (roleIndex !== -1) {
              savedGuild.autoRole.roleIds.splice(roleIndex, 1);
              await savedGuild.save();
              interaction.followUp(
                `The role ${role.name} has been removed from the auto-join roles.`
              );
            } else {
              interaction.followUp(
                `The role ${role.name} is not in the auto-join roles.`
              );
            }
          }
        }
        break;
    }
  };
})();
