import Discord from "discord.js";
import { commandHandler } from "../services/events/client/ready";
import { Client } from "../utils/Client";
import vm from "vm";

commandHandler.addCommand({
  name: "emit",
  description: "Emit an event",

  run: async (bot: Client, message: Discord.Message, args: string[]) => {
    if (message.author.id !== "622903645268344835") return;

    const code = args.join(" ");
    if (!code) return;

    var output;
    try {
    } catch {}
  },
});
