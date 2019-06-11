// pages/upgrade/upgrade.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var _this =this;
    if (App.globalData.userInfo) {
      _this.setData({
        userInfo: App.globalData.userInfo
      });
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

  goUpgrade1:function(){
    var  _this =this;
    wx.showModal({
      title: '提示',
      content: '你的专属导师微信号：hisser520\n请复制微信号去添加导师协助建群升级赚钱~\n 添加时请备注：你的邀请码（'+_this.data.userInfo.memberNo+')',
      confirmText: '复制微信',
      cancelText: '取消',
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
  goUpgrade2:function(){

  }

})