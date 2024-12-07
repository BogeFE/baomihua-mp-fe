<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <view class="activity-create-page">
    <view class="create-form">
      <!-- 活动名称 -->
      <view class="demo-list-item">
        <text class="demo-list-item__label"
          >活动名称<text class="required-option">(必填)</text></text
        >
        <input
          style="text-align: right; "
          class="demo-list-item__value"
          maxlength="15"
          placeholder="点击输入名称(限15字)"
          placeholder-class="input-placeholder"
          v-model="state.title"
        />
      </view>
      <!-- 分割线 -->
      <view class="break-line"></view>
      <!-- 活动类型 -->
      <view class="activity-type">
        <picker
          mode="selector"
          :range="store.typeNameSelector"
          :value="state.type"
          @change="handleTypeChange"
        >
          <view class="demo-list-item">
            <view class="demo-list-item__label"
              >活动类型<text class="required-option">(必填)</text></view
            >
            <view class="demo-list-item__value">
              {{ store.typeNameSelector[state.type] }}
            </view>
          </view>
        </picker>
      </view>
      <!-- 分割线 -->
      <view class="break-line"></view>
      <!-- 活动地点 -->
      <view class="activity-location">
        <picker
          mode="selector"
          :range="store.locationNameSelector"
          :value="state.location"
          @change="handleLocationChange"
        >
          <view class="demo-list-item">
            <view class="demo-list-item__label"
              >活动地点<text class="required-option">(必填)</text></view
            >
            <view class="demo-list-item__value">
              {{ store.locationNameSelector[state.location] }}
            </view>
          </view>
        </picker>
      </view>
      <!-- 分割线 -->
      <view class="break-line"></view>
      <!-- 活动日期 -->
      <view class="activity-date">
        <picker mode="date" :value="state.date" @change="handleDateChange">
          <view class="demo-list-item">
            <view class="demo-list-item__label"
              >活动日期<text class="required-option">(必填)</text></view
            >
            <view class="demo-list-item__value">{{ state.date }}</view>
          </view>
        </picker>
      </view>
      <!-- 分割线 -->
      <view class="break-line"></view>

      <view class="activity-time">
        <picker mode="time" :value="state.time" @change="handleTimeChange">
          <view class="demo-list-item">
            <view class="demo-list-item__label"
              >开始时间<text class="required-option">(必填)</text></view
            >
            <view class="demo-list-item__value">{{ state.time }}</view>
          </view>
        </picker>
      </view>
      <!-- 分割线 -->
      <view class="break-line"></view>
      <!-- 联系电话 -->
      <view class="demo-list-item">
        <text class="demo-list-item__label"
          >联系方式<text class="required-option">(必填)</text></text
        >
        <input
          maxlength="11"
          style="text-align: right; "
          class="demo-list-item__value"
          placeholder="点击输入您的联系电话"
          placeholder-class="input-placeholder"
          type="number"
          v-model="state.telephone"
        />
      </view>
      <!-- 分割线 -->
      <view class="break-line"></view>
      <view class="demo-list-item">
        <text class="demo-list-item__label">活动人数</text>
        <AtInputNumber
          class="demo-list-item__value"
          size="large"
          :width="150"
          :min="0"
          :max="20"
          :step="1"
          :value="state.peopleNum"
          @change="handleNumberChange"
        />
      </view>
      <!-- 分割线       -->
      <view class="break-line"></view>

      <view class="demo-list-item">
        <text class="demo-list-item__label">活动时长(小时)</text>
        <AtInputNumber
          class="demo-list-item__value"
          size="large"
          :width="150"
          :min="0"
          :max="20"
          :step="1"
          :value="state.duration"
          @change="handleDurationChange"
        />
      </view>
      <!-- 分割线 -->
      <view class="break-line"></view>

      <view class="activity-description">
        <text class="textarear-title">活动描述</text>
        <textarea
          maxlength="3000"
          rows="100"
          cols="100"
          class="description-textarea"
          placeholder="点击输入：如人均价格，活动特点等"
          v-model="state.description"
        ></textarea>
      </view>
    </view>

    <view class="create-button" @tap="createActivity">立即创建</view>
  </view>
</template>

<script setup>
import { reactive } from "vue";
import { AtInputNumber } from "taro-ui-vue3";
import { BASE_URL } from "../../utils/baseURL";
import Taro from "@tarojs/taro";
import "taro-ui-vue3/dist/style/components/input-number.scss";
import useBasicInfoStore from "../../stores/basicInfo";
import useDetailsStore from "../../stores/activityDetails";

const store = useBasicInfoStore();
const state = reactive({
  actId: 0,
  title: "",
  location: 0,
  type: 0,
  date: "点击选择日期",
  time: "点击选择时间",
  duration: 0,
  peopleNum: 0,
  telephone: "",
  description: ""
});

