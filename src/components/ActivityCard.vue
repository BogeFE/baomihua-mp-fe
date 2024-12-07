<template>
  <view class="activity-card">
    <image class="activity-img" :src="previewPicture" />

    <view class="activity-info">
      <text class="activity-name">{{ actName }}</text>
      <view class="activity-tags">
        <view class="type-tag">{{ type }}</view>
        <view class="number-tag">{{ total }}人</view>
      </view>
      <view class="activity-time">
        <image src="../assets/images/time-icon.png" class="time-icon" />
        {{ beginDate }}
      </view>
      <view class="activity-location">
        <image src="../assets/images/location-icon.png" class="location-icon" />
        {{ location }}
      </view>
    </view>

    <view class="activity-button">
      <view class="join-button" @tap="operateActivity">{{
        statement[state]
      }}</view>
      <view class="check-details-button" @tap="checkDetails">查看详情</view>
    </view>
  </view>
</template>
<script>
import useDetailsStore from "../stores/activityDetails";
import useActivityListStore from "../stores/activityList";
import { ref } from "vue";
import Taro from "@tarojs/taro";
import { BASE_URL } from "../utils/baseURL";

export default {
  name: "ActivityCard",
  props: [
    "actId",
    "actName",
    "type",
    "beginDate",
    "location",
    "total",
    "previewPicture",
    "buttonType"
  ],

  setup(props) {
    const state = ref(0);
    const statement = ["立即报名", "已报名", "取消活动"];
    if (props.buttonType === "creator") {
      state.value = 2;
    } else if (props.buttonType === "joiner") {
      state.value = 1;
    }
    return {
      state,
      statement
    };
  },
  methods: {
    operateActivity() {
      const that = this;
      if (that.state === 1) {
        //state = 1——已报名状态
        Taro.showToast({
          title: "您已报名!",
          icon: "error",
          duration: 1500
        });
      } else if (that.state === 2) {
        //state = 2——触发取消活动状态
        Taro.showModal({
          content: "您是否要取消本次活动?",
          success: function(res) {
            if (res.confirm) {
              Taro.request({
                url: BASE_URL + "/act/deleteAct",
                method: "DELETE",
                data: {
                  actId: that.actId
                },
                header: {
                  token: Taro.getStorageSync("token")
                },
                timeout: 2000,
                success: function() {
                  Taro.showModal({
                    content: "取消成功",
                    showCancel: false
                  });
                  const listStore = useActivityListStore();
                  listStore.joinedActivityList = [];
                  listStore.getActivityList(3, 0);
                }
              });
            }
          }
        });
      } else {
        //state = 0——请求报名状态
        const details = useDetailsStore();
        details
          .joinActivity(that.actId)
          .then(val => {
            that.state = val;
            Taro.showModal({
              content: "您已报名成功！",
              showCancel: false,
              confirmText: "好的"
            });
          })
          .catch(r => {
            console.log(r);
          });
      }
    },
    checkDetails() {
      const details = useDetailsStore();
      details.checkDetails(this.actId);
    }
  }
};
</script>
<style lang="scss">
.activity-card {
  display: flex;
  align-items: center;
  width: 1053px;
  height: auto;
  margin-top: 30px;
  margin-left: 14px;
  border-radius: 16px;
  background: #f2f2f2;

  .activity-img {
    width: 287px;
    height: 282px;
    border-radius: 20px;
    margin-top: 20px;
    margin-left: 14px;
  }

  .activity-info {
    display: flex;
    flex-direction: column;
    margin-top: 35px;
    margin-bottom: 44px;
    margin-left: 35px;
    height: auto;
    .activity-name {
      width: 380px;
      font-weight: 500;
      font-size: 47px;
      line-height: 62px;
      height: auto;
      color: #000000;
      word-wrap: break-word;
    }
    .activity-tags {
      display: flex;
      margin-top: 20px;
      font-family: "MiSans";
      font-style: normal;
      font-weight: 400;
      font-size: 30px;
      line-height: 40px;
      color: #767676;
      .type-tag {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 125px;
        height: 50px;
        background: #d9d9d9;
        border-radius: 60px;
      }
      .number-tag {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 125px;
        height: 50px;
        margin-left: 12px;
        background: #d9d9d9;
        border-radius: 60px;
      }
    }
    .activity-time {
      display: flex;
      align-items: center;
      margin-top: 25px;
      font-family: "MiSans";
      font-style: normal;
      font-weight: 400;
      font-size: 30px;
      line-height: 40px;
      color: #646464;
      .time-icon {
        width: 36px;
        height: 36px;
        margin-right: 8px;
      }
    }
    .activity-location {
      display: flex;
      align-items: center;
      font-family: "MiSans";
      font-style: normal;
      font-weight: 400;
      font-size: 30px;
      line-height: 40px;
      color: #646464;
      margin-top: 15px;
      .location-icon {
        width: 36px;
        height: 36px;
        margin-right: 8px;
      }
    }
  }

  .activity-button {
    display: flex;
    flex-direction: column;
    margin-right: 15px;
    margin-left: auto;

    .join-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 280.18px;
      height: 75.2px;
      background: linear-gradient(177.68deg, #ff6a0e 1.95%, #feaa01 156.14%);
      border-radius: 79px;
      font-weight: 500;
      font-size: 40px;
      line-height: 53px;
      color: #ffffff;
      transform: matrix(1, -0.01, 0.01, 1, 0, 0);
    }
    .check-details-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 280.18px;
      height: 75.2px;
      margin-top: 30px;
      background: #d9d9d9;
      border-radius: 79px;
      font-weight: 500;
      font-size: 40px;
      line-height: 53px;
      color: #646464;
    }
  }
}
</style>
