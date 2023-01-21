import { bot } from "../../..";
import mongoose from "mongoose";
import Event from "../../../utils/Event";
import Log from "../../../utils/Log";
import Discord, { Guild } from "discord.js";
import { Achievement } from "../../../data/Achievements";

export default new (class ReadyHandler implements Event {
  on: keyof Discord.ClientEvents = "guildDelete";

  run = async (guild: Guild) => {
    const owner = await guild.members.fetch(guild.ownerId);
    // Add the achievement for adding the bot to the guild
    await Achievement.deleteOne({
      userId: owner.user.id,
      achievementName: "Bot Adder",
    });
  };
})();
