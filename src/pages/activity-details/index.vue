<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <view class="activity-details-page">
    <image class="details-image" :src="details.topPictureUrl" />

    <view class="details-infomation">
      <view class="title">{{ details.actName }}</view>
      <view class="location-time">
        <image src="../../assets/images/time-icon.png" />活动时间：{{
          details.beginDate
        }}
      </view>
      <view class="location-time">
        <image src="../../assets/images/location-icon.png" />活动地点：{{
          details.locationName
        }}
      </view>
    </view>

    <image class="location-image" :src="details.locationPictureUrl" />

    <view class="creator">
      发起人:
      <image src="../../assets/images/creator-icon.png" class="creator-icon" />
      <view class="creator-telephone">联系方式：{{ details.telephone }}</view>
    </view>

    <text class="activity-description">{{ details.description }}</text>
  </view>
  <view class="footer">
    <view class="count-down">
      <AtCountdown
        v-if="show"
        isCard
        :format="{ hours: '小时', minutes: '分钟', seconds: '秒报名截止' }"
        :hours="hour"
        :minutes="minute"
      />
      <view class="joined-number">
        已报名人数:{{ details.currentNumber }}/{{ details.totalNumber }}
      </view>
    </view>
    <view class="two-button">
      <view class="cancel" @tap="quitActivity">取消报名</view>
      <view class="join" @tap="joinActivity">{{ statement[state] }}</view>
    </view>
  </view>
</template>

<script setup>
import { AtCountdown } from "taro-ui-vue3";
import useDetailsStore from "../../stores/activityDetails";
import "./index.scss";
import { onMounted, ref } from "vue";
import Taro from "@tarojs/taro";
import { BASE_URL } from "../../utils/baseURL";

onMounted(() => {
  const date = new Date();

  const beginDateTime = details.beginDate.split(" ");
  const beginDate = beginDateTime[0].split("-").map(val => {
    return Number(val);
  });
  const beginTime = beginDateTime[1].split(":").map(val => {
    return Number(val);
  });

  const activityDate = new Date(
    beginDate[0],
    beginDate[1] - 1,
    beginDate[2],
    beginTime[0],
    beginTime[1]
  );
  console.log(activityDate.getTime());
  console.log(date.getTime());

  const timeDistance = activityDate.getTime() - date.getTime();
  if (timeDistance > 86400000) {
    show.value = false;
  } else if (timeDistance <= 0) {
    show.value = false;
    if (state.value !== 1) {
      state.value = 3;
    } else {
      state.value = 1;
    }
    console.log(state.value);
  } else {
    console.log(state.value);
    hour.value = Math.floor(timeDistance / 3600000);
    console.log(hour.value);
    minute.value = Math.floor((timeDistance - 3600000 * hour.value) / 60000);
    console.log(minute.value);
  }
  console.log(timeDistance);
});

const show = ref(true);
const hour = ref(0);
const minute = ref(0);
const details = useDetailsStore();
//state表示是否报名
const state = ref(details.state);
const statement = ["立即报名", "您已报名", "已满员", "已截止"];

if (state.value !== 1 && details.currentNumber === details.totalNumber) {
  state.value = 2;
}

function joinActivity() {
  if (state.value === 2) {
    Taro.showToast({
      title: "该活动已满员",
      icon: "error",
      duration: 1500
    });
  } else if (state.value === 1) {
    //用户已经报名过该活动——提示已经报名
    Taro.showToast({
      title: "已经报名过了~",
      icon: "error",
      duration: 1000
    });
  } else if (state.value === 3) {
    Taro.showToast({
      title: "报名已截止~",
      icon: "error",
      duration: 1000
    });
  } else {
    //用户尚未报名——走报名流程

    //获取当前活动ID作为接口入参
    const actId = details.actId;
    console.log(statement[state.value]);

    //直接请求joinAct接口——后端应该判定报名的成功与否——full
    Taro.request({
      url: BASE_URL + "/act/joinAct",
      method: "POST",
      header: {
        token: Taro.getStorageSync("token")
      },
      data: {
        actId: actId
      },
      success: function(res) {
        //full:
        //true—表示该活动报名已满
        //false——表示该活动报名尚未满
        console.log(res);
        if (!res.data.data.full) {
          const currentNumber = details.currentNumber;
          details.currentNumber = currentNumber + 1;
          Taro.showModal({
            content: "您已报名成功！",
            showCancel: false,
            confirmText: "好的"
          });
          //将按钮内容转变为“您已报名”
          if (details.currentNumber === details.totalNumber) {
            state.value = 2;
          } else {
            state.value = 1;
          }
        } else {
          Taro.showToast({
            title: "该活动已满员",
            icon: "error",
            duration: 1000
          });
          //将按钮内容转变为“已满员”
          state.value = 2;
        }
      }
    }).catch(err => {
      console.log(err);
      Taro.showToast({
        title: "报名失败!",
        icon: "error",
        duration: 1000
      });
    });
  }
}

