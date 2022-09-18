import { Collection, Message, TextChannel } from "discord.js";

export class MessageFetcher {
  static async getAllMessages(
    channel: TextChannel,
    condition: (message: Message) => boolean,
    dateLimit: Date
  ): Promise<Message[]> {
    let allMessages: Message[] = [];

    // get first message
    let startFromMessage = (
      (await channel.messages.fetch({
        limit: 1,
      })) as Collection<string, Message>
    ).first();

    // return early if there are somehow no messages found
    if (!startFromMessage) {
      return [];
    }

    // if condition applies and we are not past date limit, add to array
    if (
      condition(startFromMessage) &&
      startFromMessage.createdAt >= dateLimit
    ) {
      allMessages = allMessages.concat([startFromMessage]);
    }

    // keep getting more messages until the target date is reached
    while (startFromMessage && startFromMessage.createdAt > dateLimit) {
      // get previous 100 messages
      const messages = (await channel.messages.fetch({
        limit: 100,
      })) as Collection<string, Message>;

      // add all valid items to all messages
      allMessages = allMessages.concat(
        ...messages
          .filter((m) => condition(m) && m.createdAt > dateLimit)
          .values()
      );

      // get new limit message
      startFromMessage = messages.last();
    }

    return allMessages;
  }
}
