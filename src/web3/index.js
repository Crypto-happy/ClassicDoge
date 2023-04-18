import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";
import { MaxUint256 } from "@ethersproject/constants";

const web3 = new Web3(Web3.givenProvider);

const shibaDogeTokenAddress = "0x3D12ad839f9491Dc1A32483eab7cd90F609cb31F";
const shibaDogeAbi = require("./abi/shibadoge.json");

const stakingContractV2Address = "0x8E8Fa8586CfC23525e39A62a8421D41492039119";
const stakingContractV1Address = "0x55ea9DBf67Eadc9ca607d45a8de0d1C64c1aE772";

const stakingContractAbi = {
  RiverV2: require("./abi/riverV2.json"),
  RiverV1: require("./abi/riverV1.json"),
};

const contractAddress = {
  RiverV2: "0x8E8Fa8586CfC23525e39A62a8421D41492039119",
};

const injected = new InjectedConnector({ supportedChainIds: [56, 97] });

const humanReadableAccount = (_account) => {
  return _account.slice(0, 6) + "..." + _account.slice(_account.length - 4);
};

const contractInstance = (abi, address) => {
  return new web3.eth.Contract(abi, address);
};

const shibaDogeContractInstance = contractInstance(
  shibaDogeAbi,
  shibaDogeTokenAddress
);

const stakingContractV2Instance = contractInstance(
  stakingContractAbi.RiverV2,
  stakingContractV2Address
);

const stakingContractV1Instance = contractInstance(
  stakingContractAbi.RiverV1,
  stakingContractV1Address
);

const jsNumberForAddress = (address) => {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
};

const getUserBalance = async (address) => {
  const _userBalance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(_userBalance.toString(), "ether");
};

const fromWei = (value) => {
  return web3.utils.fromWei(value.toString(), "ether");
};

const toWei = (value) => {
  return web3.utils.toWei(value, "ether");
};

const getCurrentAccount = async () => {
  const _currenctAccount = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return _currenctAccount[0] || "";
};

const approve = (contractAddress, account) => {
  return shibaDogeContractInstance.methods
    .approve(contractAddress, MaxUint256)
    .send({ from: account });
};

const stake = (isContractV1, account, stakingAmount, referralAddress) => {
  return isContractV1
    ? stakingContractV1Instance.methods
        .stake(stakingAmount)
        .send({ from: account })
    : stakingContractV2Instance.methods
        .stake(stakingAmount, referralAddress)
        .send({
          from: account,
        });
};

const withdraw = (isContractV1, account, unstakingAmount) => {
  return isContractV1
    ? stakingContractV1Instance.methods
        .withdraw(unstakingAmount)
        .send({ from: account })
    : stakingContractV2Instance.methods.unstake(unstakingAmount).send({
        from: account,
      });
};

const claim = (isContractV1, account) => {
  return isContractV1? stakingContractV1Instance.methods.getReward().send({from: account}):stakingContractV2Instance.methods.claim().send({
    from: account,
  });
};

const reinvest = (contract, account) => {
  return stakingContractV2Instance.methods.reInvest().send({
    from: account,
  });
};

const isApproved = async (contractAddress, account) => {
  const _allowance = await shibaDogeContractInstance.methods
    .allowance(account, contractAddress)
    .call();
  return _allowance - MaxUint256 === 0;
};

export {
  contractAddress,
  web3,
  injected,
  getCurrentAccount,
  humanReadableAccount,
  jsNumberForAddress,
  getUserBalance,
  contractInstance,
  shibaDogeContractInstance,
  fromWei,
  toWei,
  approve,
  isApproved,
  stake,
  withdraw,
  claim,
  reinvest,
  stakingContractV2Instance,
  stakingContractV1Instance,
  stakingContractV1Address,
  stakingContractV2Address,
};
