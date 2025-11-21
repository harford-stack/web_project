const express = require('express');
const bcrypt = require('bcrypt'); // 해시화를 위한 필수 설치 패키지
const router = express.Router();
const db = require("../db");

const jwt = require('jsonwebtoken');
const JWT_KEY = "secret_key"; // 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.

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
        let token = null;
        if(list.length > 0){
            // 아이디 존재
            const match = await bcrypt.compare(pwd, list[0].pwd);
            if(match){
                msg = list[0].userId + "님 환영합니다!";
                result = "success";
                let user = {
                    userId : list[0].userId,
                    userName : list[0].userName,
                    status : "A" // 권한 일단 하드코딩(DB에 없어서)
                    // 권한 등 필요한 정보 추가
                };
                token = jwt.sign(user, JWT_KEY, {expiresIn : '1h'});
                console.log(token);
            } else {
                msg = "비밀번호를 확인해라";
            }
        } else {
            // 아이디 없음
            msg = "해당 아이디가 존재하지 않습니다.";
        }

        
        res.json({
            msg : msg, // 양쪽 이름이 같을 때에는 생략 가능
            result : result, // result, 로 작성 가능 // 자바스크립트에서만 사용 가능한 문법
            token : token
        });
    } catch (error) {
        console.log("에러 발생!");
        console.log(error);
    }
})

module.exports = router;