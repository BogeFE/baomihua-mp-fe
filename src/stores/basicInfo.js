import { BASE_URL } from "../utils/baseURL";
import Taro from "@tarojs/taro";
import { defineStore } from "pinia";

const useBasicInfoStore = defineStore("userInfo", {
  state: () => {
    return {
      nickName: "微信用户",
      avatarUrl: "",
      locationNameSelector: ["点击选择活动地点"],
      typeNameSelector: ["点击选择活动类型"],
      locationKey: ["NotSelected"],
      typeKey: ["NotSelected"],
      joinedActityId: Array()
    };
  },
  actions: {
    getLabelList() {
      const that = this;
      Taro.request({
        url: BASE_URL + "/label/list",
         method: "GET",
        header: {
          token: Taro.getStorageSync("token")
        }
      }).then(function(res) {
        console.log(res)

        res.data.data.locationLabelList.map(label => {
          that.locationKey.push(label.labelKey);
          that.locationNameSelector.push(label.description);
        });
        res.data.data.typeLabelList.map(label => {
          that.typeKey.push(label.labelKey);
          // @ts-ignore
          that.typeNameSelector.push(label.description);
        });
      });
    }
  }
});

export default useBasicInfoStore;
