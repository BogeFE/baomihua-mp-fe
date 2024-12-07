import { createApp } from "vue";
import { createPinia } from "pinia";
import Taro from "@tarojs/taro";
import useBasicInfoStore from "./stores/basicInfo";
import { BASE_URL } from "./utils/baseURL";
import "./app.scss";

const pinia = createPinia();
const App = createApp({
  onLaunch() {
    //step_1-checkSession
    Taro.checkSession({
      //登录态有效——直接登录
      success: function() {
        //这里得有一个请求昵称头像的过程
        Taro.request({
          url: BASE_URL + "/user/info",
          method: "GET",
          header: {
            token: Taro.getStorageSync("token")
          },
          timeout: 2000
        })
          .then(res => {
            console.log(res);
            const userInfoStore = useBasicInfoStore();

            //设置用户昵称和头像
            userInfoStore.avatarUrl = res.data.data.avatarUrl;
            userInfoStore.nickName = res.data.data.nickName;

            //获取标签列表
            userInfoStore.getLabelList();
          })
          .then(() => {
            Taro.switchTab({
              url: "../home/index"
            });
          })
          .catch(r => {
            console.log("app.js line-63" + r);
          });
      },
      //登录态失效or新用户——重新登陆
      fail: function() {
        Taro.login({
          //获取code失败的回调
          success: res => {
            if (res.code) {
              console.log("code:" + res.code);

              //发起登录请求
              Taro.request({
                url: BASE_URL + "/user/login",
                data: {
                  code: res.code
                },
                method: "GET",
                //登录接口请求成功的回调
                success: res => {
                  console.log("login接口返回数据:" + res);

                  // @ts-ignore
                  if (res.data.code === 0) {
                    // @ts-ignore
                    console.log("token值为:" + res.data.data);

                    //存储token
                    Taro.setStorageSync("token", res.data.data);

                    //存储token后询问用户是否授权头像
                    Taro.showModal({
                      title: "温馨提示",
                      content: "获取您的昵称以及头像",
                      success: function(res) {
                        const userInfoStore = useBasicInfoStore();
                        //用户点击确认授权
                        if (res.confirm) {
                          //调用获取用户信息接口
                          Taro.getUserProfile({
                            desc: "我们将获取您的头像和昵称",
                            success: function(res) {
                              console.log("用户基本信息:" + res.userInfo);

                              //本地直接使用所获得的昵称和头像
                              userInfoStore.avatarUrl = res.userInfo.avatarUrl;
                              userInfoStore.nickName = res.userInfo.nickName;
                              userInfoStore.getLabelList();

                              //获得用户信息后需要传给后端
                              Taro.request({
                                url: BASE_URL + "/user/saveInfo",
                                method: "POST",
                                header: {
                                  token: Taro.getStorageSync("token")
                                },
                                data: {
                                  avatarUrl: res.userInfo.avatarUrl,
                                  nickName: res.userInfo.nickName
                                }
                              })
                                .then(() => {
                                  console.log("成功传给服务端!");
                                })
                                .catch(r => {
                                  console.log(r);
                                })
                                .finally(() => {
                                  //无论是否给到后端都跳转到主页
                                  Taro.switchTab({
                                    url: "../home/index"
                                  });
                                });
                            }
                          });
                        }
                      }
                    });
                  } else {
                    Taro.showToast({
                      title: "失败",
                      icon: "error",
                      duration: 2000
                    });
                  }
                },
                //登陆接口请求失败的回调
                fail: res => {
                  console.log(res.errMsg);
                  Taro.showToast({
                    title: res.errMsg,
                    icon: "none",
                    duration: 2000
                  });
                }
              });
            } else {
              Taro.showToast({
                title: res.errMsg,
                icon: "none",
                duration: 2000
              });
              console.log(res.errMsg);
            }
          },
          //获取code成功的回调
          fail: res => {
            Taro.showToast({
              title: "获取code失败",
              icon: "error",
              duration: 1000
            });
          }
        });
      }
    });
  }
});
App.use(pinia);

export default App;
