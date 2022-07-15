import fetch from "node-fetch";
import { ethers } from "ethers";
import fs from "fs";
import { anrxAbi } from "./anrx_abi.js";
import { arenaAbi } from "./arena_abi.js";
import { cards } from "./cards.js";
import dotenv from "dotenv";

dotenv.config();

const sleep = (deley) => new Promise((resolve) => setTimeout(resolve, deley));

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon"
);
const WALLET = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);
const loadJsonFile = () => {
  let dataJson = JSON.parse(fs.readFileSync("./authToken.json", "utf8"));
  return dataJson;
};

const jsonData = loadJsonFile();

var xauthToken = jsonData.authToken;
const headersAuth = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
  "content-type": "application/json",
};
const headers = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
  "content-type": "application/json",
  "x-auth-token": xauthToken,
};

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

const getData = async (url = "", headers) => {
  return fetch(url, {
    method: "GET",
    headers: headers,
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
  getUsedEnergy();
  xauthToken = jsonData.authToken;
  let nonce = jsonData.lastNonce;
  while (xauthToken === null) {
    let message = `Welcome to Battlewave2323!\n\nClick 'Sign' to sign in. No password needed!\n\nWallet address:\n${WALLET.address}\n\nNonce:\n${nonce}`;
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
      jsonData.authToken = xauthToken;
      jsonData.lastNonce = nonce;
      fs.writeFile(
        "./authToken.json",
        JSON.stringify(jsonData),
        function (err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );
    } else {
      console.log("Error while fetch authToken");
      xauthToken = null;
      nonce++;
    }
  }
};

const useRefill = async () => {
  let tx = await arenaContract.incrementEnergyReactorCount({
    gasLimit: 100000,
    gasPrice: ethers.utils.parseUnits("200", "gwei"),
  });
  await tx.wait();

  let requestResult = await getData(
    `https://bw2323.anrkeyx.net/api/v1/minigame/UseEnergyRefill?transactionHash=${tx.hash}`,
    headers
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
    `https://bw2323.anrkeyx.net/api/v1/minigame/UsePowerBoost?transactionHash=${tx.hash}`,
    headers
  );
  requestResult.data.successful
    ? console.log("Boost was used")
    : console.log(requestResult.data, "Error using boost");
};

const cardFight = async (boosted) => {
  boosted
    ? cards.map((el, ind) => {
        if (ind > 1 && ind < 5) {
          el.boosted = true;
          return el;
        } else {
          el.boosted = false;
          return el;
        }
      })
    : cards;

  let data = {
    userAddress: WALLET.address,
    selectedCards: cards,
    league: "mythic",
  };

  let requestResult = await postData(
    `https://bw2323.anrkeyx.net/api/v1/minigame/cardFight`,
    data,
    headers
  );

  if (requestResult.result == 1 && requestResult.msg === "Success") {
    console.log(`Fight with ${requestResult.data.enemyName}`);
    console.log(requestResult.data.message);
    console.log(
      `Anrx won ${requestResult.data.anrxWon ? requestResult.data.anrxWon : 0}`
    );
  } else {
    console.log(requestResult);
  }
};

const getUsedEnergy = async () => {
  let requestResult = await getData(
    `https://bw2323.anrkeyx.net/api/v1/minigame/getUserEnergy?userAddress=${WALLET.address}`,
    headers
  );

  if (requestResult.result == 1 && requestResult.msg === "Success") {
    return requestResult.data;
  } else if (requestResult.data == "Token Expired") {
    xauthToken = null;
    console.log("Token expired");
  }
};

const getConsumablesDetalis = async () => {
  let requestResult = await getData(
    `https://bw2323.anrkeyx.net/api/v1/minigame/getConsumablesDetails`,
    headers
  );
  if (requestResult.result == 1 && requestResult.msg === "Success") {
    return {
      useRefill: requestResult.data.energyRefill.canUseRefill,
      useBoost: requestResult.data.powerBoost.canUseBoost,
    };
  }
};

const fight = async () => {
  let canUse = await getConsumablesDetalis();
  if (canUse.useRefill) {
    await useRefill();
    await useRefill();
  }

  if (canUse.useBoost) {
    await useBoost();
    await useBoost();
  }

  let battleData = await getUsedEnergy();

  while (battleData.energy > 1) {
    try {
      battleData = await getUsedEnergy();
      battleData.boostedMatches > 0
        ? await cardFight(true)
        : await cardFight(false);
      console.log(`Enery left ${battleData.energy}\n`);
      await sleep(2000);
    } catch (error) {
      console.error(error);
    }
  }
  console.log('End fight')
};
getAuthToken()
fight();
