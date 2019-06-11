// pages/partner/index.js
const util = require('../../utils/util.js')
var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArr: {
      curHdIndex: 1,
      curBdIndex: 1
    },
    currentTab: 0,
    page:1,

    usercount1: 0,
    usercount2: 0,
    userInforArray1: [],
    userInforArray2: [],
    hasMore:false
  },
  //事件处理函数
  tabFun: function (e) {
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj,
      page:1,
      userInforArray1: [],
      userInforArray2: [],
      usercount1: 0,
      usercount2: 0,
    });

    if (_datasetId ==1){
      this.queryFans();
    }else{
      this.queryMyVip();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var  that = this;
    that.queryFans();
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  bindDownLoad: function () {
    //  该方法绑定了页面滑动到底部的事件
    var that = this;
    if(that.data.hasMore){
      that.setData({
        page:that.data.page+1
      })
      that.queryFans();
    }else{
      console.log('没有更多的数据')
    }
  },

  bindDownLoad2: function () {
    //  该方法绑定了页面滑动到底部的事件
    var that = this;
    if (that.data.hasMore) {
      that.setData({
        page: that.data.page+1
      })
      that.queryMyVip();
    } else {
      console.log('没有更多的数据')
    }
  },

  refresh: function (event) {
    var that = this;
    that.setData({
      page: 1,
      userInforArray1: [],
      userInforArray2: [],
      usercount1: 0,
      usercount2: 0,
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  queryFans:function(){
    var that = this;
    let data = {
      service: 'queryFans',
      requestLevel: 'levelOne',
      pageNo:that.data.page
    }
 
    wx.showLoading({
      title: '加载中',
    })
    App.fetchPost(data, function (res) {
      if (res.code==1) {
        console.log(res);
        var list = that.data.userInforArray1;
        if (that.data.page > 1) {
          for (var i = 0; i < res.data.length; i++) {
            list.push(res.data[i]);
          }
        } else {
          list = res.data;
        }

        that.setData({
          usercount1: res.count,
          userInforArray1: list,
          hasMore:res.hasMore
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    })
  },
  queryMyVip :function(){
    var that = this;
    let data = {
      service: 'queryFans',
      requestLevel: 'levelOneVip',
      pageNo: that.data.page
    }
    App.fetchPost(data, function (res) {
      if (res.code == 1) {
        console.log(res);
        var list = that.data.userInforArray2;
        if (that.data.page > 1) {
          for (var i = 0; i < res.data.length; i++) {
            list.push(res.data[i]);
          }
        } else {
          list = res.data;
        }

        that.setData({
          usercount2: res.count,
          userInforArray2: list,
          hasMore: res.hasMore
        })
      }
    })
  }
})