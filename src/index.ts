import "colors";

import { Client } from "./utils/Client";
import * as registery from "./services/registery.service";
import Log from "./utils/Log";

console.clear(); /** @INFO ClEARING THE CONSOLE. */
Log.info(
  "Contact the developer: hello@haydenf.cloud or hello@unbreakable.dev"
    .dim as any
);

export const bot = new Client();

registery.registerEvents();
export const slashCommands = new registery.SlashCommandHandler().init();

bot.login(process.env.BOT_TOKEN as string);
