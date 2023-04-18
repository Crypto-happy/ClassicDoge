import { Images_Src } from "./images";

export const poolData = [
  {
    name: "River 2.0",
    avatarSrc: Images_Src.avatar.river,
    description: "Improved River 2.0 Staking",
    contractAddress: "0x8E8Fa8586CfC23525e39A62a8421D41492039119",
    abi: require("../web3/abi/riverV2.json"),
  },
  {
    name: "River",
    avatarSrc: Images_Src.avatar.river,
    description: "Limited Time Only!",
    contractAddress: "0x55ea9DBf67Eadc9ca607d45a8de0d1C64c1aE772",
    abi: require("../web3/abi/riverV1.json"),
  },
];
