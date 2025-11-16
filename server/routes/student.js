const express = require('express');
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res) => {
    try {
        let sql = "SELECT * FROM STUDENT";
        let [list] = await db.query(sql); // db.query()는 비동기적 동작, 그래서 이 작업이 끝날때까지 대기시켜야함
        // console.log(list); // 리스트를 콘솔로 찍으면 터미널에서 너무 많이 나오니 막아두기
        res.json({
            result : "success",
            list : list
        });
    } catch (error) {
        console.log("에러 발생");
    }
})

router.get('/:stuNo', async (req, res) => {
    // 구조 분해 할당(Destructuring Assignment) 문법
    // 객체에서 필요한 속성만 꺼내서 변수로 바로 선언하는 문법
    // let stuNo = req.params.stuNo;
    // 이걸 짧게 줄인 문법이 바로:
    // let { stuNo } = req.params;
    // 즉, { stuNo } = req.params는
    // “req.params 객체 안에 있는 stuNo 속성을 같은 이름의 변수로 꺼내라”는 뜻
    // 여러개 한번에 꺼내기 가능
    let { stuNo } = req.params;
    console.log(stuNo);
    try {
        let sql = "SELECT * FROM STUDENT WHERE STU_NO = " + stuNo;
        let [list] = await db.query(sql);
        // console.log(list);
        res.json({
            result : "success",
            info : list[0] // 학번을 지정해서 넘겼으니 1개 아니면 없음, 그래서 리스트 0번째 값 가져오기
        });
    } catch (error) {
        console.log("에러 발생");
    }
})

router.delete('/:stuNo', async (req, res) => {
    let { stuNo } = req.params;
    console.log(stuNo);
    try {
        let sql = "DELETE FROM STUDENT WHERE STU_NO = " + stuNo;
        let result = await db.query(sql);
        console.log("result ==> ", result);
        res.json({
            result : result,
            msg : "success"
        });
    } catch (error) {
        console.log("에러 발생");
    }
})

router.post('/', async (req, res) => {
    let { stuNo, stuName, stuDept } = req.body;
    console.log(req.body);
    try {
        let sql = "INSERT INTO STUDENT (STU_NO, STU_NAME, STU_DEPT) VALUES (?, ?, ?)";
        let result = await db.query(sql, [stuNo, stuName, stuDept]);
        res.json({
            result : result,
            msg : "success"
        });
    } catch (error) {
        console.log("에러 발생");
    }
})

router.post('/login', async (req, res) => {
    let {stuNo, stuName} = req.body
    console.log(req.body);
    try {
        let sql = "SELECT * FROM STUDENT WHERE STU_NO = ?";
        let [list] = await db.query(sql, [stuNo]);
        let msg = "";
        let result = "fail";
        if(list.length > 0){
            // 학번으로 조회 성공
            if(list[0].stu_name == stuName){
                msg = list[0].stu_name + "님 환영합니다!";
                result = "success";
            } else {
                msg = "해당 이름을 가진 학생이 없습니다.";
            }
        } else {
            // 학번 조회 실패
            msg = "학번을 확인해주세요.";
        }
        console.log(list);
        res.json({
            msg : msg,
            result : result
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})


router.put('/:stuNo', async (req, res) => {
    let { stuNo } = req.params;
    let {stu_name, stu_dept, stu_gender, stu_height} = req.body;
    console.log(req.body);
    try {
        let sql = "UPDATE STUDENT SET "
                + "STU_NAME = ?, "
                + "STU_DEPT = ?, "
                + "STU_GENDER = ?, "
                + "STU_HEIGHT = ? "
                + "WHERE STU_NO = ? ";
        let result = await db.query(sql, [stu_name, stu_dept, stu_gender, stu_height, stuNo]);
        // console.log("result ==> ", result);
        res.json({
            result : result,
            msg : "success"
            
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

module.exports = router;