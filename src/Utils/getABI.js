// npm i ethers
import { ethers } from "ethers";

// npm i axios
import axios from "axios";

import { InfuraProvider } from "@ethersproject/providers";
import detectProxyTarget from "evm-proxy-detection";

const ETHERSCAN_APIKEY = process.env.REACT_APP_ETHERSCAN_APIKEY;
const POLYGONSCAN_APIKEY = process.env.REACT_APP_POLYGONSCAN_APIKEY;
const BSCSCAN_APIKEY = process.env.REACT_APP_BSCSCAN_APIKEY;
const AVALANCHE_APIKEY = process.env.REACT_APP_AVALANCHE_APIKEY;
const ARBITRUM_APIKEY = process.env.REACT_APP_ARBITRUM_APIKEY;
const OPTIMISM_APIKEY = process.env.REACT_APP_OPTIMISM_APIKEY;
const ETHEREUM_PROVIDER = process.env.REACT_APP_ETHEREUM_PROVIDER;
const POLYGON_PROVIDER = process.env.REACT_APP_POLYGON_PROVIDER;
const BSC_PROVIDER = process.env.REACT_APP_BSC_PROVIDER;
const AVALANCHE_PROVIDER = process.env.REACT_APP_AVALANCHE_PROVIDER;
const ARBITRUM_PROVIDER = process.env.REACT_APP_ARBITRUM_PROVIDER;
const OPTIMISM_PROVIDER = process.env.REACT_APP_OPTIMISM_PROVIDER;

//Array containing needed info for each supported network.
const apiKeyArray = {
  Ethereum: {
    ApiKey: ETHERSCAN_APIKEY,
    Provider: ETHEREUM_PROVIDER,
    ApiNetwork: "api.etherscan.io",
  },
  Polygon: {
    ApiKey: POLYGONSCAN_APIKEY,
    Provider: POLYGON_PROVIDER,
    ApiNetwork: "api.polygonscan.com",
  },
  Bsc: {
    ApiKey: BSCSCAN_APIKEY,
    Provider: BSC_PROVIDER,
    ApiNetwork: "api.bscscan.com",
  },
  Avalanche: {
    ApiKey: AVALANCHE_APIKEY,
    Provider: AVALANCHE_PROVIDER,
    ApiNetwork: "api.snowtrace.io",
  },
  Arbitrum: {
    ApiKey: ARBITRUM_APIKEY,
    Provider: ARBITRUM_PROVIDER,
    ApiNetwork: "api.arbiscan.io",
  },
  Optimism: {
    ApiKey: OPTIMISM_APIKEY,
    Provider: OPTIMISM_PROVIDER,
    ApiNetwork: "api.optimistic.etherscan.io",
  },
};

export async function getTokenDetails(
  tokenContractAddress,
  chainName,
  chainId
) {
  // Get the API Key, RPC provider and Api link prefix for the inputed network.
  const myApiKey = apiKeyArray[chainName].ApiKey;
  const provider = apiKeyArray[chainName].Provider;
  const apiNetwork = apiKeyArray[chainName].ApiNetwork;

  //   Creating a wallet instance with your private key and chosen provider.
  const address = "0x616efd3e811163f8fc180611508d72d842ea7d07";

  //   Check that the inputed address is a valid address.
  if (ethers.utils.isAddress(tokenContractAddress)) {
    if (
      (await ethers
        .getDefaultProvider(provider)
        .getCode(tokenContractAddress)) == "0x"
    )
      throw Error("Address not a contract");

    const infuraProvider = new InfuraProvider(
      chainId,
      "06e4a48af41345f39a34f05ae723973a"
    );
    const requestFunc = ({ method, params }) =>
      infuraProvider.send(method, params);

    // TODO fix to a block number to keep test stable for eternity (requires Infura archive access)
    const BLOCK_TAG = "latest"; // 15573889

    const addr = await detectProxyTarget(
      tokenContractAddress,
      requestFunc,
      BLOCK_TAG
    );

    if (addr) tokenContractAddress = addr;
    console.log("x", addr);
    console.log("y", tokenContractAddress);

    let contractABI;
    // Fetch the contract address's abi and connect wallet to it by creating a new Contract instance.
    try {
      let text = await axios(
        `https://${apiNetwork}/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=${myApiKey}
        `,
        { credentials: "omit" }
      );
      contractABI = JSON.parse(text.data.result);
      let newContract = new ethers.Contract(
        tokenContractAddress,
        contractABI,
        new ethers.VoidSigner(address, provider)
      );
      // If the contract is a proxy contract this will get the correct info.
      try {
        const implementationAddress = await newContract.implementation();
        console.log("It is a proxy contract");
        console.log(
          "Implementation Contract Address: " + implementationAddress
        );

        let text = await axios(
          `https://${apiNetwork}/api?module=contract&action=getabi&address=${implementationAddress}&apikey=${myApiKey}
          `,
          { credentials: "omit" }
        );
        contractABI = JSON.parse(text.result);
      } catch (err) {
        console.log(err.message);
        console.log("Not a proxy contract");
      }

      console.log(contractABI);
      return contractABI;
    } catch (err) {
      if (err.message == "Unexpected token C in JSON at position 0") {
        console.log(
          "Not a contract address or contract address not verified on etherscan"
        );
        console.log(err.message);
      } else {
        console.log(err.message);
      }
    }
  } else {
    console.log("Invalid address type");
    throw Error("Invalid Address");
  }
}

// async function test() {
//   //example with Lens protocol proxy contract address on Polygon
//   await getTokenDetails(
//     "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
//     "Polygon"
//   );
//   console.log("--------------------------------------------------------------");
//   // //example with USD Tether on Avalanche
//   // await getTokenDetails(
//   //   "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
//   //   "Avalanche"
//   // );
//   // console.log("--------------------------------------------------------------");
//   // //example with BUSD on Ethereum
//   // await getTokenDetails(
//   //   "0x5864c777697Bf9881220328BF2f16908c9aFCD7e",
//   //   "Ethereum"
//   // );
//   // console.log("--------------------------------------------------------------");
//   // //example with Wrapped DAI Stablecoin on Binance Smart Chain
//   // await getTokenDetails("0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", "Bsc");
// }

// // console.log(test());
