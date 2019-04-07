const {Router} = require("express");
const router = Router();
const articleModel = require('../model/article');
const categoryModel = require('../model/category');
const session = require('express-session');

router.post('/article', async (req, res, next) => { // 添加文章
    try {
        if (req.session.user) {
            const {content, contentText, title, category} = req.body;
            const data = await articleModel.
            create({
                content,
                contentText,
                title,
                category,
                author: req.session.user._id,
            });
            res.json({
                code: 200,
                msg: '笔记发布成功'
            })
        } else {
            res.json({
                code: 403,
                msg: '未登录状态下，不能发表文章'
            })
        }
    } catch (err) {
        next(err)
    }
});
router.patch('/article/:id', async (req, res, next) => { // 修改文章
    try {
        if (req.session.user) {
            const {id} = req.params;
            const {
                content,
                contentText,
                title,
                category} = req.body;
            const data = await articleModel.findById(id)
            const updateData = await data.update({$set: {
                content,
                contentText,
                title,
                category
            }})
            res.json({
                code: 200,
                msg: '修改成功',
                data: updateData
            })
        } else {
            res.json({
                code: 403,
                msg: '未登录状态下，不能修改'
            })
        }
    } catch (err) {
        next(err)
    }
});

router.post('/articleContent', (req, res) => { // 获取文章
    let reg = /(\d{4})-(\d{2})-(\d{2})/
    let {pn = 1, size = 10, categoryId, updateTime} = req.body;
    let time
    if (req.body.updateTime == "") {
        time = ""
        console.log('000000')
    } else {
        console.log('11111')
        time = reg.exec(req.body.updateTime)[0]
    }
    console.log(categoryId)
    console.log('111',time)
    pn = parseInt(pn);
    size = parseInt(size);

    articleModel.find()
        .skip((pn-1) * size)
        .limit(size)
        .sort({_id: -1})
        .populate({
            path: 'author',
            select: '-password'
        })
        .populate({
            path: 'category'
        })
        .then(data =>{
            if (categoryId == ""){
                if(time == ""){
                    console.log('无时间无分类');
                    res.json({
                        code:200,
                        data
                    })
                }else{
                    console.log('有时间无分类');
                    Date.prototype.Format = function (fmt) {
                        var o = {
                                "M+": this.getMonth() + 1, // 月份
                                "d+": this.getDate(), // 日
                                "h+": this.getHours(), // 小时
                                "m+": this.getMinutes(), // 分
                                "s+": this.getSeconds(), // 秒
                                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                                "S": this.getMilliseconds() // 毫秒
                        };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }
                let newData = []
                data.forEach(item => {
                    if(time == reg.exec(new Date(Number(item.updateTime)).Format('yy-MM-dd hh:mm:ss'))[0]){
                        console.log(reg.exec(new Date(Number(item.updateTime)).Format('yy-MM-dd hh:mm:ss'))[0]);
                        newData.push(item)
                    }
                });
                data = newData
                res.json({
                    code:200,
                    data
                });
                }
            }else{
                if(time == ""){
                    console.log('有分类无时间');
                    let newData = []
                    data.forEach(item => {
                        if(categoryId == item.category._id){
                            newData.push(item)
                        }
                    });
                    data = newData
                    res.json({
                        code:200,
                        data
                    });
                }else{
                    console.log('都有');
                    Date.prototype.Format = function (fmt) {
                        var o = {
                                "M+": this.getMonth() + 1, // 月份
                                "d+": this.getDate(), // 日
                                "h+": this.getHours(), // 小时
                                "m+": this.getMinutes(), // 分
                                "s+": this.getSeconds(), // 秒
                                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                                "S": this.getMilliseconds() // 毫秒
                        };
                        if (/(y+)/.test(fmt))
                            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
                        for (var k in o)
                            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                        return fmt;
                    }
        
                    let newData = []
                    data.forEach(item => {
                        if(categoryId == item.category._id && time == reg.exec(new Date(Number(item.updateTime)).Format('yy-MM-dd hh:mm:ss'))[0]){
                            newData.push(item)
                        }
                    });
                    data = newData
                    res.json({
                        code:200,
                        data
                    });
                }
            }

        })
});
router.get('/articleById/:id', (req, res) => { // 获取单条文章
    const {id} = req.params;
    articleModel.findById(id)
        .populate({
            path: 'author',
            select: '-password'
        })
        .populate({
            path: 'category'
        })
        .then(data => {
        res.json({
            code: 200,
            data
        })
    })

});

router.delete('/article/:id', (req, res) => { // 删除文章
    const {id} = req.params;
    articleModel.findById(id)
        .populate({
            path: 'author',
            select: '-password'
        })
        .populate({
            path: 'category'
        }).remove()
        .then(data => {
        res.json({
            code: 200,
            data,
            msg: '删除成功'
        })
    })

});

module.exports = router;