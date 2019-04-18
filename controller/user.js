const {Router} = require("express");
const router = Router();
const userModel = require('../model/user');
const session = require('express-session');

router.post('/user', async(req, res) => { // 注册
    try {
      const { username, password, email, avatar} = req.body;
        // const avatarNumber = Math.ceil(Math.random()*9);
        // const avatar = `http://pbl.yaojunrong.com/avatar${avatarNumber}.jpg`;

        if (password&&password.length>=5) {
          const data = await userModel.create({ username, password, email, avatar});
            res.json({
                code: 200,
                msg: '注册成功'
            })
        }else {
            throw '密码长度不符合要求'
        }

    } catch(err) {
        res.json({
            code: 400,
            msg: '缺少必要参数',
            err
        });
    }
});
router.post('/editUser', async (req, res, next) => { // 修改个人信息
  try {
    if (req.session.user) {
      let id = req.session.user._id
      const { username, avatar, desc, sex, email } = req.body
      let data = await userModel.update({ _id: id }, {
        $set: {
          username,
          avatar,
          desc,
          sex,
        }
      }, function (err, doc) { })
      const userData = await userModel.findOne({ email });
      res.json({
        code: 200,
        msg: '修改成功',
        userData: {
          userId: userData._id,
          avatar: userData.avatar,
          email: userData.email,
          desc: userData.desc,
          username: userData.username,
          sex: userData.sex,
        }
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
router.post('/editPwd', async (req, res, next) => { // 修改密码
  try {
    if (req.session.user) {
      let id = req.session.user._id
      const { newPassword, oldPassword } = req.body
      if (oldPassword !== req.session.user.password) {
        res.json({
          code: 401,
          msg: '原密码错误，重新输入'
        })
      } else {
        if (newPassword === req.session.user.password) {
          res.json({
            code: 401,
            msg: '新旧密码相同，请重新输入'
          })
        } else {
          console.log(newPassword)
          let data = await userModel.update({ _id: id }, { $set: { 'password': newPassword } }, function (err, doc) { })
          res.json({
            code: 200,
            msg: '修改成功',
            data
          })
        }
      }
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
router.post('/login', async(req, res) => { // 登陆
    try {
        const {email, password} = req.body;
        const userData = await userModel.findOne({email});
        if (!userData) {
            res.json({
                code: 400,
                msg: '用户不存在'
            })
        } else{
            if(password&&password == userData.password) {
                req.session.user = userData;
                res.json({
                    code: 200,
                    msg: '登陆成功',
                    userData: {
                      userId: userData._id,
                      avatar: userData.avatar,
                      email: userData.email,
                      desc: userData.desc,
                      username: userData.username,
                      sex: userData.sex,
                    }
                })
            } else {
                res.json({
                    code: 400,
                    msg: '密码错误'
                })
            }
        }
    } catch (err) {
            res.json({
                code: 400,
                msg: err
            })
    }
});
router.get('/logout', (req, res) => { // 退出
    if (req.session.user) {
        req.session.user = null;
        res.json({
            code: 200,
            msg: '退出登陆成功'
        })
    } else {
        res.json({
            code: 403,
            msg: '不能在未登录状态下退出登陆'
        })
    }
});

module.exports = router;