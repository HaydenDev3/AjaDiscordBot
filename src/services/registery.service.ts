import {
  ApplicationCommand,
  ApplicationCommandData,
  ApplicationCommandDataResolvable,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import fs from "fs";
import { bot } from "..";
import { Achievement } from "../data/Achievements";
import { GuildDocument, SavedGuild } from "../data/guild";
import { Client } from "../utils/Client";
import Command from "../utils/Command";
import Log from "../utils/Log";

export function registerEvents() {
  try {
    fs.readdirSync(`${__dirname}/events/`).forEach(async (dir) => {
      const events = fs
        .readdirSync(`${__dirname}/events/${dir}/`)
        .filter((file) => file.endsWith(".ts"));

      for (const file of events) {
        const event = (await import(`./events/${dir}/${file}`))?.default;
        if (!event.on) return;

        bot.on(event?.on, event.run.bind(event));
      }
    });
  } catch (err: any) {
    console.log(new TypeError(err));
  }
}

export class SlashCommandHandler {
  public readonly commands: SlashCommand[] = [];

  constructor() {}

  public init() {
    fs.readdirSync(`./src/commands/`).forEach(async (dir) => {
      const commands = fs
        .readdirSync(`./src/commands/${dir}`)
        .filter((file) => file.endsWith(".ts"));

      for (const file of commands) {
        const pull = (await import(`../commands/${dir}/${file}`))?.default;
        if (!pull) return;

        bot.slashCommands.set(pull.data.name, pull);
        this.commands.push(pull.data);
      }
    });

    bot.on("ready", async () => {
      const guild = bot.guilds.cache.get("850132910865645609");
      if (!guild) return;

      guild.commands.set(this.commands as any[]);
      console.log(
        `Uploaded ${parseInt(
          this.commands.length as any
        ).toLocaleString()} (/) Slash Commands to Aja!`
      );
    });
  }
}

export interface SlashCommand {
  data:
    | SlashCommandBuilder
    | ContextMenuCommandBuilder
    | ApplicationCommandDataResolvable
    | ApplicationCommandData;
  execute: ({
    bot,
    interaction,
    args,
  }: {
    bot: Client;
    interaction: ChatInputCommandInteraction;
    args?: any[];
  }) => void;
}

export class CommandHandler {
  private commands: Map<string, Command> = new Map<string, Command>();

  constructor() {
    Log.info(`Loaded: ${this.commands.size} Commands`);
    return this;
  }

  addCommand(command: Command) {
    this.commands.set(command.name, command);
    command.aliases?.forEach((alias) => this.commands.set(alias, command));
  }

  async handle(message: Message) {
    if (message.author.bot || !message.guild?.available) return;

    const prefix = await this.getPrefix(message.guild.id as string);
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/g) as string[];
    const commandName = args.shift()?.toLowerCase() as string;
    const command = this.commands.get(commandName);

    if (command) {
      const achievement = await Achievement.findOne({
        userId: message.author.id,
        achievementName: "First Command",
      });
      if (!achievement) {
        // Add the achievement for running their first command
        await Achievement.create({
          userId: message.author.id,
          achievementName: "First Command",
          achievementDescription: "You ran your first command!",
          achievementDate: new Date(),
        });

        message.reply(
          'Congratulations, you have earned the "First Command" achievement!'
        );
      }

      await command.run(bot, message, args);
    } else return;
  }

  async getPrefix(guildId: string): Promise<string> {
    const savedGuild =
      (await SavedGuild.findOne({ _id: guildId })) ||
      (await SavedGuild.create({ _id: guildId }));
    return savedGuild ? savedGuild.prefix : "!";
  }
}
