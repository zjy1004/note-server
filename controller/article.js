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

router.get('/article', (req, res) => {
    let {pn = 1, size = 10} = req.query;
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
        .then(data => {
            res.json({
                code: 200,
                data
            })
        })
});
router.get('/article/:id', (req, res) => { // 获取单条文章
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
router.get('/article/:categoryId', (req, res) => { // 获取分类文章
  const { id } = req.params;
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