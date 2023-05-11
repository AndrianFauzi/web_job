const { User } = require("../models");
const { verifyPassword } = require("../helpers/bcrypt");
const { signPayload } = require("../helpers/jwt");
const fetch = require("node-fetch");
const axios = require("axios");
class Controller {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
      });
      if (!user) return next({ name: "User Not Found!" });
      if (!verifyPassword(password, user.password))
        return { name: "Password is invalid " };
      const token = signPayload({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      res.status(200).json({
        message: "Login success",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        access_token: token,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async listJob(req, res, next) {
    try {
      const { description, location, full_time, page } = req.query;
      let url = `http://dev3.dansmultipro.co.id/api/recruitment/positions.json?`;
      if (description) {
        url += `description=${description}`;
      }
      if (location) {
        url += `&location=${location}`;
      }
      if (full_time) {
        url += `&full_time=${full_time}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      res.send(data);
    } catch (error) {
      console.log(error, "err");
      res.status(500).json(error);
    }
  }

  static async detailsJob(req, res, next) {
    try {
      const { id } = req.params;
      const response = await fetch(
        `http://dev3.dansmultipro.co.id/api/recruitment/positions/${id}`
      );
      if (!response) next({ message: "job not found" });
      const data = await response.json();
      res.send(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = Controller;
