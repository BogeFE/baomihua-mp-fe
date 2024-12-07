<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <view class="personal-home-page">
    <view class="personl-info">
      <image class="user-avatar" :src="userInfoStore.avatarUrl" />
      <text class="user-name">{{ userInfoStore.nickName }}</text>
    </view>
    <view class="personl-created" @tap="toPersonalCreated">已发起的活动</view>
    <view class="personl-joined" @tap="toPersonalJoined">已报名的活动</view>
  </view>
</template>

<script setup>
import useActivityListStore from "../../stores/activityList";
import useBasicInfoStore from "../../stores/basicInfo";
import Taro from "@tarojs/taro";

const listStore = useActivityListStore();
const userInfoStore = useBasicInfoStore();

function toPersonalCreated() {
  //每次进入都先清空列表数组
  listStore.createdActivityList = [];
  listStore.getActivityList(2, 0).then(res => {
    console.log("res resolve");
    console.log(res);
    Taro.navigateTo({
      url: "../personal-created/index"
    });
  });
}
function toPersonalJoined() {
  //每次进入都先清空列表数组
  listStore.joinedActivityList = [];
  listStore.getActivityList(3, 0).then(() => {
    Taro.navigateTo({
      url: "../personal-joined/index"
    });
  });
}
</script>
<style lang="scss">
.personal-home-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 1000px;
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  background-color: rgb(255, 255, 255);

  .personl-info {
    display: flex;
    margin-top: 95px;
    margin-left: 30px;
    align-items: center;
    .user-avatar {
      width: 185px;
      height: 185px;
      border-radius: 50%;
    }
    .user-name {
      margin-left: 37px;
      color: #000000;
      font-weight: 500;
      font-size: 64px;
      line-height: 85px;
    }
  }
  .personl-created {
    width: 967px;
    margin-top: 85px;
    margin-left: 25px;
    padding-bottom: 37px;
    font-weight: 400;
    font-size: 58px;
    line-height: 77px;
    color: #000000;
    border-bottom: 1px solid #b0aaaa;
  }
  .personl-joined {
    width: 967px;
    margin-top: 70px;
    margin-left: 25px;
    padding-bottom: 37px;
    font-weight: 400;
    font-size: 58px;
    line-height: 77px;
    color: #000000;
    border-bottom: 1px solid #b0aaaa;
  }
}
</style>
