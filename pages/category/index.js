const App = getApp();

Page({
  data: {
    // 搜索框样式
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    // 列表高度
    scrollHeight: 0,

    // 一级分类：指针
    catId: 1,
    curIndex: 0,

    // 分类列表
    firstList: [],
    list: [],

    // show
    notcont: false,

    allCatData: [],
  },

  onLoad: function() {
    let _this = this;
    // 设置分类列表高度
    _this.setListHeight();
    // 获取分类列表
    _this.getCategoryList(_this.data.catId, 'all');
  },

  /**
   * 设置分类列表高度
   */
  setListHeight: function() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          scrollHeight: res.windowHeight - 47,
        });
      }
    });
  },

  /**
   * 获取分类列表
   */
  getCategoryList(catId, type) {
    let _this = this;
    //先检查是否已经查询过了
    let find = false;
    let existData = _this.data.allCatData;
    for (let i = 0; i < existData.length; i++) {
      if (existData[i].catId === catId) {
        _this.setData({
          list: existData[i].list,
        });
        find = true;
        break;
      }
    }

    if (!find) {
      let data = {
        service: 'queryJdCategory',
        catId: catId,
        type: type,
      }

      App.fetchPost(data, function(res) {
        console.log(res);
        if (res.code == 1) {
          if (res.all_cats) {
            _this.setData({
              firstList: res.all_cats,
              notcont: !res.all_cats.length
            });
          }
          if (res.cats) {
            let item = {
              catId: catId,
              list: res.cats
            };
            existData.push(item);
            _this.setData({
              list: res.cats,
              allCatData: existData,
            });
          }
        }
      });
    }

  },

  /**
   * 一级分类：选中分类
   */
  selectNav: function(t) {
    let _this = this;
    console.log("t", t);
    let catId = t.target.dataset.id;
    let curIndex = parseInt(t.target.dataset.index);
    _this.setData({
      catId,
      curIndex,
      scrollTop: 0
    }, function() {
      _this.getCategoryList(_this.data.catId, '');
    });
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function() {
    return {
      title: "全部分类",
      path: "/pages/category/index"
    };
  }

});