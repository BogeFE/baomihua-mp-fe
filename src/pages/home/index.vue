<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <view class="home-page">
    <view class="title-bar">
      <view class="small-rectangle"></view>
      <text class="list-title">活动列表</text>
    </view>

    <view class="blank-page" v-if="blank">
      <image class="blank-icon" src="../../assets/images/blank-icon.png" />
      <text class="blank-text">暂时没有可报名的活动,</text>
      <text class="blank-text">快去发起活动吧!</text>
    </view>

    <ActivityCard
      v-for="activity in listStore.homeActivityList"
      :key="
        // @ts-ignore
        activity.actId // @ts-ignore
        // @ts-ignore
      "
      :actId="activity.actId"
      :actName="activity.actName"
      :type="activity.typeName"
      :beginDate="activity.beginDate"
      :location="activity.locationName"
      :total="activity.number"
      :previewPicture="activity.previewPicture"
    ></ActivityCard>
  </view>
</template>

<script>
import { ref } from "vue";
import ActivityCard from "../../components/ActivityCard.vue";
import useActivityListStore from "../../stores/activityList";

export default {
  setup() {
    const listStore = useActivityListStore();
    const pageNum = ref(0);
    const blank = ref(false);
    const showFilter = ref(false);
    return {
      listStore,
      pageNum,
      blank,
      showFilter
    };
  },
  components: {
    ActivityCard,
  },
  onShow() {
    var that = this;
    that.pageNum = 0;
    that.listStore.homeActivityList = [];
    that.listStore.getActivityList(0, that.pageNum).then(() => {
      if (!that.listStore.homeActivityList.length && !that.pageNum) {
        that.blank = true;
      }
    });
  },
  onReachBottom() {
    //上滑请求新的数据
    var that = this;
    var pageNum = that.pageNum + 1;
    that.listStore.getActivityList(0, pageNum);
    that.pageNum = pageNum;
  }
};
</script>

<style lang="scss">
.home-page {
  width: 100%;
  height: 1000px;
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
}

.title-bar {
  display: flex;
  height: auto;
  width: auto;
  margin: 40px 28px 0px;
  border: 8px solid linear-gradient(180deg, #ff7210 0%, #ff5f0c 100%);
  .small-rectangle {
    width: 8px;
    height: 57px;
    margin-top: 10px;
    background: linear-gradient(180deg, #ff7210 0%, #ff5f0c 100%);
  }
  .list-title {
    margin-left: 10px;
    font-family: "MiSans";
    font-style: normal;
    font-weight: 500;
    font-size: 53px;
    line-height: 70px;

    color: #25221f;
  }
  .filter-icon {
    width: 168px;
    height: 66px;
    margin-top: 4px;
    margin-left: auto;
  }
}

.blank-page {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
  .blank-icon {
    width: 250px;
    height: 250px;
  }
  .blank-text {
    margin-top: 20px;
    text-align: center;
    font-style: normal;
    font-weight: 400;
    font-size: 45px;
    line-height: 45px;
  }
}
</style>
