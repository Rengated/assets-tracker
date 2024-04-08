import { RestClientV5 } from "bybit-api";

class Bybit {
  constructor() {
    this.client = new RestClientV5({
      key: process.env.BYBIT_API_KEY,
      secret: process.env.BYBIT_API_KEY_SECRET,
      testnet: false,
      enable_time_sync: true,
    });
  }

  async getPositions() {
    const response = await this.client.getPositionInfo({
      category: "linear",
      settleCoin: "USDT",
    });

    const positions = response.result.list.map((pos) => ({
      symbol: pos.symbol,
      leverage: pos.leverage,
      unrealisedPnl: pos.unrealisedPnl,
      markPrice: pos.markPrice,
      avgPrice: pos.avgPrice,
    }));

    return positions;
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
