import { Response } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Book from 'App/Models/Book'

export default class BooksController {
  public async store({request, auth}: HttpContextContract){
    if(await this.hasPermisse(auth)){
      const book = new Book();
      book.titulo = request.input('titulo');
      book.autor = request.input('autor');
      book.editorial = request.input('editorial');
      book.paginas = request.input('paginas');
      book.formato = request.input('formato');
      book.idUsuario = request.input('idUsuario');
      await book.save();
      return {
        "msg": "Libro creado correctamente",
        "estado": 200,
        book
      }
    }else{
      return {
        "msg": "No tiene permisos para crear un libro",
        "estado": 401
      }
    }

  }
  public async index(){
    const books = await Book.query();
    return books
  }

  public async show({params}: HttpContextContract){
    try {
      const book = await Book.find(params.id)
      if(book){
        return book
      }else{
        return("Registro no existe")
      }
    } catch (error) {
      console.log(error)
    }
  }
  public async updateBook({ request, params, auth}:HttpContextContract){
    const book = await Book.find(params.id);

    if(await this.hasPermisse(auth)){
      if(book){
        book.titulo = request.input('titulo');
        book.autor = request.input('autor');
        book.editorial = request.input('editorial');
        book.paginas = request.input('paginas');
        book.formato = request.input('formato');
        book.idUsuario = request.input('idUsuario');
        if(await book.save()){
          return {
            "msg": "Actualizado correctamente",
            book
          }

        }
        return({
          "msg": "No se pudo actualizar",
          "estado": 401
        })
      }
      return(
        {
          "msg": "Registro no encontrado",
          "Estado": 401
        });
      }else{
        return({
          "msg": "No tiene permisos para actualizar",
          "Estado": 401
        });
      }
  }

  public async deleteBook({request, response, auth}: HttpContextContract){
    if (await this.hasPermisse(auth)) {
      const id = request.param("id");
      await Book.query().where("id", id).delete();
      response.status(200).json({ msg: "Libro eliminado correctamente" });
    }else{
      return {
        "msg": "No tiene permisos para eliminar un libro",
        "estado": 401
      }
    }
  }

  public async searchBookById({ request }: HttpContextContract) {
    const id = request.param("id");
    return await Book.query().where("id", id);
  }

  public async searchBookByName({ request, response }: HttpContextContract) {
    const titulo = request.param("titulo");
    try {
      const books = await Book.query().where("titulo", "like", `%${titulo}%`);
      return response.status(200).json(books)
    }
    catch (error) {
      response.status(401).json({msg:"error en el servidor"})
    }
  }

  public async searchBookByAuthor({ request, response }: HttpContextContract) {
    const autor = request.param("author");
    try {
      const books = await Book.query().where({"autor":autor})
      response.status(200).json(books)

    } catch (error) {
      response.status(401).json({msg:"error en el servidor"})
    }

  }

  public async searchBookByEditorial({ request, response}: HttpContextContract) {
    const editorial = request.param("editorial");
    try {
      const books = await Book.query().where("editorial", "like", `%${editorial}%`);
      response.status(200).json(books)

    } catch (error) {
      response.status(401).json({msg:"error en el servidor"})
    }
  }

  public async searchBookByPaginas({ request }: HttpContextContract) {
    const paginas = request.param("pages");
    return await  Book.query().where({"paginas":paginas})
  }

  public async searchBookByFormato({ request, response }: HttpContextContract) {
    const formato = request.param("formato");
    try{
      const books = Book.query().where("formato", "like", `%${formato}%`);
      response.status(200).json(books)
    }catch(error){
      response.status(401).json({msg:"error en el servidor"})
    }
  }

  public async hasPermisse(auth: any) {
    const perfil = auth.use("api").user?.perfil_usuario;
    if (perfil == 1) {
      return false;
    } else {
      return true;
    }
  }
}
