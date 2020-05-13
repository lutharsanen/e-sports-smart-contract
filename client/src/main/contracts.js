export const BETTING_CONTRACT_ADDRESS =
  "0xA96E0fcE68f381153b3AB83348446b5eDCe1D006";

export const BETTING_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
    payable: true,
    signature: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameid",
        type: "uint256",
      },
    ],
    name: "Gamecreated",
    type: "event",
    signature:
      "0xd989a87484808e19df97363a55f4329a1f1326807ef4140cc76b0bcf8ad48855",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gameid",
        type: "uint256",
      },
    ],
    name: "Gamefinished",
    type: "event",
    signature:
      "0x66dc14bbb984059f5d5c2512906882b1081085145978b2573b10367f06bd717c",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameid",
        type: "uint256",
      },
    ],
    name: "Bugiclize_createGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xa92a0761",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameid",
        type: "uint256",
      },
    ],
    name: "Bugiclize_getResult",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
    payable: true,
    signature: "0x94f9859d",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "winner",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gameid",
        type: "uint256",
      },
    ],
    name: "Bugiclize_updateResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xda7a59bf",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameID",
        type: "uint256",
      },
    ],
    name: "_payout",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
    signature: "0xaf0a3453",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "addressInfo",
    outputs: [
      {
        internalType: "address payable",
        name: "playeraddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x19f3d313",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allgames",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xf3567490",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_teamSelected",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_gameID",
        type: "uint256",
      },
    ],
    name: "bet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
    signature: "0x7c695384",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "betInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "totalBetA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalBetB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x2d629ed4",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "gameID",
        type: "uint256",
      },
    ],
    name: "checkPlayerExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xa1d5ada7",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameid",
        type: "uint256",
      },
    ],
    name: "createNewGame",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x47ffd897",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "uint256",
        name: "totalBetA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalBetB",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x117a5b90",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameID",
        type: "uint256",
      },
    ],
    name: "getAmountTeamA",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x7bc1b5e8",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameID",
        type: "uint256",
      },
    ],
    name: "getAmountTeamB",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x7481401e",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x12065fe0",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameID",
        type: "uint256",
      },
    ],
    name: "getTotalAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xf0e40662",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "winner",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gameID",
        type: "uint256",
      },
    ],
    name: "getWinnerAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x453ff5ed",
  },
  {
    inputs: [],
    name: "getstoredGames",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x10fe20e3",
  },
  {
    inputs: [],
    name: "minimumBet",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xc38a8afd",
  },
  {
    inputs: [],
    name: "oracle_owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x2c6d2c9f",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x8da5cb5b",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "playerInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "amountBet",
        type: "uint256",
      },
      {
        internalType: "uint16",
        name: "teamSelected",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xedc67eb6",
  },
];
