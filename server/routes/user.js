const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../db");

router.post('/join', async (req, res) => {
    let {userId, pwd, userName} = req.body
    console.log(req.body);
    try {
        const hashPwd = await bcrypt.hash(pwd, 10);
        console.log(hashPwd);
        let sql = "INSERT INTO TBL_USER"
                  + "(USERID, PWD, USERNAME, CDATETIME, UDATETIME) "
                  + "VALUES(?, ?, ?, NOW(), NOW())";
        let result = await db.query(sql, [userId, hashPwd, userName]);
        
        res.json({
            mgs : "success",
            result : result
        });
    } catch (error) {
        console.log("에러 발생!");
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    let {userId, pwd} = req.body
    console.log(req.body);
    try {
        
        let sql = "SELECT * FROM TBL_USER WHERE USERID = ?";
        let [list] = await db.query(sql, [userId]);
        let msg = "";
        let result = "fail";
        if(list.length > 0){
            // 아이디 존재
            const match = await bcrypt.compare(pwd, list[0].pwd);
            if(match){
                msg = list[0].userId + "님 환영합니다!";
                result = "success";
            } else {
                msg = "비밀번호를 확인해라";
            }
        } else {
            // 아이디 없음
            msg = "해당 아이디가 존재하지 않습니다.";
        }

        
        res.json({
            msg : msg,
            result : result
        });
    } catch (error) {
        console.log("에러 발생!");
        console.log(error);
    }
})

module.exports = router;