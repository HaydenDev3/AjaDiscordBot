import DJS, { EmbedBuilder } from "discord.js";
import fs from "fs";
import { bot } from ".";
import { Achievement } from "./data/Achievements";
import { SavedGuild } from "./data/guild";
import Log from "./utils/Log";

export namespace Discord {
    export interface Event {
        on: keyof DJS.ClientEvents;
        run: (...args: any[]) => void;
    }
      
    export function registerEvents() {
        try {
          fs.readdirSync(`${__dirname}/services/events/`).forEach(async (dir) => {
            const events = fs
              .readdirSync(`${__dirname}/services/events/${dir}/`)
              .filter((file) => file.endsWith(".ts"));
      
            for (const file of events) {
              const event = (await import(`${__dirname}/services/events/${dir}/${file}`))?.default;
              if (!event.on) return;
      
              bot.on(event?.on, event.run.bind(event));
            }
          });
        } catch (err: any) {
          console.log(new TypeError(err));
        }
    }

    export interface SlashCommand {
        data:
          | DJS.SlashCommandBuilder
          | DJS.ContextMenuCommandBuilder
          | DJS.ApplicationCommandDataResolvable
          | DJS.ApplicationCommandData;
        execute: ({
          bot,
          interaction,
          args,
        }: {
          bot: DJS.Client;
          interaction: DJS.ChatInputCommandInteraction;
          args?: any[];
        }) => void;
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
              const pull = (await import(`./commands/${dir}/${file}`))?.default;
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

    export interface Command {
        name: string;
        description?: string;
        aliases?: string[];
        permissions?: DJS.PermissionFlags[];
        cooldown?: number;
      
        run: (...args: any[]) => void;
    }
      

    export class CommandHandler {
        private commands: Map<string, Command> = new Map<string, Command>();
      
        constructor() {
          Log.info(`Loaded: ${this.commands.size} Commands`);
          return this;
        }
      
        addCommand(command: Command) {
          this.commands.set(command.name, command);
          command.aliases?.forEach((alias: string) => this.commands.set(alias, command));
        }
      
        async handle(message: DJS.Message) {
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

    export function quicksort<T>(
      arr: T[],
      low: number,
      high: number,
      compareFn: (a: T, b: T) => number
    ): void {
      if (low < high) {
        let pivotIndex = partition(arr, low, high, compareFn);
        quicksort(arr, low, pivotIndex, compareFn);
        quicksort(arr, pivotIndex + 1, high, compareFn);
      }
    }
    
    export function partition<T>(
      arr: T[],
      low: number,
      high: number,
      compareFn: (a: T, b: T) => number
    ): number {
      let pivot = arr[low];
      let leftwall = low;
    
      for (let i = low + 1; i <= high; i++) {
        if (compareFn(arr[i], pivot) < 0) {
          leftwall++;
          [arr[i], arr[leftwall]] = [arr[leftwall], arr[i]];
        }
      }
    
      [arr[low], arr[leftwall]] = [arr[leftwall], arr[low]];
      return leftwall;
    }
    
    const buttonEmojis = ["⏮️", "⬅️", "➡️", "⏭️"];
    
    export async function createReactPagination(
      message: DJS.Message,
      pages: string[],
      currentPage = 0,
      timeout = 30000
    ): Promise<void> {
      const embed = new EmbedBuilder()
        .setDescription(pages[currentPage])
        .setFooter({ text: `Page ${currentPage + 1} of ${pages.length}` });
    
      const msg = await message.channel.send({ embeds: [embed] });
      for (const emoji of buttonEmojis) {
        await msg.react(emoji);
      }
    
      const filter = (reaction: DJS.MessageReaction, user: DJS.User) =>
        buttonEmojis.includes(reaction.emoji.name as any) &&
        user.id === message.author.id;
      const collector = msg.createReactionCollector({ filter, time: timeout });
    
      collector.on("collect", async (reaction: DJS.MessageReaction) => {
        if (reaction.emoji.name === "⏮️") {
          currentPage = 0;
        } else if (reaction.emoji.name === "⬅️") {
          currentPage = Math.max(currentPage - 1, 0);
        } else if (reaction.emoji.name === "➡️") {
          currentPage = Math.min(currentPage + 1, pages.length - 1);
        } else if (reaction.emoji.name === "⏭️") {
          currentPage = pages.length - 1;
        }
        embed.setTitle(`Page ${currentPage + 1} of ${pages.length}`);
        embed.setDescription(pages[currentPage]);
        msg.edit({ embeds: [embed] });
      });
    
      collector.on("end", () => {
        msg.reactions.removeAll();
      });
    }    
}