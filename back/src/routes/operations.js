const express = require('express');
const Operations = require('../models/operations');

const router = express.Router();

router.post('/',async(req,res)=>{
    let {initialValue, monthlyValue, fees, temp} = req.body;

    try {
        let calculation = await Operations.create({initialValue, monthlyValue, fees, temp});
        res.status(200).json(calculation);
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = router;