import Discord from "discord.js";
import { commandHandler } from "../services/events/client/ready";
import { Client } from "../utils/Client";

commandHandler.addCommand({
  name: "emit",
  description: "Emit an event",
  aliases: ["emit_event", "emitter", "emot"],

  run: async (bot: Client, message: Discord.Message, args: string[]) => {
    if (message.author.id !== "622903645268344835") return;

    bot.emit(args[0], args.slice(1));
    return message.reply("Emitted Event!");
  },
});
