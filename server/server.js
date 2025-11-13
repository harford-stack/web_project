// express 패키지 : spring처럼 백엔드 서버 역할
// npm install express
// npm install cors

// 서버 자동 재시작 패키지 : nodemon
// npm install nodemon
// 설치 후 앞으로 서버 실행은 nodemon server.js

const express = require('express')
const cors = require('cors')
const db = require("./db");
const app = express()

app.use(cors({
    origin : ["http://192.168.30.15:5501"], // 현재 사용 컴퓨터 ip // 해당 ip는 허용하겠다는 뜻
    credentials : true
}))
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/test', (req, res) => {
    res.send("test page(get)");
})

app.post('/test', (req, res) => {
    res.send("test page(post)");
})

app.get('/student', async (req, res) => {
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

app.get('/student/:stuNo', async (req, res) => {
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

app.delete('/student/:stuNo', async (req, res) => {
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

app.post('/student', async (req, res) => {
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

app.post('/student/login', async (req, res) => {
    let { stuNo, stuName } = req.body; // POST body로 받음
    try {
        // 먼저 이름이 존재하는지 확인
        let [nameList] = await db.query("SELECT * FROM STUDENT WHERE STU_NAME = ?", [stuName]);

        if (nameList.length === 0) {
            // 이름 자체가 없음
            return res.json({ result: "fail", msg: "no_name" });
        }

        // 이름은 있지만 학번까지 일치하는지 확인
        let [list] = await db.query("SELECT * FROM STUDENT WHERE STU_NO = ? AND STU_NAME = ?", [stuNo, stuName]);

        if (list.length === 0) {
            // 학번 불일치
            return res.json({ result: "fail", msg: "wrong_no" });
        }

        // 둘 다 일치 → 로그인 성공
        res.json({ result: "success", info: list[0] });

    } catch (error) {
        console.log("에러 발생:", error);
        res.status(500).json({ result: "error" });
    }
});

// 3000번 포트를 사용하겠다
app.listen(3000, ()=>{
    console.log("server start!");
})