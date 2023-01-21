import { ClientEvents } from "discord.js";

export default interface Event {
  on: keyof ClientEvents;
  run: (...args: any[]) => void;
}
