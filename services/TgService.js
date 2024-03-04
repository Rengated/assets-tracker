import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import Spot from "./CoinMarketcapService.js";
import Bybit from "./BybitService.js";

export const Bot = new TelegramBot(process.env.BOT_API_KEY, {
  polling: true,
});

const commands = [
  {
    command: "/stats",
    description: "Получить статистику по аккаунту",
  },
  {
    command: "/opened_positions",
    description: "Получить открытые позиции",
  },
  {
    command: "/help",
    description: "Раздел помощи",
  },
];

Bot.setMyCommands(commands);

Bot.on("text", async (message) => {
  if (message.chat.id != "441931183") {
    Bot.sendMessage(message.chat.id, "Not Authorized", {
      reply_markup: { keyboard: [] },
    });
    return;
  }

  if (message.text == "/stats") {
    const statsBybit = await Bybit.getAccountStats();
    const messageStatsBybit =
      `-----Bybit------------\n` +
      `totalBalance: ${Number.parseFloat(statsBybit.totalBalance).toFixed(
        2
      )}$\n` +
      `walletBalance: ${Number.parseFloat(statsBybit.walletBalance).toFixed(
        2
      )}$\n` +
      `accountPnl: ${Number.parseFloat(statsBybit.accountPnl).toFixed(2)}$`;

    const spotAssets = await Spot.getAssets();

    let messageStatsSpot =
      "\n -----SPOT-----------\n" +
      spotAssets
        .map((item) => {
          return `${item.symbol} balance: ${Number.parseFloat(
            item.totalPrice
          ).toFixed(2)}$`;
        })
        .join("\n");

    const totalSpotBalance = Object.values(spotAssets).reduce(
      (t, { totalPrice }) => t + totalPrice,
      0
    );
    messageStatsSpot += `\n -----------------------Total: ${totalSpotBalance.toFixed(
      2
    )}$`;

    const rubRate = await Spot.getUsdtPrice();

    const messageResponse =
      messageStatsBybit +
      "\n" +
      messageStatsSpot +
      `\n\n Total Wallet Balance: ${(
        Number(statsBybit.totalBalance) + totalSpotBalance
      ).toFixed(2)}$` +
      `\n RUB RATE: ${rubRate.toFixed(2)}р\n PRICE: ${(
        (Number(statsBybit.totalBalance) + totalSpotBalance) *
        rubRate
      ).toFixed(2)}р`;

    await Bot.sendMessage(message.chat.id, messageResponse);
  }

  if (message.text == "/opened_positions") {
    const positions = await Bybit.getPositions();
    const messageResponse = positions
      .map(
        (pos) =>
          `📌${pos.symbol} x${pos.leverage} \n💵pnl: ${pos.unrealisedPnl}$ \n ✖  in: ${pos.avgPrice}$  \n ✖  market: ${pos.markPrice}$ \n`
      )
      .join("\n");
    Bot.sendMessage(message.chat.id, messageResponse, {});
  }
});
