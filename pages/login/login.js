// pages/login.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCode: false,
    showMobile: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let userSecKey = wx.getStorageSync("userSecKey");
    let pid = wx.getStorageSync("pid");
    if (!userSecKey && !pid) {
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              let data = {
                service:"checkMiniLogin",
                code:res.code
              };
              app.fetchPost(data, function (res) {
                if (res.code == 1) {
                 console.log("user already exists");
                } else {
                  this.setData({
                    showCode: true
                  }) 
                }
              });
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  noCode:function(){
    wx.showModal({
      title: '获取邀请码',
      content: '联系好友要一个，或者去网上搜索“众享邀请码”',
    })
  },
  /**
   * 授权登录
   */
  authorLogin: function(e) {
    let _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      applyNotice();
      return false;
    }
    let pid = wx.getStorageSync("pid");
    //获取用户数据
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.navigateBack();
    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          e.detail.code = res.code;
          e.detail.pid = pid;
          _this.getUserInfo(e.detail, _this.checkMobile);
        }
      })
    }

  },
  getUserInfo: function (res, callback) {
    var that = this
    var url = app.globalData.serverUrl + "/api/gateWay";
    var data;
    if (wx.getStorageSync("userSecKey")) {
      data = {
        "service": "wxUserInfo",
        userSecKey: wx.getStorageSync("userSecKey")
      }
    } else {
      data = {
        "service": "wxUserInfo",
        "code": res.code == undefined ? "" : res.code,
        "pid": res.pid == undefined ? "" : res.pid,
        "encryptedData": res.encryptedData,
        "iv": res.iv,
        "miniCode": app.globalData.miniCode
      }
    }
    console.log(data)
    app.fetchPost(data,function (res) {
      if (res.code == 1) {
        app.globalData.userInfo = res.user;
        wx.setStorageSync('userInfo', res.user);
        wx.setStorageSync('accessToken', res.accessToken);
        wx.setStorageSync('userSecKey', res.userSecKey);
          if (callback && typeof (callback) == "function") {
            callback(res);
          }
        } else {
        console.log(res)
          wx.showToast({
            title: "出错了",
            icon: 'none',
            duration: 1000
          })
        }
      },
      function (err) {
        console.log(err)
        wx.showToast({
          title: "出错了",
          icon: 'none',
          duration: 2000
        })
      }
    )
  },
  checkMobile:function(res){
    let userInfo = res.user;
    if(!userInfo.mobile){
      this.setData({
        showMobile:true
      });
    }else{
      this.navigateBack();
    }

  },
  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function() {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  },
  getPhoneNumber:function(e) {
    var _this = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    e.detail.service = "getMiniPhoneInfo";
    app.fetchPost(e.detail, function (res) {
      if (res.code == 1) {
        app.globalData.userInfo = res.user;
        _this.navigateBack();
      } else {
        wx.showToast({
          title: '获取手机信息失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  bindInviteCode: function(e) {
    var _this = this;
    let key = e.detail.value;
    if (key.length >= 6) {
      _this.setData({
        inviteCode: key
      });
    }
  },
  checkCode: function(e) {
    var _this = this;
    let code = this.data.inviteCode;
    if (!code) {
      wx.showToast({
        title: '清先输入邀请码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (code.length < 6) {
      wx.showToast({
        title: '无效的邀请码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let data = {
      service: 'checkInviteCode',
      inviteCode: code
    };
    app.fetchPost(data, function(res) {
      if (res.code == 1) {
        wx.setStorageSync('pid', res.pid);
        _this.setData({
          showCode: false
        });
      } else {
        wx.showToast({
          title: '无效的邀请码',
          icon: 'none',
          duration: 2000
        })
      }
    });
  }
})

function applyNotice() {
  wx.showModal({
    title: '警告',
    content: '您点击了拒绝授权，无法使用此功能。',
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        wx.openSetting({
          success: (res) => {
            if (!res.authSetting["scope.userInfo"]) {
              applyNotice()
            } else {
              wx.getUserInfo({
                success: res => {
                  app.getUserInfo(res)
                }
              })
            }
          }
        })
      }
    }
  })
}