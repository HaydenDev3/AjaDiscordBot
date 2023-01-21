import { Client, Guild, Message } from "discord.js";
import mongoose from "mongoose";
import { bot } from "../..";
import { GuildDocument, SavedGuild } from "../../data/guild";

export default class AntiSpamService {
  private messageThreshold!: number;
  private timeThreshold!: number;
  private action!: string;
  private messageCount: Map<string, number>;
  private messageTime: Map<string, number>;

  constructor(private client: Client) {
    this.messageCount = new Map();
    this.messageTime = new Map();
  }

  async handleMessage(message: Message) {
    if (message.author.id === bot.user?.id) return;
    const savedGuild =
      (await SavedGuild.findOne({ _id: message.guild?.id })) ||
      ((await SavedGuild.create({ _id: message.guild?.id })) as GuildDocument);
    if (savedGuild && savedGuild.antiSpam.toggle) {
      this.messageThreshold = savedGuild.antiSpam.messageThreshold;
      this.timeThreshold = savedGuild.antiSpam.timeThreshold;
      this.action = savedGuild.antiSpam.action;
    }

    const userId = message.author.id;
    if (!this.messageCount.has(userId)) {
      this.messageCount.set(userId, 0);
      this.messageTime.set(userId, Date.now());
    }
    this.messageCount.set(userId, this.messageCount.get(userId)! + 1);

    const currentTime = Date.now();
    const timePassed = currentTime - this.messageTime.get(userId)!;
    if (timePassed > this.timeThreshold) {
      this.messageCount.set(userId, 1);
      this.messageTime.set(userId, currentTime);
    } else if (this.messageCount.get(userId)! >= this.messageThreshold) {
      this.handleAction(message);
      this.messageCount.set(userId, 0);
      this.messageTime.set(userId, currentTime);
    }
  }

  private handleAction(message: Message) {
    switch (this.action) {
      case "warn":
        message.channel.send(
          `:warning: ${message.author.toString()}, please do not spam.`
        );
        break;
      case "mute":
        // Code to mute the user
        break;
      case "Kick":
        // Code to kick the user
        break;
      case "Ban":
        // Code to ban the user
        break;
      default:
        break;
    }
  }
}
