const express = require("express");
const Goods = require("../schemas/goods")
const Cart = require("../schemas/cart")
const router = express.Router();

router.get("/", (req, res) => {
    res.send("this is root page");
});

router.get("/goods", async (req, res) => {
const {category} = req.query;

    const goods = await Goods.find({category});2

    res.json({
        goods
    });
});

router.get("/goods/cart", async (req, res) => {
    const carts = await Cart.find();
    const goodsIds = carts.map((cart) => cart.goodsId);

    const goods = await Goods.find({ goodsId: goodsIds });

    res.json({
        cart : carts.map((cart) => ({
            quantity: cart.quantity,
            goods: goods.find((item) => item.goodsId === cart.goodsId),
        })),
    });
});

router.get("/goods/:goodsId", async (req, res) => {
    const { goodsId } = req.params

    const [goods] = await Goods.find({ goodsId: Number(goodsId) });

    res.json({
        goods,
    });
});


router.delete("/goods/:goodsId/cart", async (req, res) => {
    const {goodsId} = req.params;

    const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
    if (existsCarts.length) {
        await Cart.deleteOne({goodsId : Number(goodsId)});
    }

    res.json({success: true});
});

router.put("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    if(quantity < 1) {
        res.status(400).json({error : "quantity value must be more than 0"});
        return;
    }

    const existsCarts = await Cart.find({ goodsId: Number(goodsId) })
    if (!existsCarts.length) {
        await Cart.create({ goodsId: Number(goodsId), quantity });
    }else{
        await Cart.updateOne({ goodsId: Number(goodsId)}, { $set: { quantity }});
    }
    
    res.json({ success: true});
})

router.post("/goods", async (req, res) => {
    const { goodsId, name, thumbnailUrl, category, price } = req.body;

    const goods = await Goods.find({ goodsId });
    if (goods.length) {
        return res
        .status(400)
        .json({ success: false, errorMessage: "이미 있는 데이터 입니다." });
    }

    const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

    res.json({ goods: createdGoods });
});

router.get("/goods/cart", async (rep, res) => {
    const carts = await Carts.find();
    const goodsIds = carts.map((cart) => cart.goodsId);

    const goods = await Goods.find({ goodsId: goodsIds });

    res.json({
        cart: carts.map((cart) => ({
                quantity: cart.quantity,
                goods: goods.find((item) => item.goodsId === cart.goodsId),
        })),
    })
});

module.exports = router;