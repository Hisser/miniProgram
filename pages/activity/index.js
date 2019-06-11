let App = getApp(),
  wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id:null,
    activityContent: [],
    activityImgUrl: "",
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    console.log(options);
    _this.data.activity_id = options.activity_id;
    // 获取活动信息
    _this.getActivityDetail();
  },

  /**
     * 获取活动信息
     */
  getActivityDetail() {
    let _this = this;
    let data = {
      service: 'adDetailService',
      adId: _this.data.activity_id,
    }

    App.fetchPost(data, function (res) {
      if (res.code == 1) {
        var url = res.adContent[1];
        _this.setData({
          activityContent: res.adContent,
          activityImgUrl: res.adContent[1].indexOf("<img")!=-1 ? res.adContent[1].split('"')[1] :'',
        })
      }
    });
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

  copyActivityContent: function(e) {
    let _this = this;

    let list = _this.data.activityContent;
    let content=[];
    for(var i=0;i<list.length;i++){
        if(i>1){
          content.push(list[i]);
        }
    }
    if (content){
      let data = content.join('\n');

      wx.setClipboardData({
        data: data,
      })
    }
  },

  shareImage: function(e) {
    let _this = this;
    let url = _this.data.activityImgUrl;
    if (url!="") {
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
      })
    }else{
      wx.showToast({
        title: '无图可分享',
      })
    }

  },




})