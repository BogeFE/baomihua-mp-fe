import { defineStore } from "pinia";
import Taro from "@tarojs/taro";
import { BASE_URL } from "../utils/baseURL";
import useBasicInfoStore from "./basicInfo";

const useDetailsStore = defineStore("userDetails", {
  state: () => {
    return {
      actId: 0,
      state: 0,
      actName: "",
      beginDate: "",
      location: "",
      locationName: "",
      telephone: "",
      type: "",
      typeName: "",
      currentNumber: 0,
      totalNumber: 0,
      description: "",
      topPictureUrl: "",
      previewPicture: "",
      locationPictureUrl: ""
    };
  },
  actions: {
    checkDetails(actId) {
      //对接查看详情接口
      //将请求所获得的活动详情数据存入details仓库
      //在跳转到活动详情页时会调用details仓库的state来填充详情页面
      const that = this;
      Taro.request({
        url: BASE_URL + "/act/detail",
        method: "GET",
        header: {
          token: Taro.getStorageSync("token")
        },
        data: {
          actId: actId
        },
        success: function(res) {
          console.log("成功");
          console.log(res.data.data);
          that.actId = res.data.data.actId;
          that.state = res.data.data.state;
          that.actName = res.data.data.actName;
          that.beginDate = res.data.data.beginDate;
          that.location = res.data.data.location;
          that.locationName = res.data.data.locationName;
          that.type = res.data.data.type;
          that.typeName = res.data.data.typeName;
          that.telephone = res.data.data.telephone;
          that.currentNumber = res.data.data.joinNumber;
          that.totalNumber = res.data.data.number;
          that.description = res.data.data.description;
          that.topPictureUrl = res.data.data.topPictureUrl;
          that.previewPicture = res.data.data.previewPicture;
          that.locationPictureUrl = res.data.data.locationPictureUrl;
          console.log(that);

          // @ts-ignore
          if (res.data.code === 0) {
            //将请求所获得的活动详情数据存入details仓库
            Taro.navigateTo({
              url: "../../pages/activity-details/index"
            });
          } else {
            Taro.showToast({
              // @ts-ignore
              title: res.code + ":" + res.message,
              icon: "none"
            });
          }
        },
        fail: function(res) {
          console.log("失败");
          Taro.showToast({
            title: res.errMsg,
            icon: "none"
          });
        }
      });
    },

    joinActivity(actId) {
      return new Promise((resolve, reject) => {
        Taro.request({
          url: BASE_URL + "/act/joinAct",
          method: "POST",
          data: {
            actId: actId
          },
          header: {
            token: Taro.getStorageSync("token")
          },
          timeout: 1000,
          success: function(res) {
            console.log(res);
            resolve(1);
          },
          fail: function(res) {
            reject(res);
          }
        });
      });
    }
  }
});

export default useDetailsStore;
