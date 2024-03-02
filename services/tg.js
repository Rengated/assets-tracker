import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import Spot from "./coinmarketcap.js";
import Bybit from "./bybit.js";

export const Bot = new TelegramBot(process.env.BOT_API_KEY, {
  polling: true,
});

Bot.on("text", async (message) => {
  if (message.text == "/stats" && message.chat.id == "441931183") {
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

    const finalMessage =
      messageStatsBybit +
      "\n" +
      messageStatsSpot +
      `\n\n Total Wallet Balance: ${(
        Number(statsBybit.totalBalance) + totalSpotBalance
      ).toFixed(2)}$` +
      `\n RUB: ${(
        (Number(statsBybit.totalBalance) + totalSpotBalance) *
        92
      ).toFixed(2)}р`;

    await Bot.sendMessage(message.chat.id, finalMessage);
  }
});
