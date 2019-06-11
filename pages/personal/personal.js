let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCurIndex:'today',

    orderCount:0,
    orderIncome:0,

    todayFans: 0,
    firstFans: 0,
    allFans: 0,
    userInfo:null,

    totalAmount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let _this = this;
    // // console.log('adsadasdasda')
    // if (App.globalData.userInfo) {
    //   _this.setData({
    //     userInfo: App.globalData.userInfo
    //   });
    // }else{
    //   wx.navigateTo({
    //     url: "/pages/login/login",
    //   });
    // }

    // _this.queryMyFans();
    // _this.getOrderInfo();
    // _this.getAccountInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    console.log('adsadasdasda')
    if (App.globalData.userInfo) {
      _this.setData({
        userInfo: App.globalData.userInfo
      });

      _this.queryMyFans();
      _this.getOrderInfo();
      _this.getAccountInfo();

    } else {
      wx.navigateTo({
        url: "/pages/login/login",
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  queryMyFans: function () {
    var that = this;
    let data = {
      service: 'queryFansFromSp',
      range: 'today',
    }
    App.fetchPost(data, function (res) {
      if (res) {
        if(res.code ==1){
          that.setData({
            todayFans: res.count[0],
            firstFans: res.count[1],
            allFans: res.count[2],
          })
        }
      }
    })
  },

  /**
   * 获取订单信息
   */
  getOrderInfo: function () {
    let _this = this;
    let data = {
      service: 'queryMiniOrderInfo',
      range: _this.data.tabCurIndex,
    };

    App.fetchPost(data, function (result) {
      if (result.code === 1) {
        _this.setData({
          orderCount: result.orderCount,
          orderIncome: result.Income,
        });
      }
    });
  },

  //事件处理函数
  tabFun: function (e) {
    let _this = this;
    //获取触发事件组件的dataset属性  
    let _datasetId = e.target.dataset.id;
    _this.setData({
      tabCurIndex: _datasetId,
    });

    _this.getOrderInfo();
  },



  /**
   * 复制到剪切板
   */
  copyContent(e) {
    let _this = this;

    let value = e.target.dataset.value;
    if (value) {
      wx.setClipboardData({
        data: value,
      })
    }
  },

  //获取会员额度信息
  getAccountInfo: function () {
    let _this = this;

    let data = {
      service: 'accountInfo'
    };
    App.fetchPost(data, function (result) {
      if (result.code === 1) {
        _this.setData({
          totalAmount: result.hbAvailableBalance,
        });
      }
    });
  },

wechatKefu:function(){
  wx.showModal({
    title: '提示',
    content: '你的专属客服微信号：hisser520\n关于省钱赚钱的问题,请复制微信号去添加好友咨询吧~\n 添加时请备注：众享成员',
    confirmText:'复制微信',
    cancelText:'取消',
    success(res) {
      if (res.confirm) {
        wx.setClipboardData({
          data: 'hisser520',
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
},
  openStrategy: function (event) {
    //打开模块图
    wx.switchTab({
      url: '../strategy/index',
    })
  },
  turnToVipRight:function(){
    wx.navigateTo({
      url: '../vip/vipright',
    })
  }

})