export const arenaAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "enum CyberArena.League",
        name: "league",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gameEndTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "battlePassId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "powerBoostCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "energyReactorCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalRegisters",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalPowerBoostUsed",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalEnergyUsed",
        type: "uint256",
      },
    ],
    name: "PlayerStatsEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "getPlayerInfo",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "isRegistered",
            type: "bool",
          },
          {
            internalType: "enum CyberArena.League",
            name: "league",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "gameEndTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "battlePassId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "powerBoostCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "energyReactorCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRegisters",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPowerBoostUsed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalEnergyUsed",
            type: "uint256",
          },
        ],
        internalType: "struct CyberArena.PlayerStats",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "incrementEnergyReactorCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "incrementPowerBoostCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum CyberArena.League",
        name: "_league",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_gameEndTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_battlePassId",
        type: "uint256",
      },
    ],
    name: "registerUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
