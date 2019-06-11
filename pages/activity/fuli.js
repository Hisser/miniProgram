// pages/activity/fuli.js
let App = getApp(),
  wxParse = require("../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityContent: [
      "京东新人一元购活动来了！",
      "京东新用户就可以【一元拼团】购京东好物！",
      "没有注册过京东的小伙伴们有福气了",
      "超多爆款商品只要1元还包邮！",
    "https://wqs.jd.com/event/promote/xinlao/index.shtml",
      "快把活动分享给周围的亲朋好友，享受更多优惠吧",
    ],
    activityImgUrl: '',
    codeLink:'',
    show:false,
    codeImg:'',
    postImg:'',
    show2:false
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // console.log(options);
    // _this.data.activity_id = options.activity_id;
    // // 获取活动信息
    // _this.getActivityDetail();
    //转链
    this.changeJDURL();
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
      console.log(res);
      if (res.code == 1) {
        var url = res.adContent[1];
        _this.setData({
          activityContent: res.adContent,
          activityImgUrl: res.adContent[1].split('"')[1],
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
//转链
  changeJDURL :function(){
    var _this = this;
    let data={
      service:'genJdGoodsPromUrl',
      from:'mini',
      url: _this.data.activityContent[4]
    }
    App.fetchPost(data, function (res) {
      if(res.code ==1){
        let list=[];
        console.log('l',res);
        for (var i = 0; i < _this.data.activityContent.length;i++){
          if(i==4){
            list.push(res.data.actUrl);
          }else{
           list.push(_this.data.activityContent[i]);
          }
        }
        console.log(list);
        _this.setData({
          activityContent:list,
          codeLink: res.data.actUrl
        })
      }else{
        wx.showToast({
          title: '请先登录',
        })
      }
    });

  },
  //微信推广
  wechatTg: function () {
    let _this = this;
    let content = _this.data.activityContent;
    wx.showModal({
      title: '提示',
      content: "复制活动文案",
      success(res) {
        if (res.confirm) {
          if (content) {
            let data = content.join('\n');
            wx.setClipboardData({
              data: data,
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   },
  shareImageFaceToFace: function () {
    let _this = this;
    //生成推广二维码
    wx.showLoading({
      title: '合成中',
    })

    let data={
      service:'createShareCodeImg',
      codeLink: _this.data.codeLink
    }
    App.fetchPost(data, function (res) {
      console.log(res);
      if(res.code==1){
      _this.setData({
        codeImg:res.path,
        show:true
      });
      wx.hideLoading();
      
      }
    });

    // let url = _this.data.activityImgUrl;
    // if (url) {
    //   wx.previewImage({
    //     current: url, // 当前显示图片的http链接
    //     urls: [url] // 需要预览的图片http链接列表
    //   })
    // }

  },
  shareImageToGroup :function(){
    var _this = this;
    wx.showLoading({
      title: '合成中',
    })
    let data={
      service:'createGroupPoster',
      url: _this.data.codeLink
    }
    App.fetchPost(data, function (res) {
      console.log(res);
      if (res.code == 1) {
        wx.hideLoading();
        _this.setData({
          postImg:res.path,
          show2: true
        })
      }
    });
  },
  closeCodeImg :function (){
    var _this = this;
    _this.setData({
      show:false
    }) 
  },
  closeCodeImg2: function () {
    var _this = this;
    _this.setData({
      show2: false
    })
  },
  saveOnPhone:function(){
    var _this =this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }else{
          wx.downloadFile({
            url: _this.data.postImg,
            success: function (res) {
              console.log(res);
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (data) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                  _this.setData({
                    show2: false
                  })
                }
              })
            }
          })
        }
      }
    })
  }
})