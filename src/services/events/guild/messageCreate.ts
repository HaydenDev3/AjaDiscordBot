import { ClientEvents, Message } from "discord.js";
import { bot } from "../../..";
import { GuildDocument, SavedGuild } from "../../../data/guild";
import Event from "../../../utils/Event";
import { commandHandler } from "../client/ready";

export default new (class MessageHandler implements Event {
  on: keyof ClientEvents = "messageCreate";

  run = (message: Message) => commandHandler.handle(message);
})();
