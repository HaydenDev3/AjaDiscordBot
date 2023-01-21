import { bot } from "../../..";
import mongoose from "mongoose";
import Event from "../../../utils/Event";
import Log from "../../../utils/Log";
import Discord, { Guild, GuildMember } from "discord.js";
import { Achievement } from "../../../data/Achievements";

export default new (class ReadyHandler implements Event {
  on: keyof Discord.ClientEvents = "guildCreate";

  run = async (guild: Guild) => {
    const owner = guild.members.cache.get(guild.ownerId) as GuildMember;
    const achievement = await Achievement.find({
      _id: owner.id,
      achievementName: "Bot Adder",
    });
    if (achievement) return;

    // Add the achievement for adding the bot to the guild
    await Achievement.create({
      userId: owner.id,
      achievementName: "Bot Adder",
      achievementDescription: "You added the bot to your guild!",
      achievementDate: new Date(),
    });
    // Send a message to the owner to notify them of the achievement

    owner.send("Congratulations, you have earned the 'Bot Adder' achievement!");
  };
})();
