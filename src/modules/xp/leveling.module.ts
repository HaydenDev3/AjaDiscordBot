import { ChannelType, Client, GuildMember, Message } from "discord.js";
import { bot } from "../..";
import { SavedMember } from "../../data/member";

export default class LevelingModule {
  constructor() {
    return this;
  }

  public async init() {
    bot.on("messageCreate", async (message: Message) => {
      if (message.author.bot) return; // ignore messages from bots
      if (message.channel.type !== ChannelType.GuildText) return; // ignore messages from non-text channels

      const userLevel = await SavedMember.findOne({
        _id: message.author.id,
      });

      if (!userLevel) {
        const newLevel = new SavedMember({
          _id: message.author.id,
        });

        await newLevel.save();
      } else {
        // Increment the user's exp and level if necessary
        userLevel.exp += Math.floor(Math.random() * 10) + 1;
        const requiredExp = userLevel.level * 100;
        if (userLevel.exp >= requiredExp) {
          userLevel.level++;
          userLevel.exp = 0;

          // Send a message to the user and the guild
          message.channel.send(
            `Congratulations ${message.author}! You have reached level ${userLevel.level}`
          );
        }

        await userLevel.save();
      }
    });
  }
}
