let App = getApp();

var pageNo = 1;
var catId = 0;
var adIndex = 0;

Page({
  data: {
    userInfo: {},
    navList: [],
    adList: [],
    hotGoods: [],
    goodsList: [],
    bannerAd: [],
    popAds: [],
    popAdsHidden: true,
    scrollTop: 0,
    scrollHeight: 0,
    pageNo: 1,
    catId: 0,
    hidden: false,
    grade:null
  },

  onShow: function() {
    
  },

  onLoad: function(e) {
    console.log("pid=" + e.pid)
    if (e.pid) {
      wx.setStorageSync("pid", e.pid);
    }

    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    //获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          grade: res.data.grade
        });
      },
    })
    this.getHomeData();
    this.getTopGoodsList(catId);
    
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    let pid = "0";
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo){
      pid=userInfo.userId;
    }
    return {
      title: "众享社交电商",
      path: "/pages/index/index?pid="+pid
    };
  },

  bindDownLoad: function() {
    //  该方法绑定了页面滑动到底部的事件

    var that = this;
    this.getTopGoodsList(catId);
  },
  refresh: function(event) {
    //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新  
    var that = this;
    that.setData({
      list: [],
      scrollTop: 0
    });
    // getTopGoodsList(that);
  },

  getHomeData: function() {
    var that = this;
    let data = {
      service: 'miniHomeList',
    }
    App.fetchPost(data, function(res) {
      console.log(res);
      if (res) {
        that.setData({
          adList: res.mainAds,
          navList: res.categories,
          bannerAd: res.bannerAds,
          popAds: res.popAds,
          hotGoods: res.hotGoods
        });
        that.PopAd(res.popAds);
      }
    });
  },

  PopAd: function(popAds) {
    var that = this;
    if (popAds.length > 0) {
      //本地缓存的adId
      let popList = [];
      const KEYS = wx.getStorageInfoSync();//缓存中数据
      for (var i = 0; i < popAds.length; i++) {
        var count = 0;
        for (var j = 0; j < KEYS.keys.length; j++) {
          if (popAds[i].adId == KEYS.keys[j]) {//判断查询出的数据是否在缓存中
           count +=1;
            break;
          } 
        }
        if(count ==1){
          that.setData({
            popAdsHidden: true,
            popAds: popList
          });
        }else{
          popList.push(popAds[i]);
          that.setData({
            popAdsHidden: false,
            popAds: popList
          });
          break;
        }
      }
    }
  },


  getTopGoodsList: function(catIds) {
    wx.showLoading({
      title: '加载中',
    })

    var that = this;
    let data = {
      service: 'queryTBKChannelCoupons',
      pageNo: pageNo,
      pageSize: 20,
      channel: 'jdCat',
      catId: catIds,
    };
    App.fetchPost(data, function(res) {
      console.log(res);
      if (res.code == 1) {
        var list = that.data.goodsList;
        if (pageNo > 1) {
          for (var i = 0; i < res.data.length; i++) {
            list.push(res.data[i]);
          }
        } else {
          list = res.data;
        }
        that.setData({
          goodsList: list,
        })
        if (res.totalPage > pageNo) {
          pageNo++;
        }
      }
      setTimeout(function() {
        wx.hideLoading()
      }, 2000)
    });
  },
  //点击分类，通过catId查询数据
  changeCatId: function(event) {
    var that = this;
    console.log(event.currentTarget.id);
    var hiddens;
    if (event.currentTarget.id == 0) {
      hiddens = false;
    } else {
      hiddens = true;
    }
    console.log(hiddens);
    that.setData({
      catId: event.currentTarget.id,
      hidden: hiddens,
    })
    catId = event.currentTarget.id;
    pageNo = 1;
    that.goodsList = [];
    console.log(catId);
    this.getTopGoodsList(catId);
  },
  //打开AD
  openAd: function(event) {
    let adLink = event.currentTarget.dataset.url;
    let adId = event.currentTarget.dataset.id;
    var that = this;
    that.setData({
      popAdsHidden: true
    });
    //将id存入本地
    wx.setStorageSync("" + adId, adId);
    wx.navigateToMiniProgram({
      appId: "wx13e41a437b8a1d2e",
      path: adLink,
    })
  },
  //关闭ad
  closeAd: function(event) {
    let adId = event.currentTarget.dataset.id;
    //将id存入本地
    wx.setStorageSync("" + adId, adId);
    //刷新数据
    var that = this;
    let data = {
      service: 'miniHomeList',
    }
    App.fetchPost(data, function(res) {
      if (res) {
        that.PopAd(res.popAds);
      }
    })
  },

  openStrategy:function(event){
    //打开模块图
    let url=event.currentTarget.dataset.url;
    wx.switchTab({
      url: '../strategy/index',
    })
  },
  openFuli:function(event){
  
    wx.navigateTo({
      url: '../activity/fuli'
    })
  },
  openCreateGroup:function(){
    wx.navigateTo({
      url: '../activity/createGroup'
    })
  },
  openBanner: function(event){
    let adId = event.currentTarget.dataset.adid;
    wx.navigateTo({
      url: '../activity/index?activity_id='+adId
    })
  },
  openMainAd :function(event){
    let bizCode = event.currentTarget.dataset.bizcode;
    let adId = event.currentTarget.dataset.adid;
    let bizId = event.currentTarget.dataset.bizid;//广告类型ID
    console.log(event.currentTarget);
    if(bizCode =="other"){//其他
      wx.navigateTo({
        url: '../activity/index?activity_id=' + adId
      })
    }else if(bizCode =="product"){//单品

    }else if(bizCode =="album"){//专辑
      wx.navigateTo({
        url: '../album/album?bizId=' + bizId,
      })
    }else if(bizCode =="subject"){//专题

    }
  }

})