function quitActivity() {
  //判断该用户是否报名了该活动——主要是为了防止误触
  if (state.value === 1) {
    Taro.showModal({
      content: "是否取消报名该活动?",
      success: function(res) {
        if (res.confirm) {
          const actId = details.actId;
          Taro.request({
            url: BASE_URL + "/act/quitAct",
            method: "POST",
            header: {
              token: Taro.getStorageSync("token")
            },
            data: {
              actId: actId
            }
          })
            .then(res => {
              console.log(res);
              const currentNumber = details.currentNumber;
              details.currentNumber = currentNumber - 1;
              Taro.showToast({
                title: "取消成功!",
                icon: "success",
                duration: 1000
              });
              state.value = 0;
            })
            .catch(err => {
              console.log(err);
              Taro.showToast({
                title: "取消失败!",
                icon: "error",
                duration: 1000
              });
            });
        }
      }
    });
  } else {
    Taro.showToast({
      title: "尚未报名!",
      icon: "error",
      duration: 1000
    });
  }
}
</script>

<style lang="scss">
.activity-details-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 460px;
}

.details-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 601px;
  background-color: darkgray;
}

.details-infomation {
  display: flex;
  flex-direction: column;
  margin-top: 46px;
  margin-left: 28px;
  .title {
    width: 758.8px;
    height: 65px;
    font-family: "MiSans";
    font-style: normal;
    font-weight: 500;
    font-size: 58px;
    line-height: 77px;
    color: #000000;
  }
  .location-time {
    display: flex;
    align-items: center;
    margin-top: 50px;
    font-style: normal;
    font-weight: 500;
    font-size: 42px;
    line-height: 56px;
    color: #000000;
    image {
      width: 56px;
      height: 56px;
      margin-right: 18px;
    }
  }
}

.location-image {
  width: 1022px;
  height: 382px;
  margin-top: 50px;
  align-self: center;
  background-color: darkgray;
  display: flex;
  align-items: center;
  justify-content: center;
}

.creator {
  display: flex;
  margin-top: 35px;
  margin-left: 28px;
  margin-right: 30px;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 45px;
  line-height: 60px;

  color: #000000;
  .creator-icon {
    width: 100px;
    height: 100px;
    margin-left: 30px;
  }
  .creator-telephone {
    margin-left: auto;
  }
}

.activity-description {
  align-self: center;
  word-wrap: break-word;
  width: 1000px;
  height: auto;
  margin-top: 22px;
  margin-left: 28px;
  margin-right: 28px;
  padding: 25px 20px;
  background: rgba(243, 243, 243, 0.9);
  border-radius: 30px;
  font-family: "MiSans";
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 53px;
  color: #565656;
}

.count-down {
  display: flex;
  width: 100%;
  height: auto;
  .joined-number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 375px;
    height: 75px;
    margin-top: 30px;
    margin-left: auto;
    margin-right: 28px;
    background: rgba(254, 138, 2, 0.1);
    border: 1px solid #ff7210;
    border-radius: 100px;
    font-style: normal;
    color: #ff7210;
    font-weight: 400;
    font-size: 40px;
    line-height: 53px;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  background: linear-gradient(173.48deg, #ffffff 5.13%, #ffffff 141.54%);
  box-shadow: 0px -1px 13px rgba(0, 0, 0, 0.2);

  .two-button {
    width: 1080px;
    height: 255px;
    display: flex;
    justify-content: center;
    align-items: center;
    .cancel {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 464px;
      height: 126px;
      background: #d9d9d9;
      border-radius: 60px;
      font-family: "MiSans";
      font-style: normal;
      font-weight: 500;
      font-size: 58px;
      line-height: 77px;
      color: #413939;
    }
    .join {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 464px;
      height: 126px;
      margin-left: 53px;
      font-family: "MiSans";
      font-style: normal;
      font-weight: 500;
      font-size: 58px;
      line-height: 77px;
      color: #ffffff;
      background: linear-gradient(177.68deg, #ff6a0e 1.95%, #feaa01 156.14%);
      border-radius: 79px;
      transform: matrix(1, -0.01, 0.01, 1, 0, 0);
    }
  }
}
</style>
