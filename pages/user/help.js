let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexs: 0,
    tutorial: null,
    questionVisible: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let index = options.index;
    console.log("sda",index);

    _this.setData({
      indexs: index
    });
    _this.getTutorialContent();
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

  /**
   * 获取列表
   */
  getTutorialContent: function () {
    let _this = this;
    let data = {
      service: 'queryMiniContent',
      index: _this.data.indexs,
      type: 'my',
    };

    App.fetchPost(data, function (result) {
      if (result.code === 1) {
        console.log(result.tutorial_content);
        wx.setNavigationBarTitle({
          title: result.tutorial_content.title
        })

        _this.setData({
          tutorial: result.tutorial_content.content,
        });

        if (Array.isArray(result.tutorial_content.content)) {
          let arrVisible = new Array(result.tutorial_content.content.length);
          for (let i = 0; i < arrVisible.length; i++) {
            arrVisible[i] = false;
          }

          _this.setData({
            questionVisible: arrVisible,
          });
        }
      }
    });
  },


  /**
   * 复制到剪切板
   */
  bindCopyContent(e) {
    let _this = this;

    let content = e.target.dataset.content;
    if (content) {
      wx.setClipboardData({
        data: content,
      })
    }
  },

  expandContent(e) {
    let _this = this;

    let index = e.target.dataset.index;
    if (index >= 0) {
      let arrVisible = _this.data.questionVisible;
      arrVisible[index] = !arrVisible[index];

      for (let i = 0; i < arrVisible.length; i++) {
        if (index != i) {
          arrVisible[i] = false;
        }
      }

      _this.setData({
        questionVisible: arrVisible,
      });
    }
  },


})