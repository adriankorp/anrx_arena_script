import fetch from "node-fetch";
import { ethers } from "ethers";
import fs from "fs";
import { anrxAbi } from "./anrx_abi.js";
import { arenaAbi } from "./arena_abi.js";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon"
);
const WALLET = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);
var xauthToken = undefined;
const headersAuth = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
  "content-type": "application/json",
}
const headers = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
  "content-type": "application/json",
  "x-auth-token": xauthToken
}

const postData = async (url = "", data = {}, headers) => {
  return fetch(url, {
    method: "POST",
    headers: headers,

    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.error("ERROR:", err));
};

const getData = async (url = "", data = {}, headers) => {
  return fetch(url, {
    method: "GET",
    headers: headers,

    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.error("ERROR:", err));
};

const anrxContract = new ethers.Contract(
  "0x554f074d9ccda8f483d1812d4874cbebd682644e",
  JSON.stringify(anrxAbi),
  WALLET
);
const arenaContract = new ethers.Contract(
  "0x649b8BEd47A9b5947B7Efaaf123547B25b147429",
  JSON.stringify(arenaAbi),
  WALLET
);

const getAuthToken = async () => {
  let message = `Welcome to Battlewave2323!\n\nClick 'Sign' to sign in. No password needed!\n\nWallet address:\n${WALLET.address}\n\nNonce:\n14114`;
  let signMessage = await WALLET.signMessage(message);
  let authToken = await postData(
    "https://bw2323.anrkeyx.net/api/v1/utils/genAuthToken",
    {
      chainId: 137,
      result: signMessage,
      userAddress: WALLET.address,
    },
    headersAuth
  );
  if (authToken.data !== "Unauthorized") {
    xauthToken = authToken.data;
  } else {
    console.log("Error while fetch authToken");
    xauthToken = undefined;
  }
};

const useRefill = async () => {
  let tx = await arenaContract.incrementEnergyReactorCount({
    gasLimit: 100000,
    gasPrice: ethers.utils.parseUnits("200", "gwei"),
  });
  await tx.wait();

  let requestResult = await getData(
    url = `https://bw2323.anrkeyx.net/api/v1/minigame/UseEnergyRefill?transactionHash=${tx.hash}`, headers=headers
  );
  requestResult.data.successful
    ? console.log("Energy replenished")
    : console.log(requestResult.data, "Failure to replenish energy");
};

const useBoost = async () => {
  let tx = await arenaContract.incrementPowerBoostCount({
    gasLimit: 148709,
    gasPrice: ethers.utils.parseUnits("200", "gwei"),
  });
  await tx.wait();
  let requestResult = await getData(
    url = `https://bw2323.anrkeyx.net/api/v1/minigame/UsePowerBoost?transactionHash=${tx.hash}`, headers=headers
  );
  requestResult.data.successful
    ? console.log("Boost was used")
    : console.log(requestResult.data, "Error using boost");
};



