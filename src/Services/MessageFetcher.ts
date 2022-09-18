import { Collection, Message, TextBasedChannel } from "discord.js";

interface GetMessagesResults {
  messages: Message[];
  totalParsed: number;
}

export class MessageFetcher {
  static async getAllMessages(
    channel: TextBasedChannel,
    condition: (message: Message) => boolean,
    dateLimit: Date
  ): Promise<GetMessagesResults> {
    let allMessages: Message[] = [];
    let totalParsed = 0;

    // get first message
    let startFromMessage = (
      (await channel.messages.fetch({
        limit: 1,
      })) as Collection<string, Message>
    ).first();

    // return early if there are somehow no messages found
    if (!startFromMessage) {
      return { messages: [], totalParsed: 0 };
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
        before: startFromMessage.id,
      })) as Collection<string, Message>;

      totalParsed += messages.filter((m) => m.createdAt > dateLimit).size;

      // add all valid items to all messages
      allMessages = allMessages.concat(
        ...messages
          .filter((m) => condition(m) && m.createdAt > dateLimit)
          .values()
      );

      // get new earliest message
      startFromMessage = messages.last();
    }

    return { messages: allMessages, totalParsed };
  }
}
