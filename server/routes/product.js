const express = require('express');
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../auth");

router.get("/", async (req, res) => {
    try {
        let sql = "SELECT * FROM TBL_PRODUCT";
        let [list] = await db.query(sql);
        res.json({
            result : "success",
            list : list
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

router.delete("/:productId", authMiddleware, async (req, res) => {
    let { productId } = req.params;
    try {
        let sql = "DELETE FROM TBL_PRODUCT WHERE PRODUCTID = " + productId;
        let result = await db.query(sql);
        res.json({
            result : result,
            msg : "success"
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

router.post("/", async (req, res) => {
    let {productName, price, category} = req.body;
    try {
        let sql = "INSERT INTO TBL_PRODUCT" 
                  + "(PRODUCTNAME, PRICE, CATEGORY, CDATETIME, UDATETIME) " 
                  + "VALUES (?, ?, ?, NOW(), NOW()) ";
        let result = await db.query(sql, [productName, price, category]);
        res.json({
            result : result,
            msg : "success"
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

router.put("/:productId", async (req, res) => {
    let {productId} = req.params;
    let {productName, price, category} = req.body;
    try {
        let sql = "UPDATE TBL_PRODUCT SET "
                + "PRODUCTNAME = ?, "
                + "PRICE = ?, "
                + "CATEGORY = ? "
                + "WHERE PRODUCTID = ?";
        let result = await db.query(sql, [productName, price, category, productId]);
        res.json({
            result : result,
            msg : "success"
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

module.exports = router;