export default defineAppConfig({
  pages: [ 
    "pages/launch/index",
    "pages/home/index",
    "pages/activity-create/index",
    "pages/activity-details/index",
    "pages/personal-home/index",
    "pages/personal-joined/index",
    "pages/personal-created/index"
  ],
  tabBar: {
    selectedColor: "#ff6a0e",
    color: "#000",
    backgroundColor: "#fff",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/home/index",
        iconPath: "assets/images/home-icon.png",
        selectedIconPath: "assets/images/home-icon-selected.png",
        text: "首页"
      },
      {
        pagePath: "pages/activity-create/index",
        iconPath: "assets/images/create-icon.png",
        selectedIconPath: "assets/images/create-icon-selected.png",
        text: "发起活动"
      },
      {
        pagePath: "pages/personal-home/index",
        iconPath: "assets/images/personal-icon.png",
        selectedIconPath: "assets/images/personal-icon-selected.png",
        text: "我的"
      }
    ]
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#ff6a0e",
    navigationBarTextStyle: "white",
    backgroundColor: "#eeeeee"
  }
});
