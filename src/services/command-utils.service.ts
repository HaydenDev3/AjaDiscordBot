import { EmbedBuilder, Message, MessageReaction, User } from "discord.js";

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
  message: Message,
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

  const filter = (reaction: MessageReaction, user: User) =>
    buttonEmojis.includes(reaction.emoji.name as any) &&
    user.id === message.author.id;
  const collector = msg.createReactionCollector({ filter, time: timeout });

  collector.on("collect", async (reaction) => {
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
