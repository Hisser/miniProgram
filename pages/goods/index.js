let App = getApp(),
  wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航

    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长

    currentIndex: 1, // 轮播图指针
    floorstatus: false, // 返回顶部
    showView: true, // 显示商品规格

    scrollTop: 0,

    goodsInfo: {},
    couponUrl: null,
    clickUrl: null,
    jd_click_url: null,
    jd_coupon_url: null,
    posterUrl: null,

    menu_hide:true,
  },

  // 记录规格的数组
  goods_spec_arr: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    if (options.pid) {
      wx.setStorageSync("pid", options.pid);
    }

    // 商品id
    _this.setData({
      goods_id: options.goods_id,
    });

    // 获取商品信息
    _this.getGoodsDetail();
  },

  /**
   * 获取商品信息
   */
  getGoodsDetail() {
    let _this = this;
    let data = {
      service: 'queryGoodsDetail',
      goodsId: _this.data.goods_id,
      plat: 2,
      from: 'mini'
    }

    App.fetchPost(data, function(res) {
      if (res.code == 1) {

        let click_Url = res.data.details.clickUrl;
        let coupon_Url = res.data.details.clickUrl;
        if (res.data.details.couponUrl) {
          coupon_Url = res.data.details.couponUrl;
        }

        let res_data = res.data.info;
        if (!res_data.goodsGallery) {
          res_data.goodsGallery = [res_data.picUrl];
        }

        let encode_click_url = encodeURIComponent(click_Url);
        // 详情页面
        let jd_click_url = `/pages/product/product?wareId=${res.data.info.goodsId}&spreadUrl=${encode_click_url}&customerinfo=20190529zhx`;
        let jd_coupon_url = jd_click_url;

        if (res_data.hasCoupon && res.data.details.couponUrl) {
          let encode_coupon_url = encodeURIComponent(coupon_Url);
          // 领券页面
          jd_coupon_url = `/pages/jingfen_twotoone/item?spreadUrl=${encode_coupon_url}&customerinfo=20190529zhx`;

          if (jd_coupon_url) {
            jd_click_url = jd_coupon_url;
          }
        }

        if (!res_data.hasCoupon) {
          let subsidy = (res_data.commission * 0.27).toFixed(2);
          res_data.subsidy = subsidy;
          res_data.subsidyprice = res_data.price - subsidy;
        }

        _this.setData({
          goodsInfo: res_data,
          couponUrl: coupon_Url,
          clickUrl: click_Url,
          jd_click_url: jd_click_url,
          jd_coupon_url: jd_coupon_url,
        });
      }
    });
  },


  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent(e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
  },


  /**
   * 返回顶部
   */
  goTop(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },



  /**
   * 复制到剪切板
   */
  copyGoodsId(e) {
    let _this = this;
    // 商品id
    let data = _this.data.goods_id;
    wx.setClipboardData({
      data: data,
    })
  },



  /**
   * 查看详情
   */
  toGoodsDetail(e) {
    let _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      App.doLogin();
    } else {
      App.globalData.userInfo = userInfo;
      wx.navigateToMiniProgram({
        appId: "wx13e41a437b8a1d2e", //京东爆品小程序的appID
        path: _this.data.jd_click_url,
      })
    }
  },

  /**
   * 立即购买
   */
  toBuyGoods() {
    let _this = this;

    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      App.doLogin();
    } else {
      App.globalData.userInfo = userInfo;
      wx.navigateToMiniProgram({
        appId: "wx13e41a437b8a1d2e", //京东爆品小程序的appID
        path: _this.data.jd_coupon_url,
      })
    }
  },


  /**
   * 分享海报
   */
  sharePoster(e) {
    let _this = this;

    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      App.doLogin();
    } else {
      App.globalData.userInfo = userInfo;
      let type = e.target.dataset.type

      let data = {
        service: 'createMiniGoodsPoster',
        goodsId: _this.data.goods_id,
        jd_url: _this.data.couponUrl,
        type:type,
      }

      App.fetchPost(data, function(res) {
        console.log("poster", res);
        if (res.code == 1) {
          let url = res.data;
          _this.setData({
            posterUrl: url,
          });

          if (url) {
            wx.previewImage({
              current: url, // 当前显示图片的http链接
              urls: [url] // 需要预览的图片http链接列表
            })
          }
        }
      });
    }
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function() {
    let _this = this;

    let pid = "0";
    let nickName="";
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      pid = userInfo.userId;
      nickName = userInfo.nickName;
    }
    let title = _this.data.goodsInfo.title;
    let price = _this.data.goodsInfo.price;
    if(!_this.data.goodsInfo.hasCoupon){
      price = _this.data.goodsInfo.subsidyprice;
    }

    return {
      title: "【京东】仅需"+price+"元，好友" + nickName + "邀请您抢购" + title,
      path: "/pages/goods/index?goods_id=" + _this.data.goods_id + "&&pid=" + pid,
      imageUrl: _this.data.goodsInfo.picUrl,
    };
  },

/**
   * 展示菜单
   */
  showMenu:function(e) {
    let _this = this;
    _this.setData({
      menu_hide:!_this.data.menu_hide,
    });
  },

  /**
   * 跳转到首页
   */
  toHomepage(e) {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },





})