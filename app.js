//app.js

App({
  /**
 * 全局变量
 */
  globalData: {
    userInfo: null,
    miniCode: "zx",
    // serverUrl: "https://yfb.yuezijie.cn",
    serverUrl: "http://192.168.9.109:8080",
    toolCode: 'newer',
  },

  onLaunch: function () {
    var that = this
    let App = this;

    let userInfo = wx.getStorageSync('userInfo');
    console.log("userInfo", userInfo);
    if (userInfo) {
      App.globalData.userInfo = userInfo;
    }

  },




  //公用底层请求方法，suc,fail为回调函数
  httpRequest: function (data, suc, fail) {
    var url = this.globalData.serverUrl + "/api/gateWay";
    if (wx.getStorageSync("accessToken")){
      data.accessToken = wx.getStorageSync("accessToken")
      data.userSecKey = wx.getStorageSync("userSecKey")
    }
    data.checkToken = 0
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: suc,
      fail: fail
    })
  },


  /**
   * 执行用户登录
   */
  doLogin() {
    // 保存当前页面
    let pages = getCurrentPages();
    if (pages.length) {
      let currentPage = pages[pages.length - 1];
      "pages/login/login" != currentPage.route &&
        wx.setStorageSync("currentPage", currentPage);
    }
    // 跳转授权页面
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },


  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    // console.log(msg)
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback();
      }
    });
  },


  /**
   * post提交
   */
  fetchPost(data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let App = this;
    // 构造请求参数
    if (wx.getStorageSync("accessToken")) {
      data.accessToken = wx.getStorageSync("accessToken")
      data.userSecKey = wx.getStorageSync("userSecKey")
    }

    wx.request({
      url: App.globalData.serverUrl + "/api/gateWay",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: data,
      success(res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          App.showError('网络请求出错');
          return false;
        }
        if (res.data.code === -1 || res.data.code === 2) {
          // 登录态失效, 重新登录
          App.doLogin(() => {
            App.fetchPost(data, success, fail);
          });
          return false;
        } else if (res.data.code === 0) {
          App.showError(res.data.message, () => {
            fail && fail(res);
          });
          return false;
        }
        success && success(res.data);
      },
      fail(res) {
        App.showError(res.errMsg, () => {
          fail && fail(res);
        });
      },
      complete(res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },


  /**
   * 获取tabBar页面路径列表
   */
  getTabBarLinks() {
    return tabBarLinks;
  },
  
})