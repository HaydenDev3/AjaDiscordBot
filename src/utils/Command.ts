import Eris from "eris";

export default interface Command {
  name: string;
  description?: string;
  aliases?: string[];
  permissions?: Eris.Permission[];
  cooldown?: number;

  run: (...args: any[]) => void;
}
