import { ClientEvents, Guild, GuildMember } from "discord.js";
import { bot } from "../../..";
import { SavedInvite } from "../../../data/invite";
import Event from "../../../utils/Event";

export default new (class InviteLoggerHandler implements Event {
  on: keyof ClientEvents = "guildMemberAdd";

  run = async (guild: Guild, member: GuildMember) => {
    const invites = await guild.invites.fetch();
    const invite = invites.find((inv) => inv.inviter?.id === member.id);

    // Save the invite to the database
    if (invite) {
      const newInvite = new SavedInvite({
        guild: guild.id,
        code: invite.code,
      });
      await newInvite.save();
    }
    // Send the welcome message
    const channel = member;
    if (invite) {
      await channel.send(
        `Welcome to the server ${member.user.username}! You were invited by ${invite.inviter?.username} using the invite code: ${invite.code}`
      );
    } else {
      await channel.send(`Welcome to the server ${member.user.username}!`);
    }
  };
})();
