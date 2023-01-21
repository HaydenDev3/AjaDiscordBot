import { ClientEvents, Interaction } from "discord.js";
import { bot, slashCommands } from "../../..";
import Event from "../../../utils/Event";

export default new (class InteractionCreateEvent implements Event {
  on: keyof ClientEvents = "interactionCreate";

  run = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = bot.slashCommands.get(interaction.commandName);
    if (!cmd) return;

    await interaction.deferReply({}).catch(() => {});

    let args = [] as any[];
    await cmd.execute({ bot, interaction, args });
  };
})();