//对接创建活动接口
function createActivity() {
  //先进行输入校验

  //1.活动名称不得为空
  if (!state.title) {
    return Taro.showToast({
      title: "请输入活动名称",
      icon: "error",
      duration: 1500
    });
  }

  //2.活动类型不得为空——state.type不能为0
  if (state.type === 0) {
    return Taro.showToast({
      title: "请选择活动类型",
      icon: "error",
      duration: 1500
    });
  }

  //3.活动地点不得为空——state.location不能为0
  if (state.location === 0) {
    return Taro.showToast({
      title: "请选择活动地点",
      icon: "error",
      duration: 1500
    });
  }

  //4.活动日期以及地点不得为空
  if (state.date === "点击选择日期") {
    return Taro.showToast({
      title: "请选择活动日期",
      icon: "error",
      duration: 1500
    });
  } else if (state.time === "点击选择时间") {
    return Taro.showToast({
      title: "请选择活动时间",
      icon: "error",
      duration: 1500
    });
  }

  //5.联系电话不得为空
  if (!state.telephone) {
    return Taro.showToast({
      title: "请输入联系电话",
      icon: "error",
      duration: 1500
    });
  }

  //6.活动人数不得为0
  if (state.peopleNum === 0) {
    return Taro.showToast({
      title: "请输入活动人数",
      icon: "error",
      duration: 1500
    });
  }


  Taro.request({
    url: BASE_URL + "/act/addAct",
    method: "POST",
    header: {
      token: Taro.getStorageSync("token")
    },
    data: {
      actName: state.title,
      type: store.typeKey[state.type],
      typeName: store.typeNameSelector[state.type],
      location: store.locationKey[state.location],
      locationName: store.locationNameSelector[state.location],
      beginDate: state.date + " " + state.time + ":00",
      number: state.peopleNum,
      telephone: state.telephone,
      description: state.description
    }
  }).then(res => {
    console.log("创建活动");
    console.log(res);
    const actId = res.data.data.actId;
    const details = useDetailsStore();
    details.checkDetails(actId);
  });
}
function handleNumberChange(num) {
  state.peopleNum = num;
}
function handleDurationChange(duration) {
  state.duration = duration;
}

function handleDateChange(e) {
  state.date = e.detail.value;

  const date = new Date();
  const arr = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const dateArr = state.date.split("-").map(val => {
    return Number(val);
  });

  for (let i = 0; i < dateArr.length; i++) {
    if (dateArr[i] < arr[i]) {
      return Taro.showToast({
        title: "请选择有效日期",
        icon: "error",
        duration: 1500
      });
    }
  }
}

function handleTimeChange(e) {
  state.time = e.detail.value;

  const date = new Date();
  const arr = [date.getHours(), date.getMinutes()];
  const timeArr = state.time.split(":").map(val => {
    return Number(val);
  });

  for (let i = 0; i < timeArr.length; i++) {
    if (timeArr[i] < arr[i]) {
      return Taro.showToast({
        title: "请选择有效时间",
        icon: "error",
        duration: 1500
      });
    }
  }
}

function handleLocationChange(e) {
  state.location = e.detail.value;
}
function handleTypeChange(e) {
  state.type = e.detail.value;
}
</script>

<style lang="scss">
.activity-create-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  background-color: #ffffff;
}

.create-form {
  display: flex;
  flex-direction: column;
  width: 1053px;
  height: auto;
  background: #ffffff;
  box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.04);
  border-radius: 20px;
  padding-top: 60px;
}

.break-line {
  width: 980px;
  height: 3px;
  margin-top: 45px;
  margin-left: 50px;
  margin-bottom: 45px;
  background: #efefef;
  border-radius: 100px;
}
.required-option {
  font-weight: 400;
  font-size: 42px;
  line-height: 56px;
  color: #ea1204;
  margin-left: 10px;
}
.demo-list-item {
  display: flex;
  width: 100%;
  font-size: 48px;
  line-height: 64px;
  justify-content: space-between;
  .demo-list-item__label {
    display: flex;
    align-items: center;
    color: #3a3a3a;
    margin-left: 48px;
  }
  .demo-list-item__value {
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 53px;
    margin-right: 40px;
  }
}

.activity-description {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 50px;
  margin-right: 50px;
  // width: 1000px;
  .textarear-title {
    font-style: normal;
    font-weight: 400;
    font-size: 48px;
    line-height: 64px;
    color: #1e1e1e;
    align-self: flex-start;
    // margin-left: 48px;
  }
  .description-textarea {
    width: 100%;
    margin-top: 52px;
    padding: 40px;
    background: #f0f0f0;
    border-radius: 30px;
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 53px;
    color: #565656;
  }
}

.create-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 462.61px;
  height: 120.62px;
  margin-top: 50px;
  margin-bottom: 50px;
  background: linear-gradient(177.68deg, #ff6a0e 1.95%, #feaa01 156.14%);
  border-radius: 79px;
  transform: matrix(1, -0.01, 0.01, 1, 0, 0);

  font-weight: 500;
  font-size: 40px;
  line-height: 53px;
  color: #ffffff;
  transform: matrix(1, -0.01, 0.01, 1, 0, 0);
}
</style>
