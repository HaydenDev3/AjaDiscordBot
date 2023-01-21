import { ClientEvents, GuildMember, Interaction } from "discord.js";
import { bot } from "../../..";
import { GuildDocument, SavedGuild } from "../../../data/guild";
import Event from "../../../utils/Event";

export interface IRaid {
  userId: string;
  date: Date;
}

export const user = new Map<string, Date>();

export default new (class InteractionCreateEvent implements Event {
  on: keyof ClientEvents = "guildMemberAdd";

  run = async (member: GuildMember) => {
    const savedGuild = (await SavedGuild.findOne({
      _id: member.id,
    })) as GuildDocument;
    if (!savedGuild.antiRaid.toggle) return;

    user.set(member.id, new Date());

    setTimeout(() => {
      user.delete(member.id);
    }, 600000);

    /**
     * @INFO
     * Set interval for checking if the user size is greater then X if it is kick.
     */

    setInterval(() => {
      // Check the map for any users who have recently joined the server
      if (user.size >= 5) {
        // Trigger an anti-raid action if necessary
        // For example, mute all new members
        for (const [userID, joinDate] of user) {
          const raidMember = bot.guilds.cache
            .get(member.guild.id)
            ?.members.cache.get(userID) as GuildMember;
          raidMember.kick("Auto-Moderation kick member for Raiding.");
        }
      }
    }, 60000);
  };
})();
