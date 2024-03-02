import { RestClientV5 } from "bybit-api";

class Bybit {
  constructor() {
    this.client = new RestClientV5({
      key: process.env.BYBIT_API_KEY,
      secret: process.env.BYBIT_API_KEY_SECRET,
      testnet: false,
    });
  }

  async getUnrealisedPnl() {
    const response = await this.client.getPositionInfo({
      category: "linear",
      settleCoin: "USDT",
    }).result.list;
  }

  async getAccountStats() {
    const response = await this.client.getWalletBalance({
      accountType: "UNIFIED",
    });

    const stats = response.result.list[0];

    return {
      totalBalance: stats.totalEquity,
      accountPnl: stats.totalPerpUPL,
      walletBalance: stats.totalWalletBalance,
    };
  }
}

export default new Bybit();
