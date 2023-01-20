/* eslint-disable no-useless-catch */
const db = require("../models");

module.exports.createRecord = async (query)=>{
    try {
        let data = await db.user.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await db.user.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

