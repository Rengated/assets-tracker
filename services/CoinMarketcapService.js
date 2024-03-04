import "dotenv/config";
import { getSymbols } from "../utils.js";
class CoinMarketCap {
  constructor() {
    this.callApi = async (url) => {
      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/${url}`,
        {
          method: "GET",
          headers: {
            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
          },
        }
      );
      return response.json();
    };
  }

  async getAssets() {
    const symbols = await getSymbols();
    const query = symbols.map((symbol) => symbol.symbol).join(",");
    const response = await this.callApi(
      `cryptocurrency/quotes/latest?convert=USDT&symbol=${query}`
    );
    const parseData = Object.entries(response.data).map((item) => ({
      symbol: item[1].symbol,
      Price: item[1].quote.USDT.price,
    }));

    return parseData.map((item) => {
      const asset = symbols.find((value) => value.symbol == item.symbol);
      return {
        symbol: item.symbol,
        totalPrice: asset.count * item.Price,
        count: asset.count,
      };
    });
  }

  async getUsdtPrice() {
    const response = await this.callApi(
      `cryptocurrency/quotes/latest?convert=RUB&symbol=USDT`
    );

    return response.data.USDT.quote.RUB.price;
  }
}

export default new CoinMarketCap();
