// pages/caculate-credit/index.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabArr: {
            curHdIndex: 0,
            curBdIndex: 0
        },
        withdrawArray: [] ,
        datalock: false,
        page: 1
    },
  

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var $that = this;
        $that.getCommissionlog(1);
        wx.getStorage({
            key: "myUserinformation",
            success:function(res){
                $that.setData({
                    credit2: res.data.credit22
                })
            }
        });
    },
    /*上拉触底时触发*/
    onReachBottom: function () {
    
        var $that = this;
        var page = $this.data.page + 1;
        $that.getCommissionlog(page);
    },
    
    getCommissionlog:function(page,callback){
        var $that = this;
        if ($that.data.datalock) {
            return false;
        }
        $that.setData({
            page: page,
            datalock: true,
        });
        app.util.request({
            url: 'entry/wxapp/myCommissionlog',
            data: {
                "m": 'nets_haojk',
                "page":page

            },
            method: 'post',
            success: function (response) {
                var obj = response.data.data;
                if (typeof callback == 'function') {
                    callback(obj);
                    $that.setData({
                        datalock: false
                    });
                }else{
                
                    for (var i = 0; i < obj.length; i++) {
                        obj[i].created_at = form_time(obj[i].created_at);
                        if (obj[i].status == 0) {
                            obj[i].status="待审核"
                        } else if (obj[i].status == 1){
                            obj[i].status = "已完成"
                        } else if (obj[i].status == 2) {
                            obj[i].status = "已拒绝"
                        }
                    }
                    $that.setData({
                        withdrawArray: response.data.data,
                        datalock: false

                    })
                }





                //int转时间戳
                function form_time(a) {
                    var myDate = new Date(parseInt(a) * 1000);
                    var datestr = "";
                    datestr = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
                    datestr = datestr + "-" + (myDate.getMonth() + 1);       //获取当前月份(0-11,0代表1月)
                    datestr = datestr + "-" + myDate.getDate();        //获取当前日(1-31)
                    datestr = datestr + " " + (myDate.getHours() < 10 ? "0" : "") + myDate.getHours();        //获取当前日(1-31)
                    datestr = datestr + ":" + (myDate.getMinutes() < 10 ? "0" : "") + myDate.getMinutes();        //获取当前日(1-31)
                    datestr = datestr + ":" + (myDate.getSeconds() < 10 ? "0" : "") + myDate.getSeconds(); 

                    return datestr;
                }
                
                
            }
        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady:function () {

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
    //事件处理函数
    tabFun: function (e) {
        //获取触发事件组件的dataset属性  
        var _datasetId = e.target.dataset.id;
     
        var _obj = {};
        _obj.curHdIndex = _datasetId;
        _obj.curBdIndex = _datasetId;
        this.setData({
            tabArr: _obj
        });
    }
})