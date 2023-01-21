import { bot } from "../../..";
import mongoose from "mongoose";
import Event from "../../../utils/Event";
import Log from "../../../utils/Log";
import {
  ActivityType,
  ClientEvents,
  OAuth2Scopes,
  PermissionFlagsBits,
} from "discord.js";

import { CommandHandler, SlashCommandHandler } from "../../registery.service";
import LevelingModule from "../../../modules/xp/leveling.module";
import { Permission } from "eris";
export const commandHandler = new CommandHandler();

export const botInvite = bot.generateInvite({
  permissions: [
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.CreateInstantInvite,
    PermissionFlagsBits.CreatePrivateThreads,
    PermissionFlagsBits.CreatePublicThreads,
    PermissionFlagsBits.ManageEmojisAndStickers,
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.ChangeNickname,
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ViewAuditLog,
    PermissionFlagsBits.UseExternalEmojis,
    PermissionFlagsBits.UseExternalStickers,
    PermissionFlagsBits.UseEmbeddedActivities,
  ],
  scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
});

export default new (class ReadyHandler implements Event {
  on: keyof ClientEvents = "ready";

  constructor(private levels = new LevelingModule()) {}

  run = async () => {
    Log.info(`It's Live!`);
    await this.levels.init();

    let quotes = [
      "“The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.” - Helen Keller",
      "“It does not matter how slowly you go as long as you do not stop.” - Confucius",
      "“The only way to do great work is to love what you do.” - Steve Jobs",
      "“The only limit to our realization of tomorrow will be our doubts of today.” - Franklin D. Roosevelt",
      "“Believe you can and you're halfway there.” - Theodore Roosevelt",
      "“Happiness is not something ready made. It comes from your own actions.” - Dalai Lama",
      "“Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.” - Albert Schweitzer",
      "“The best revenge is massive success.” - Frank Sinatra",
      "“Success is not final, failure is not fatal: It is the courage to continue that counts.” - Winston Churchill",
      "“I can't change the direction of the wind, but I can adjust my sails to always reach my destination.” - Jimmy Dean",
    ];
    let quoteIndex = 0;
    setInterval(() => {
      bot.user?.setActivity({
        name: quotes[quoteIndex],
        type: ActivityType.Playing,
      });
      quoteIndex++;
      if (quoteIndex >= quotes.length) {
        quoteIndex = 0;
      }
    }, 10000);

    mongoose.connect(process.env.MONGOOSE_ATLAS as string, {
      ignoreUndefined: false,
    });

    mongoose.connection.on("error", (error) => {
      console.error(`Error connecting to MongoDB: ${error}`);
    });
  };
})();
