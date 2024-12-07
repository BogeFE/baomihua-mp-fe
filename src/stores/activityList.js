import { defineStore } from "pinia";
import Taro from "@tarojs/taro";
import { BASE_URL } from "../utils/baseURL";

const useActivityListStore = defineStore("activityList", {
  state: () => {
    return {
      homeActivityList: [],
      createdActivityList: [],
      joinedActivityList: []
    };
  },
  actions: {
    getActivityList(searchType, pageNum) {
      return new Promise((resolve, reject) => {
        var that = this;
        var currentList = [];

        if (searchType === 0) {
          currentList = that.homeActivityList;
        } else if (searchType === 2) {
          currentList = that.createdActivityList;
        } else if (searchType === 3) {
          currentList = that.joinedActivityList;
        }

        console.log(currentList);

        Taro.request({
          url: BASE_URL + "/act/list",
          method: "POST",
          header: {
            token: Taro.getStorageSync("token")
          },
          data: {
            pageNum: pageNum,
            pageSize: 6,
            searchType: searchType
            // 0：首页
            // 1：筛选
            // 2：我发起的
            // 3：我参加的
          },

          success: function(res) {
            console.log(res);

            //根据请求过的的列表长度判断是否已经是最后一次
            if (res.data.data.length === 0) {
              if (pageNum !== 0)
                Taro.showToast({
                  title: "已展示所有活动!",
                  icon: "none",
                  duration: 1000
                });
            } else {
              if (searchType === 0) {
                // @ts-ignore
                that.homeActivityList = currentList.concat(res.data.data);
                console.log(that.homeActivityList);
              } else if (searchType === 2) {
                // @ts-ignore
                that.createdActivityList = currentList.concat(res.data.data);
                console.log(that.createdActivityList);
              } else if (searchType === 3) {
                // @ts-ignore
                that.joinedActivityList = currentList.concat(res.data.data);
                console.log(that.joinedActivityList);
              }
            }
            resolve(res.data.data)
          },
          fail: function(err) {
            Taro.showToast({
              title: err.errMsg,
              icon: "error",
              duration: 1000
            });
            reject(err)
          }
        });
      });
    }
  }
});
export default useActivityListStore;
