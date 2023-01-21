import { bot } from "../../..";
import mongoose from "mongoose";
import Event from "../../../utils/Event";
import Log from "../../../utils/Log";
import Discord, {
  AnySelectMenuInteraction,
  ComponentType,
  Guild,
  GuildMember,
} from "discord.js";
import os from "os";
import emojis from "../../emojis.json";

export default new (class ReadyHandler implements Event {
  on: keyof Discord.ClientEvents = "interactionCreate";

  run = async (interaction: AnySelectMenuInteraction) => {
    if (!interaction.customId?.includes("guide")) return;

    const [value] = interaction.values;

    switch (value) {
      case "commands-guide": {
        const embed = {
          title: "Guide for using commands.",
          color: Discord.Colors.Blurple,
          description: `> ${emojis.un.replycontinue} In-order to start unlocking the full potential of your **Discord Server**, you will first need to learn the way the modules work within **Aja**, **Aja** has a **leveling, Anti-Spam, Anti-Raid, Anti-Link, Anti-Scam, welcoming** modules, this are important to keeping your server secured.\n> ${emojis.un.replycontinue} Please be self aware that **Aja** upon launch could have more features added within the Security system of the bot.\n> ${emojis.un.reply} In-order to use **Aja's Slash Commands (/)**, you need to make sure you have the \`Use Application Commnads\` permission enabled, afterwards, you can go to the channel with it enabled and type \`/ping\` that will give you the bot ping.`,
          thumbnail: {
            url: bot.user?.displayAvatarURL({ forceStatic: false }),
          },
          fields: [
            {
              name: "Understanding Anti-Spam.",
              value: `> ${emojis.un.reply} Anti-spam features for Discord bots typically work by monitoring messages sent in a server, and identifying messages that appear to be spam based on certain characteristics. `,
            },
            {
              name: "Anti-Raid.",
              value: `> ${emojis.un.reply} An anti-raid system within a Discord bot is a set of features that are designed to prevent and mitigate the effects of server raids, which are coordinated efforts by multiple users to flood a server with messages, mentions, or voice calls in order to disrupt the normal functioning of the server.`,
            },
            {
              name: "Anti-Link",
              value: `> ${emojis.un.reply} An anti-link system in a Discord bot is a set of features that are designed to detect and prevent the posting of certain types of links in a server. This can include external links, shortened links, or links to known spam or malicious websites.`,
            },
            {
              name: "Anti-Scam",
              value: `> ${emojis.un.reply} An anti-scam system in a Discord bot is a set of features that are designed to detect and prevent scams within a server. Scams can take many forms, such as phishing, impersonation, or fraudulent activity.`,
            },
          ],
        } as Discord.APIEmbed;

        await interaction.reply({
          ephemeral: true,
          embeds: [embed],
        });
        break;
      }

      case "growing-guide": {
        const date = Date.now();

        const embed = {
          title: "Guide on Growing Your Discord Server.",
          color: Discord.Colors.Blurple,
          thumbnail: {
            url: bot.user?.displayAvatarURL({ forceStatic: false }),
          },
          footer: {
            text: "Good luck on your journey, mate!",
            icon_url: bot.user?.displayAvatarURL({ forceStatic: false }),
          },
          fields: [
            {
              name: "Promote your server.",
              value: `> ${emojis.un.reply} Share your server's invite link on social media, online forums, and other platforms where your target audience is active. You can also create a website for your server and include the invite link there.`,
              inline: false,
            },
            {
              name: "Create engaging content.",
              value: `> ${emojis.un.reply} Create channels and categories that are relevant to your target audience and encourage them to participate in discussions. You can also create events and activities that will keep your members engaged.`,
            },
            {
              name: "Network with other servers.",
              value: `> ${emojis.un.reply} Reach out to other servers in your niche and collaborate with them to promote each other's servers. You can also join server listing sites and submit your server there.`,
              inline: false,
            },
            {
              name: "Partner with influencers.",
              value: `> ${emojis.un.reply} Reach out to influencers in your niche and ask them to promote your server to their audience. This can be a great way to attract new members.`,
              inline: false,
            },
            {
              name: "Create a welcoming community.",
              value: `> ${emojis.un.reply} Make sure to create a positive and welcoming environment for your members. Respond to messages, help out new members, and encourage others to do the same.`,
              inline: false,
            },
            {
              name: "Use Bots",
              value: `> ${emojis.un.reply} Discord bots can help you with various tasks such as automating certain tasks, adding new features to the server.`,
              inline: false,
            },
          ],
        } as Discord.APIEmbed;

        await interaction.reply({ ephemeral: true, embeds: [embed] });
        break;
      }

      case "stats-guide": {
        const guilds = bot.guilds.cache.size;
        const users = bot.users.cache.size;
        const channels = bot.channels.cache.size;
        const osInfo = os.platform();
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        );
        const discordJsVersion = Discord.version;
        const osUptime = os.uptime();

        const embed = {
          title: "Statistics for Aja. :clap:",
          color: Discord.Colors.Blurple,
          fields: [
            {
              name: "Bot Information",
              value: `> ${emojis.un.replycontinue} Guilds \`${guilds}\`\n> ${emojis.un.replycontinue} Users \`${users}\`\n> ${emojis.un.replycontinue} Channels \`${channels}\`\n> ${emojis.un.reply} Discord.js Version \`${discordJsVersion}\` `,
              inline: true,
            },
            {
              name: "Operating Information",
              value: `> ${emojis.un.replycontinue} System ${osInfo}\n> ${
                emojis.un.replycontinue
              } System Uptime ${osUptime.toExponential()}\n> ${
                emojis.un.reply
              } Ram Usage ${ramUsage} MB`,
              inline: true,
            },
          ],
        } as Discord.APIEmbed;

        await interaction.reply({ ephemeral: true, embeds: [embed] });
        break;
      }
    }
  };
})();
