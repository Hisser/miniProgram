let App = getApp();

Page({
  data: {
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    scrollHeight: null,
    showView: false,
    arrange: "",

    option: {},
    switchFlag:false,

    goodsList: [],
    hasMore: true,
    hasCoupon: true,
    sort: null,
    pageNo: 1,
    totalPage: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    let _this = this;

    // 设置商品列表高度
    _this.setListHeight();

    // 记录option
    _this.setData({
      option
    }, function() {
      let searchWord = _this.data.option.search || '';
      searchWord = (searchWord ? searchWord : "搜索商品");
      if (searchWord) {
        _this.setData({
          searchName: searchWord,
        });
      }

      // 获取商品列表
      _this.getGoodsList(1);
    });
  },

  /**
   * 获取商品列表
   */
  getGoodsList: function(page) {

    wx.showLoading({
      title: '加载中',
    })

    let _this = this;

    let data = {
      pageNo: page,
      pageSize: 10,
      service: 'searchMaterialOpt',
      q: _this.data.option.search || '',
      sort: _this.data.sort,
      hasCoupon: _this.data.hasCoupon,
      plat: 'jd',
    };

    App.fetchPost(data, function(result) {
      console.log(result);
      if (result.code === 1) {
        let allData = _this.data.goodsList;

        if (allData && allData.length > 0) {
          allData.push(...result.data);
        } else {
          allData = result.data;
        }

        _this.setData({
          goodsList: allData,
          hasMore: result.hasMore,
          totalPage: result.totalPage,
          pageNo: page,
        });
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    });
  },


  /**
   * 设置商品列表高度
   */
  setListHeight: function() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          scrollHeight: res.windowHeight -123,
        });
      }
    });
  },


  /**
   * 切换排序方式
   */
  switchSortType: function(e) {
    let _this = this,
      newSortType = e.currentTarget.dataset.type;
    newSortType = (newSortType === 'all' ? null : newSortType); 
  
    if (_this.data.sort == "price_asc"){
      newSortType ="price_desc";
    }
    console.log(_this.data.sort,newSortType);
    _this.setData({
      goodsList: [],
      page: 1,
      sort: newSortType,
      hasMore: true,
    }, function() {
      // 获取商品列表
      _this.getGoodsList(1);
    });
  },

  /**
   * 切换有券无券
   */
  switchHasCoupon: function(e) {
    console.log(e.detail.value);
    let _this = this;
    _this.setData({
      goodsList: [],
      page: 1,
      hasCoupon: e.detail.value,
      hasMore: true,
    }, function() {
      // 获取商品列表
      _this.getGoodsList(1);
    });
  },

  /**
   * 切换列表显示方式
   */
  onChangeShowState: function() {
    let _this = this;
    _this.setData({
      showView: !_this.data.showView,
      arrange: _this.data.arrange ? "" : "arrange"
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function() {
    // 已经是最后一页
    if (!this.data.hasMore) {
      return false;
    }
    this.getGoodsList(++this.data.pageNo);
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function() {
    // return {
    //   title: "全部分类",
    //   desc: "",
    //   path: "/pages/category/index"
    // };
  },

});