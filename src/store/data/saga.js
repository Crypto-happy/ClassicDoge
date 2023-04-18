import { takeLatest, put, call } from "redux-saga/effects";

import { GET_DATA } from "./actionTypes";

import { getDataFail, getDataSuccess } from "./action";
import {
  fromWei,
  getCurrentAccount,
  shibaDogeContractInstance,
  stakingContractV1Address,
  stakingContractV1Instance,
  stakingContractV2Address,
  stakingContractV2Instance,
} from "../../web3";
import { poolData } from "../../config/data";

const getDataFromContract = async () => {
  const currentAccount = await getCurrentAccount();

  const ttt = [
    stakingContractV2Instance.methods.LOCKUP_TIME().call(),
    stakingContractV2Instance.methods.STAKING_FEE_RATE_X_100().call(),
    stakingContractV2Instance.methods.UNSTAKING_FEE_RATE_X_100().call(),
    stakingContractV2Instance.methods.TRUSTED_TOKEN_ADDRESS().call(),
    stakingContractV2Instance.methods.depositedTokens(currentAccount).call(),
    stakingContractV2Instance.methods.REWARD_INTERVAL().call(),
    stakingContractV2Instance.methods.contractStartTime().call(),
    stakingContractV2Instance.methods.totalClaimedRewards().call(),
    stakingContractV2Instance.methods
      .getTotalPendingDivs(currentAccount)
      .call(),
    stakingContractV2Instance.methods.REWARD_RATE_X_100().call(),
    shibaDogeContractInstance.methods
      .balanceOf(stakingContractV2Address)
      .call(),
    stakingContractV2Instance.methods.REFERRAL_FEE_RATE_X_100().call(),
    stakingContractV2Instance.methods.totalClaimedReferralFee().call(),
    stakingContractV2Instance.methods
      .totalReferralFeeEarned(currentAccount)
      .call(),
    shibaDogeContractInstance.methods.balanceOf(currentAccount).call(),

    /*   riverV1 contract data */
    stakingContractV1Instance.methods.rewardsToken().call(),
    stakingContractV1Instance.methods.stakingToken().call(),
    stakingContractV1Instance.methods.minStakingLimit().call(),
    stakingContractV1Instance.methods.totalSupply().call(),
    stakingContractV1Instance.methods.rewards(currentAccount).call(),
    stakingContractV1Instance.methods.depositedRewardTokens().call(),
    stakingContractV1Instance.methods.periodFinish().call(),
    stakingContractV1Instance.methods.balanceOf(currentAccount).call(),
    stakingContractV1Instance.methods.rewardsDuration().call(),
    stakingContractV1Instance.methods.rewardPerToken().call(),
  ];
  const [
    _lockupTimeV2,
    _stakingFeeV2,
    _unstakingFeeV2,
    _rewardTokenAddressV2,
    _userDepositedTokenBalanceV2,
    _poolValidForV2,
    _poolstartTimeV2,
    _totalRewardV2,
    _userClaimableRewardV2,
    _rewardRateV2,
    _totalDepositedV2,
    _referralFeeV2,
    _totalClaimedRefferalFeeV2,
    _userRefferalRewardV2,
    _userBalance,
    _rewardTokenAddressV1,
    _stakingTokenAddressV1,
    _minStakingLimitV1,
    _totalDepositedV1,
    _userClaimableRewardV1,
    _totalRewardV1,
    _periodFinishV1,
    _userDepositedTokenBalanceV1,
    _poolValidForV1,
    _rewardPerTokenV1,
  ] = await Promise.all(ttt);

  return {
    riverV2: {
      name: poolData[0].name,
      avatarSrc: poolData[0].avatarSrc,
      description: poolData[0].description,
      contractAddress: stakingContractV2Address,
      lockupTime: _lockupTimeV2,
      stakingFee: _stakingFeeV2 / 100,
      unstakingFee: _unstakingFeeV2 / 100,
      referralFee: _referralFeeV2 / 100,
      totalClaimedRefferalFee: fromWei(_totalClaimedRefferalFeeV2),
      userRefferalReward: fromWei(_userRefferalRewardV2),
      rewardTokenAddress: _rewardTokenAddressV2,
      stakingTokenAddress: _rewardTokenAddressV2,
      userDepositedTokenBalance: fromWei(_userDepositedTokenBalanceV2),
      poolValidFor: _poolValidForV2,
      poolStartTime: _poolstartTimeV2,
      totalDeposited: fromWei(_totalDepositedV2),
      totalReward: fromWei(_totalRewardV2),
      rewardRate: _rewardRateV2,
      userClaimableReward: fromWei(_userClaimableRewardV2),
      userBalance: fromWei(_userBalance),
      finished:
        _poolValidForV2 / 24 / 3600 -
          (new Date().getTime() / 1000 - _poolstartTimeV2) / 3600 / 24 <
        0,
      apr:
        (((_poolValidForV2 - (new Date().getTime() / 1000 - _poolstartTimeV2)) /
          _poolValidForV2 /
          100) *
          _rewardRateV2 *
          365 *
          24 *
          3600) /
        _poolValidForV2,
    },
    riverV1: {
      name: poolData[1].name,
      avatarSrc: poolData[1].avatarSrc,
      description: poolData[1].description,
      contractAddress: stakingContractV1Address,
      rewardTokenAddress: _rewardTokenAddressV1,
      stakingTokenAddress: _stakingTokenAddressV1,
      minStakingLimit: fromWei(_minStakingLimitV1),
      totalDeposited: fromWei(_totalDepositedV1),
      userClaimableReward: fromWei(_userClaimableRewardV1),
      totalReward: fromWei(_totalRewardV1),
      periodFinish: _periodFinishV1,
      userDepositedTokenBalance: fromWei(_userDepositedTokenBalanceV1),
      userBalance: fromWei(_userBalance),
      poolValidFor: _poolValidForV1,
      finished: _periodFinishV1 * 1000 - new Date() < 0,
      apr:
        (fromWei(_rewardPerTokenV1) / _poolValidForV1) * 24 * 3600 * 365 * 100,
    },
  };
};

function* onGetData() {
  try {
    const response = yield call(getDataFromContract);
    yield put(getDataSuccess(response));
  } catch (error) {
    console.log(error);
    yield put(getDataFail(error));
  }
}

function* DataSaga() {
  yield takeLatest(GET_DATA, onGetData);
}

export default DataSaga;
