import { Collection, Message, TextBasedChannel } from "discord.js";

interface GetMessagesResults {
  messages: Message[];
  totalParsed: number;
}

export class MessageFetcher {
  /**
   * Return all messages from a channel within certain conditions. Will be slow when handling more
   * than a few hundred messages, as multiple API calls are needed.
   * @param channel The channel to fetch from
   * @param dateLimit The oldest date to return messages from
   * @param filterPredicate (optional) A filter predicate which decides which messages to include.
   * More memory efficient than filtering after receiving results.
   * @returns the filtered messages
   */
  static async getAllMessages(
    channel: TextBasedChannel,
    dateLimit: Date,
    filterPredicate?: (message: Message) => boolean
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
      !filterPredicate ||
      (filterPredicate(startFromMessage) &&
        startFromMessage.createdAt >= dateLimit)
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
          .filter(
            (m) =>
              (!filterPredicate || filterPredicate(m)) &&
              m.createdAt > dateLimit
          )
          .values()
      );

      // get new earliest message
      startFromMessage = messages.last();
    }

    return { messages: allMessages, totalParsed };
  }
}
