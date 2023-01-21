import Event from "../../../utils/Event";
import AntiSpamService from "../../../modules/autoMod/AntiSpam.handler";
import Discord, { ClientEvents } from "discord.js";
import { bot } from "../../..";

export const antiSpamService = new AntiSpamService(bot);

export default new (class AntiSpamHandler implements Event {
  on: keyof ClientEvents = "messageCreate";
  run = async (message: Discord.Message) =>
    await antiSpamService.handleMessage(message);
})();
