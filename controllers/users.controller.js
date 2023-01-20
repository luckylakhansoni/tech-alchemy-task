/* eslint-disable no-undef */
const Bcrypt = require("bcryptjs");
const NewsAPI = require("newsapi");
const helper = require("../utils/helper");

const User = require("../DOM/users.dom");
const axios = require("axios");

const { STATUS, SERVER_MESSAGE} = require("../utils/constant")

// eslint-disable-next-line no-undef
const newsApi = new NewsAPI(process.env.NEWS_API_KEY);

// register User
exports.register = async (req, res) => {
  try {
    const { body } = req;
    const query = {};
    query.where = {
      email: body.email,
    };
    const emailChecking = await User.singleRecord(query);
    if (emailChecking && emailChecking.email) {
      res.status(STATUS.BAD_REQUEST).json({ message: SERVER_MESSAGE.EMAIL_EXISTS });
      return;
    }
    // convert password  using bcrypt method 
    body.password = await helper.createPassword(body.password);

    // save data to Database
    let user = await User.createRecord(body);

    user = user.toJSON();
    delete user.password;

    res.status(STATUS.CREATED).json(user);
  } catch (error) {
    res.status(STATUS.SERVER_SIDE_ERROR).json(`Error: ${error}`);
  }
};

// sign in
exports.signing = async (req, res) => {
  try {
    const { body } = req;
    if (!body.email && !body.password) {
      res.status(STATUS.BAD_REQUEST).json({ message: "Invalid email or password" });
      return;
    }
    let user;
    // checking email registered ot not
    const query = {
      where: {},
    };
    query.where.email = body.email;
    user = await User.singleRecord(query);
    if (!user) {
      res.status(STATUS.BAD_REQUEST).json({ message: SERVER_MESSAGE.EMAIL_ID_NOT_MATCH });
      return;
    }
    if (user.isActive === false || user.isActive === 0) {
      res
        .status(STATUS.BAD_REQUEST)
        .json({ message: SERVER_MESSAGE.USER_NOT_ACTIVE });
      return;
    }

    // checking password correct or not
    const verified = Bcrypt.compareSync(body.password, user.password);
    if (verified) {
      let userData = user.toJSON();
      delete userData.password;
      // create JWT Token 
      const jwt = await helper.jwtToken(userData.id);
      res.setHeader("x-access-token", `Bearer ${jwt}`);
      res.send(userData);
      return;
    } else {
      res.status(STATUS.BAD_REQUEST).json({ message: SERVER_MESSAGE.WRONG_PASSWORD });
    }
  } catch (error) {
    res.status(STATUS.SERVER_SIDE_ERROR).json(`Error: ${error}`);
  }
};

// get news
exports.news = async (req, res) => {
  try {
    let result;
    if (req.query.search) {
      const search = {
        q: req.query.search,
      };
      result = await newsApi.v2.topHeadlines(search);
    } else {
      result = await newsApi.v2.topHeadlines();
    }
    const array = [];
    // eslint-disable-next-line no-plusplus

    //prepare response according to the task
    for (let i = 0; i < result.articles.length; i++) {
      array.push({
        headline: result.articles[i].title,
        link: result.articles[i].url,
      });
    }
    const resultObject = {
      count: result.totalResults,
      data: array,
    };
    res.send(resultObject);
  } catch (error) {
    res.status(STATUS.SERVER_SIDE_ERROR).json({
      message: error.message,
    });
  }
};
// get news
exports.weather = async (req, res) => {
  try {
    let result = [];
    let lat, long;
    lat = req.body.lat ? req.body.lat : 22.7196;
    long = req.body.long ? req.body.long : 75.8577;
    let url = `${process.env.WEATHER_API_URL}data/2.5/forecast?lat=${lat}&lon=${long}&appid=${process.env.WEATHER_API_KEY}`
    const analytics = await axios.post(url);
    if (analytics.data) {
      //prepare response according to the task
      for (let i = 0; i < analytics.data.list.length; i++) {
        let resultObject = {
          date: analytics.data.list[i].dt_txt,
          main: analytics.data.list[i].weather[0].main,
          temp: analytics.data.list[i].main["temp"],
        };
        result.push(resultObject);
      }
    }
    let resultData = {
      count: analytics.data.cnt,
      unit: "Matrix",
      location: analytics.data.city["name"],
      data: result,
    };
    res.json(resultData);
  } catch (error) {
    res.status(STATUS.SERVER_SIDE_ERROR).json({
      message: error.message,
    });
  }
};
// ==========================Thank you==============================
