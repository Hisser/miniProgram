var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    commissifoninfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var $that = this;
      wx.getStorage({
          key: 'sendType',
          success: function (res) {
            
              $that.setData({ "type": res.data });
              $that.getCreditLog();

          }
      })
     
      
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
  getCreditLog: function (e) {
      var $that = this;
  
    
      app.util.request({
          url: 'entry/wxapp/Log',
          data: {
              "m": 'nets_haojk',
              'type': $that.data.type,
              'page':1
          },
          method: 'post',
          success: function (response) {
            
              for(var i=0;i<response.data.data.length;i++){

                response.data.data[i].created_at = form_time(response.data.data[i].created_at);
              }

              $that.setData({ "commissifoninfo": response.data.data});


              //int转时间戳
              function form_time(a) {
                  var myDate = new Date(parseInt(a) * 1000);
                  var datestr = "";
                  datestr = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
                  datestr = datestr + "-" + (myDate.getMonth() + 1);       //获取当前月份(0-11,0代表1月)
                  datestr = datestr + "-" + myDate.getDate();        //获取当前日(1-31)
                  datestr = datestr + " " + myDate.getHours();
                  datestr = datestr + ":" + myDate.getSeconds();
                  return datestr;
              }
          }
      })
  },
})