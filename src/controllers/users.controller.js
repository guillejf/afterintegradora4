import UsersDTO from "./DTO/users.dto.js";
import { userService } from "../services/users.service.js";
import { logger } from "../utils/main.js";

class UserController {
  async read(req, res) {
    try {
      const users = await userService.read();
      return res.status(200).json({
        status: "success",
        msg: "listado de usuarios",
        payload: users,
      });
    } catch (e) {
      logger.error(e.message);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  }

  async readById(req, res) {
    try {
      const { _id } = req.params;
      const userById = await userService.readById(_id);
      return res.status(201).json({
        status: "success",
        msg: `Mostrando el producto con id ${_id}`,
        payload: { userById },
      });
    } catch (e) {
      logger.error(e.message);
    }
  }

  async readByrender(req, res) {
    try {
      const data = await userService.read();
      const dataParse = data.map(user => {
        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          email: user.email,
          password: user.password,
          role: user.role,
        };
      });
      const firstName = req.session.user.firstName;
      const role = req.session.user.role;
      const title = "Fuego Burgers® - Users";
      return res.status(200).render("users", { dataParse, title, firstName, role });
    } catch (e) {
      logger.error(e.message);
      res.status(501).send({ status: "error", msg: "Error en el servidor", error: e });
    }
  }

  async update(req, res) {
    try {
      const { _id } = req.params;
      const { firstName, lastName, age, email, password } = req.body;
      let user = new UsersDTO({ firstName, lastName, age, email, password });
      try {
        const userUpdated = await userService.update(_id, user);
        if (userUpdated) {
          return res.status(201).json({
            status: "success",
            msg: "user uptaded",
            payload: {},
          });
        } else {
          return res.status(404).json({
            status: "error",
            msg: "user not found",
            payload: {},
          });
        }
      } catch (e) {
        return res.status(500).json({
          status: "error",
          msg: "db server error while updating user",
          payload: {},
        });
      }
    } catch (e) {
      logger.error(e.message);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  }

  async delete(req, res) {
    try {
      const { _id } = req.params;
      const result = await userService.delete(_id);
      if (result?.deletedCount > 0) {
        return res.status(200).json({
          status: "success",
          msg: "user deleted",
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: "error",
          msg: "user not found",
          payload: {},
        });
      }
    } catch (e) {
      logger.error(e.message);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  }

  async loginUser(email, password) {
    try {
      const user = await userService.authenticateUser(email, password);
      return user;
    } catch (e) {
      logger.error(e.message);
      return null;
    }
  }

  async registerUser(req) {
    try {
      const { firstName, lastName, age, email, password } = req.body;
      const role = "user";
      const userCreated = await userService.registerUser(firstName, lastName, age, email, password, role);
      return userCreated;
    } catch (e) {
      logger.error(e.message);
      return null;
    }
  }

  async premiumSwitch(req, res) {
    try {
      const userId = req.params.uid;
      const user = await userService.premiumSwitch(userId);
      req.session.user.premium = user.premium;
      res.status(200).json(user);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  }
}

export const usersController = new UserController();
