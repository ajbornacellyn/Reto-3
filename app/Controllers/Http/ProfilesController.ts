import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'

export default class ProfilesController {
  public async createProfile({request, auth}: HttpContextContract){
    if(await this.hasPermisse(auth)){
      const profile = new Profile();
      profile.id = request.input('id');
      profile.descripcion = request.input('descripcion');

      await profile.save();
      return {
        "msg": "Perfil creado correctamente",
        "estado": 200,
        profile
      }
  }else{
    return {
      "msg": "No tiene permisos para crear un perfil",
      "estado": 401
    }
  }
  }

  public async getProfiles(){
    const profiles = await Profile.query();
    return profiles
  }

  public async deleteProfile({request, auth}: HttpContextContract){
    if(await this.hasPermisse(auth)){
      const id = request.param("id");
      const profile = await Profile.find(id);
      if(profile){
        await profile.delete();
        return {
          "msg": "Perfil eliminado correctamente",
          "estado": 200
        }
      }else{
        return {
          "msg": "No se pudo eliminar el perfil",
          "estado": 401
        }
      }
    }else{
      return {
        "msg": "No tiene permisos para eliminar un perfil",
        "estado": 401
      }
    }
  }

  public async updateProfile({request, auth}: HttpContextContract){
    if(await this.hasPermisse(auth)){
      const id = request.param("id");
      const profile = await Profile.find(id);
      if(profile){
        profile.descripcion = request.input('descripcion');
        await profile.save();
        return {
          "msg": "Perfil actualizado correctamente",
          "estado": 200,
          profile
        }
      }else{
        return {
          "msg": "No se pudo actualizar el perfil",
          "estado": 401
        }
      }
    }else{
      return {
        "msg": "No tiene permisos para actualizar un perfil",
        "estado": 401
      }
    }
  }

  public async getProfile({request}: HttpContextContract){
    const id = request.param("id");
    const profile = await Profile.find(id);
    if(profile){
      return profile
    }else{
      return {
        "msg": "No se pudo encontrar el perfil",
        "estado": 401
      }
    }
  }

  public async hasPermisse(auth: any) {
    const perfil = auth.use("api").user?.perfil_usuario;
    if (perfil != 3) {
      return false;
    } else {
      return true;
    }
  }
}
