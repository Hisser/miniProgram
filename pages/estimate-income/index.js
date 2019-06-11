// pages/estimate-income/index.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        all:0,

        estimatenum:0,
        countnum:0,
        allcommission:0,
        ordercommission:0,
        estcommission: 0,
        currentTab: 0,
        tabArray: ["今日", "昨日", "近七日", "近30日"],
        begintime:0,
        endtime:0
    },
    swichNav: function (e) {
        var that = this;
        that.setData({
          allcommission: 0
        });
     
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            });
            
            if(e.target.dataset.current==0){
              var dd = new Date(); 
              this.setData({
                begintime: dd.toLocaleDateString(),
                endtime: dd.toLocaleDateString(),
              });
            }
            if (e.target.dataset.current == 1) {
              var dd = new Date(new Date() - 1*24 * 60 * 60 * 1000); 
              this.setData({
                begintime: dd.toLocaleDateString(),
                endtime: dd.toLocaleDateString(),
              });
            }
            if (e.target.dataset.current == 2) {
              var cd = new Date(new Date());
              var dd = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
              this.setData({
                begintime: dd.toLocaleDateString(),
                endtime: cd.toLocaleDateString(),
              });
            }
            if (e.target.dataset.current == 3) {
              var cd = new Date(new Date());
              var dd = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
              this.setData({
                begintime: dd.toLocaleDateString(),
                endtime: cd.toLocaleDateString(),
              });
            }
            this.getEstimateIncome();
            this.getEstIncome();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var myDate = new Date();
      this.setData({
        begintime: myDate.toLocaleDateString(),
        endtime: myDate.toLocaleDateString(), 
      });

        this.getEstimateIncome();
        this.getEstIncome();
    },
    getEstimateIncome:function(){
        var $that = this;
     
        app.util.request({
            url: 'entry/wxapp/Orders',
            data: {
                "m": 'nets_haojk',
                "begintime": new Date($that.data.begintime + " 00:00:00").valueOf() / 1000,
                "endtime": new Date($that.data.endtime + " 23:59:59").valueOf() / 1000,
                "uri":"importorders",
                "currentTab": $that.data.currentTab
            },
            method: 'post',
            success: function (response) {
            
                var orders=response.data.data;
                
                $that.setData({
                  estimatenum: orders.length
                });
                var fee = 0;
                for (var i = 0; i < orders.length; i++) {
              
                  fee = parseFloat(fee) + parseFloat(orders[i].my_commission);
                }
                var allcommission=parseFloat(fee).toFixed(2);
                $that.setData({
                  allcommission: allcommission
                });
            }
        })
    },
    getEstIncome: function () {
      var $that = this;
    
      app.util.request({
        url: 'entry/wxapp/Orders',
        data: {
          "m": 'nets_haojk',
          "begintime": new Date($that.data.begintime + " 00:00:00").valueOf() / 1000,
          "endtime": new Date($that.data.endtime + " 23:59:59").valueOf() / 1000,
          "uri": "orders",
          "currentTab": $that.data.currentTab
        },
        method: 'post',
        success: function (response) {
          var orders = response.data.data;
        
          $that.setData({
            countnum: orders.length
          });
          var fee=0;
          for (var i = 0; i < orders.length; i++) {
            fee = fee + orders[i].my_commission;
          }
          var allcommission = parseFloat($that.data.allcommission) + parseFloat(fee);
          $that.setData({
            allcommission: allcommission
          });
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

    }
})