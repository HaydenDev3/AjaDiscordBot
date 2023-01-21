import Discord, { Collection, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
config({ path: ".env" });

export class Client extends Discord.Client {
  public commands = new Collection<string, any>();
  public slashCommands = new Collection<string, any>();
  public arrayOfCommands: Array<any> = [];

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }
}
