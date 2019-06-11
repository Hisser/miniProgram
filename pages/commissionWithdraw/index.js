let App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    issubmit: 1,

    total: 0,
    inputWithdraw: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;

    _this.getAccountInfo();
  },


  changeInput: function(e) {
    let _this = this;

    _this.setData({
      inputWithdraw: e.detail.value,
      issubmit: 1
    })
  },


  formSubmit: function(e) {
    let _this = this;
    let inputWithdraw = parseFloat(_this.data.inputWithdraw);
    let total = parseFloat(_this.data.total);
    let mincash = 1;

    if (_this.data.inputWithdraw == null || _this.data.inputWithdraw == "" || _this.data.inputWithdraw == 0) {
      wx.showModal({
        title: '提示',
        content: '提现金额不能为空或零',
      })
    } else if (inputWithdraw > total) {
      wx.showModal({
        title: '提示',
        content: '提现金额不能大于总金额',
        success: function(res) {
        }
      })
    } else if (inputWithdraw < mincash) {
      wx.showModal({
        title: '提示',
        content: '提现金额不能小于1元',
        success: function(res) {
        }
      })
    } else {
      if (_this.data.issubmit == 1) {
        wx.showModal({
          title: '提示',
          content: '确认要提现吗？',
          success: function(res) {
            if (res.confirm) {
              _this.setData({
                issubmit: 0
              });

              let data = {
                service: 'applyWithdraw',
                thirdType: 'app',
                amount: inputWithdraw
              };
              App.fetchPost(data, function (result) {

                console.log(result);
                if (result.code === 1) {
                  _this.setData({
                    total: result.hbAvailableBalance,
                    inputWithdraw: "",
                  });
                }
                wx.showModal({
                  title: '提示',
                  content: res.message,
                  showCancel: false,
                  success(res) {
                  }
                });
              });
            }
          }
        })
      }
    }
  },


  //获取会员额度信息
  getAccountInfo: function() {
    let _this = this;

    let data = {
      service: 'accountInfo'
    };
    App.fetchPost(data, function(result) {
      if (result.code === 1) {
        _this.setData({
          total: result.hbAvailableBalance,
        });
      }
    });    
  },


  //全部提现
  fillAllMoney: function() {
    let _this = this;

    _this.setData({
      inputWithdraw: _this.data.total
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


})