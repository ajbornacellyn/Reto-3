import { Response } from "@adonisjs/core/build/standalone";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input("correo");
    const password = request.input("contrasena");

    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "60 min",
      });
      return {
        token,
        msg: "Usuario logueado correctamente",
      };
    } catch (error) {
      return response.unauthorized("Credenciales invalidas");
    }
  }
  public async register({ request, auth, response }: HttpContextContract) {
    const name = request.input("usuario");
    const email = request.input("correo");
    const password = request.input("contrasena");
    const profile = request.input("perfil");
    const identificacionTipo = request.input("identificacionTipo");
    const identificacionNo = request.input("identificacionNo");
    const direccion = request.input("direccion");
    const barrio = request.input("barrio");
    const municipio = request.input("municipio");
    const departamento = request.input("departamento");

    // Se crea el nuevo usuario
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.perfil_usuario = profile;
    user.identificacionTipo = identificacionTipo;
    user.identificacionNo = identificacionNo;
    user.direccion = direccion;
    user.barrio = barrio;
    user.municipio = municipio;
    user.departamento = departamento;

    // Se verfica la no existencia del documento en la base de datos

    try {
      const usuarioExistente = await this.verificarUsuarioExistente(identificacionNo);
      if(usuarioExistente === 0){
        await user.save()
        const token = await auth.use("api").login(user, {
          expiresIn: "10 days",
        });

        return {
          token,
          msg: "usuario registrado correctamente",
        };
      }else{
        response.status(400).json({"mesg" : "Usuario existente"});
      }
    } catch (error) {
      console.log(error);
      response.status(500).json({"msg": "Error en el servidor"});
    }
  }

  public async getUsers({ auth }: HttpContextContract) {
    // solo se permite a los usuarios con perfil 3, es decir administradores
    if (await this.hasPermisse(auth)) {
      const users = await User.all();
      return users;
    } else {
      return { msg: "No tiene permisos para ver los usuarios" };
    }
  }
  public async updatetUser({ auth, request, response }: HttpContextContract) {
    const perfil = auth.use("api").user?.perfil_usuario;
    if (perfil === 3) {
      return { msg: "No tiene permisos para ver los usuarios" };
    } else {
      const id = request.param("id");
      const userOld = await User.findOrFail(id);
      const userNew = request.all();
      if (userOld) {
        userOld.name = userNew.name;
        userOld.email = userNew.email;
        userOld.password = userNew.password;
        userOld.perfil_usuario = userNew.perfil;
        userOld.identificacionTipo = userNew.identificacionTipo;
        userOld.identificacionNo = userNew.identificacionNo;
        userOld.direccion = userNew.direccion;
        userOld.barrio = userNew.barrio;
        userOld.municipio = userNew.municipio;
        userOld.departamento = userNew.departamento;
        await userOld.save();
        response.status(200).json({ msg: "Usuario actualizado correctamente" });
      } else {
        response.status(401).json({ msg: "Usuario no encontrado" });
      }
    }
  }

  public async deleteUser({ request, auth }: HttpContextContract) {
    if (await this.hasPermisse(auth)) {
      const id = request.param("id");
      await User.query().where("id", id).delete();
      return { msg: "Usuario eliminado correctamente" };
    }
  }
  public async searchUserById({ request, auth }: HttpContextContract) {
    if (await this.hasPermisse(auth)) {
      const id = request.param("id");
      const user = await User.find(id);
      return user;
    } else {
      return { msg: "No tiene permisos para ver los usuarios" };
    }
  }
  public async searchUserByName({ request, auth }: HttpContextContract) {
    if (await this.hasPermisse(auth)) {
      const name = request.param("name");
      const user = await User.query()
        .where("name", "LIKE", `%${name}%`)
        .first();
      return user;
    } else {
      return { msg: "No tiene permisos para ver los usuarios" };
    }
  }

  public async verificarUsuarioExistente(documento: number): Promise <number>{
    const usuarios = User.query().where({'identificacionNo': documento})
    return (await usuarios).length;
  }

  public async hasPermisse(auth: any) {
    const perfil = auth.use("api").user?.perfil_usuario;
    console.log("perfiiiiiiiiiiil");
    console.log(perfil);
    if (perfil != 3) {
      return false;
    } else {
      return true;
    }
  }
}
