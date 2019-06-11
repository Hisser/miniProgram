let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 'new_user',
    list_newUser: [],
    list_tutorial: [],
    list_matter: [],
    posterUrl: '',
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let type = options.type || 'new_user';

    console.log("type", type);
    if (type) {
      _this.setData({
        dataType: type
      });
    }

    // 获取列表
    _this.getContentList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 获取列表
   */
  getContentList: function() {
    let _this = this;
    let data = {
      service: 'queryStrategyList',
    };

    App.fetchPost(data, function(result) {
      if (result.code === 1) {
        let matter = result.matter_List;
        if (matter) {
          for (let i = 0; i < matter.length; i++) {
            if (matter[i].image) {
              if (matter[i].image.indexOf('http://') != 0 && matter[i].image.indexOf('https://') != 0) {
                matter[i].image = App.globalData.serverUrl + matter[i].image;
              }
            }
          }
        }
        _this.setData({
          list_tutorial: result.tutorial_List,
          list_newUser: result.new_user_List,
          list_matter: result.matter_List,
        });
      }
    });
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function(e) {
    let _this = this;
    _this.setData({
      scrollTop: 0,
      dataType: e.target.dataset.type,
    });
  },



  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },


  /**
   * 去升级，联系客服等操作
   */
  bindOperate(e) {
    let _this = this;
    let data = e.target.dataset.value;
    console.log("operate", data);
    if (data) {
      if (data.type == 'tutorial') {
        _this.setData({
          dataType: "tutorial",
          scrollTop: 0,
        });
      } else if (data.type == 'code') {
        let userInfo = wx.getStorageSync("userInfo");
        if (userInfo) {
          if (userInfo.grade != 1) {
            wx.showToast({
              title: '请先升级为超级会员',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    }
  },

  /**
   * 复制导师微信号
   */
  copyWechat(e) {
    let _this = this;
    let data = e.target.dataset.value;

    if (data) {
      let wechat = data.wechat;
      wx.showModal({
        title: '提示',
        content: '您的专属客服微信号：' + wechat + '\n关于省钱赚钱的问题，请复制微信号去微信添加好友咨询吧~\n添加时请备注：众享成员',
        confirmText: '复制微信',
        success(res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: wechat,
            })
          }
        }
      })
    }
  },


  /**
   * 
   */
  bindTotutorial(e) {
    let _this = this;
    let index = e.target.dataset.index;
    console.log(index);
    if (index >= 0) {
      wx.navigateTo({
        url: "./tutorial/index?index=" + index
      });
    }
  },


  /**
   * 去查看教程
   */
  bindWatchVideo(e) {
    let _this = this;
    let item = e.target.dataset.value;
    console.log(item)
    let url = item.video_url;
    if (url) {
      wx.navigateTo({
        url: "./video/index?url=" + url
      });
    }
  },


  /**
   * 复制到剪切板
   */
  copyContent(e) {
    let _this = this;

    let content = e.target.dataset.value.content;
    if (content) {
      let data = content.join('\n');
      wx.setClipboardData({
        data: data,
      })
    }
  },



  /**
   * 海报
   */
  createMiniInvitePoster: function(e) {
    let _this = this;
    let img = e.target.dataset.value;
    let key = img.substr(img.lastIndexOf('/') + 1);

    let data = {
      service: 'createMiniInvitePoster',
      key: key
    };

    App.fetchPost(data, function(result) {
      console.log(result);
      if (result.code === 1) {
        let url = result.data;
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
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function() {
    let _this = this;

    let pid = "0";
    let nickName = "";
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      pid = userInfo.userId;
      nickName = userInfo.nickName;
    }
    return {
      title: nickName + "邀请您享受京东专属优惠，分享还能赚佣金",
      path: "/pages/index/index?pid=" + pid,
      // imageUrl：'',
    };
  },



});