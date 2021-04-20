import { Anchor, columbus4, AddressProviderFromJson, MARKET_DENOMS, OperationGasParameters } from "@anchor-protocol/anchor.js";
import { LCDClient, Dec, Int } from "@terra-money/terra.js";
import "dotenv/config";
import { getCurrentApy } from "./terra";

interface EpochStateResponse {
    exchange_rate: string;
    aterra_supply: string;
}
// https://lcd.terra.dev/swagger-ui/#/
const myAddress = process.env.TERRA_ADDR;
if(!myAddress) throw new Error(`Undefined .env value: 'TERRA_ADDR'`)
const market = "uusd";
const addressProvider = new AddressProviderFromJson(columbus4);
const lcd = new LCDClient({ URL: 'https://lcd.terra.dev', chainID: 'columbus-4' });
//@ts-ignore
const marketContractAddress = addressProvider.market(market);
//@ts-ignore
const tokenAddress = addressProvider.aTerra(market);
console.log(`Checking address : ${process.env.TERRA_ADDR}`);

(async () => {
    const {exchange_rate, aterra_supply}: EpochStateResponse = await lcd.wasm.contractQuery(
        marketContractAddress,
        {
          epoch_state: {
            block_height: undefined,
          },
        },
    );
    const {balance} = await lcd.wasm.contractQuery(tokenAddress, { balance: { address: myAddress } });
    const deposit = new Int(
        new Dec(exchange_rate).mul(balance),
      )
        .div(1000000)
        .toString();
    console.log(deposit);
    const apy = await getCurrentApy();
    console.info(`Current APY: ${(apy * 100).toFixed(2)}`);
})();
