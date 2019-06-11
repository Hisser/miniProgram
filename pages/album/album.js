// pages/album/album.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],//商品
    pageNo:1,
    pageSize:10,
    bizId:'',
    scrollHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      bizId: options.bizId
    })
    // that.data.bizId = options.bizId;
    that.queryAlbum();
    // 设置商品列表高度
    that.setListHeight();
  },
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight 
        });
      }
    });
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

  bindDownLoad: function () {
    //  该方法绑定了页面滑动到底部的事件

    var that = this;
    if(that.data.hasMore){
    that.queryAlbum();
    }else{
      console.log('没有更多数据了')
    }
  },

  //查询专辑商品
  queryAlbum: function(){
    var that=this;
    let  data={
      service: 'queryGroupDetail',
      groupId: that.data.bizId,
      pageNo:that.data.pageNo,
      pageSize:that.data.pageSize
    }
    App.fetchPost(data, function (res) {
      console.log(res);
      if (res.code == 1) {
        var list = that.data.goodsList;
        if (that.data.pageNo > 1) {
          for (var i = 0; i < res.data.length; i++) {
            list.push(JSON.parse(res.data[i].goodsInfo));
          }
        } else {
          for (var i = 0; i < res.data.length; i++) {
            list.push(JSON.parse(res.data[i].goodsInfo));
            
          }
          // list = res.data;
        }
        that.setData({
          goodsList: list,
        })
        if (res.totalCount > that.data.pageNo * that.data.pageSize) {
          that.setData({
            pageNo:that.data.pageNo+1,
            hasMore: true
          })
        }else{
          that.setData({
            hasMore: false
          })
        }
      }
    });


  }
})