import mongoose from "mongoose";

export class AntiSpamModule {
  toggle: boolean = false;
  messageThreshold: number = 0;
  timeThreshold: number = 0;
  action: AntiSpamAction = "warn";
}

export class AutoRoleModule {
  toggle: boolean = false;
  roleIds: string[] = [];
}

export class AntiLinkModule {
  toggle: boolean = false;
  channel: string = "";
  whitelistedLinks: string[] = [];
}

export class AntiRaidModule {
  toggle: boolean = false;
  channel: string = "";
}

const guildSchema = new mongoose.Schema({
  _id: String,
  prefix: { default: "!", type: String },
  antiSpam: { default: new AntiSpamModule(), type: Object },
  autoRole: { default: new AutoRoleModule(), type: Object },
  antiRaid: { default: new AntiRaidModule(), type: Object },
  antiLink: { default: new AntiLinkModule(), type: Object },
});

export type AntiSpamAction = "warn" | "mute" | "kick" | "Ban";

export interface GuildDocument extends mongoose.Document {
  _id: string;
  prefix: string;
  antiSpam: AntiSpamModule;
  autoRole: AutoRoleModule;
  antiRaid: AntiRaidModule;
  antiLink: AntiLinkModule;
}

export interface SnowflakeEntity {
  id: string;
}

export const SavedGuild = mongoose.model<GuildDocument>("guild", guildSchema);
