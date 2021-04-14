import { Anchor, columbus4, AddressProviderFromJson, MARKET_DENOMS, OperationGasParameters } from "@anchor-protocol/anchor.js";
import { LCDClient, Dec, Int } from "@terra-money/terra.js";

export const getTotalDeposit = async () => {
    const myAddress = process.env.TERRA_ADDR;
    if(!myAddress) throw new Error(`Undefined .env value: 'TERRA_ADDR'`)
    const market = "uusd";
    const addressProvider = new AddressProviderFromJson(columbus4);
    const lcd = new LCDClient({ URL: 'https://lcd.terra.dev', chainID: 'columbus-4' });
    //@ts-ignore
    const marketContractAddress = addressProvider.market(market);
    //@ts-ignore
    const tokenAddress = addressProvider.aTerra(market);
    console.info(`Checking address : ${process.env.TERRA_ADDR}`);
    const deposit = await getContract({lcd, marketContractAddress, tokenAddress, myAddress});
    //new Int().div(1000000).toString();
    return deposit.div(1000000).toFixed(2);
}

export const getContract = async (props: {lcd: LCDClient, marketContractAddress: string, tokenAddress: string, myAddress: string}) => {
    const {lcd, marketContractAddress, tokenAddress, myAddress} = props;
    const {exchange_rate, aterra_supply}: EpochStateResponse = await lcd.wasm.contractQuery(
        marketContractAddress,
        {
          epoch_state: {
            block_height: undefined,
          },
        },
    );
    const {balance} = await lcd.wasm.contractQuery(tokenAddress, { balance: { address: myAddress } });
    const deposit = new Dec(exchange_rate).mul(balance);
    console.info(deposit);
    return deposit;
}

interface EpochStateResponse {
    exchange_rate: string;
    aterra_supply: string;
}