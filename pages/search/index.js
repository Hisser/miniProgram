let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentSearch: [],
    searchValue: '',
    hotWordsUrl: 'https://suggest.taobao.com/sug?area=sug_hot&wireless=2&code=utf-8&nick=&sid=null',
    hotWords: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取历史搜索
    this.getRecentSearch();
    this.getHotWords();
  },

  /**
       * 获取商品列表
       */
  getHotWords: function () {
    let _this = this;
    wx.request({
      url: _this.data.hotWordsUrl,
      header: {
        'content-type': 'application/json'
      },
      dataType: "jsonp",
      success(res) {
        if (res.statusCode !== 200 || typeof res.data !== 'object') {
          let data = JSON.parse(res.data);
          _this.setData({
            hotWords: data.querys,
          });
        }
      },
    });
  },

  /**
   * 获取历史搜索
   */
  getRecentSearch: function () {
    let recentSearch = wx.getStorageSync('recentSearch');
    this.setData({ recentSearch });
  },

  /**
   * 绑定输入值
   */
  getSearchContent: function (e) {
    this.data.searchValue = e.detail.value;
  },

  /**
   * 搜索提交
   */
  search: function () {
    if (this.data.searchValue) {
      // 记录最近搜索
      let recentSearch = wx.getStorageSync('recentSearch') || [];
      if (recentSearch && recentSearch.indexOf(this.data.searchValue) > -1){
        let index = recentSearch.indexOf(this.data.searchValue);
        recentSearch.splice(index, 1);
      }
      recentSearch.unshift(this.data.searchValue);
      wx.setStorageSync('recentSearch', recentSearch)
      
      // 跳转到商品列表页
      wx.navigateTo({
        url: '../searchresult/index?search=' + this.data.searchValue,
      })
    }
  },

  /**
   * 清空最近搜索记录
   */
  clearSearch: function () {
    wx.removeStorageSync('recentSearch');
    this.getRecentSearch();
  },

  /**
   * 跳转到最近搜索
   */
  goSearch: function (e) {
    wx.navigateTo({
      url: '../searchresult/index?search=' + e.target.dataset.text,
    })
  },

})