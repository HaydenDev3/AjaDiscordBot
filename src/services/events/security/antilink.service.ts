import Event from "../../../utils/Event";
import AntiSpamService from "../../../modules/autoMod/AntiSpam.handler";
import Discord, { ClientEvents } from "discord.js";
import { bot } from "../../..";
import { SavedGuild } from "../../../data/guild";

export const antiSpamService = new AntiSpamService(bot);

export default new (class AntiSpamHandler implements Event {
  on: keyof ClientEvents = "messageCreate";
  run = async (message: Discord.Message) => {
    if (!message.guild) return;
    const server = await SavedGuild.findOne({ _id: message.guild.id });
    if (server && server.antiLink.toggle) {
      // Check if the message contains a link
      if (message.content.match(/https?:\/\/[^\s]+/)) {
        // Check if the link is whitelisted
        if (!server.antiLink.whitelistedLinks.includes(message.content)) {
          // Delete the message and send a warning to the user
          message.delete();
          const msg = (await message.reply(
            "Sorry, but posting links is not allowed on this server."
          )) as Discord.Message;
          setTimeout(async () => {
            await msg.delete();
          }, 10000);
        }
      }
    }
  };
})();
