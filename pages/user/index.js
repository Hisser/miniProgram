let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    menu:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this;
    that.queryMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前用户信息
    this.getUserDetail();
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail: function () {
     let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        });
      },
    })
  },
  queryMenu:function(){
     var that= this;
    let data = {
      service:'queryMiniContent'
    }
    console.log('wqewq')
    App.fetchPost(data, function (res) {
      console.log(res);
      if(res.code==1){
        that.setData({
          menu: res.tutorial_List
        })
      }
    });
  },


  /**
   * 菜单列表导航跳转
   */
  onTargetMenus(e) {
    // 记录formId
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: './help?index=' + e.currentTarget.dataset.id
    })
  },

})