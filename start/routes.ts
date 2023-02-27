/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/Http/AuthController';

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(()=>{
  Route.post('/register', "AuthController.register");
  Route.post("/login", "AuthController.login");

  Route.group(() =>{
    //rutas de libros
    Route.get("/books", "BooksController.index");
    Route.get("/books/id/:id", "BooksController.searchBookById");
    Route.get("/books/title/:titulo", "BooksController.searchBookByName");
    Route.get("/books/author/:author", "BooksController.searchBookByAuthor");
    Route.get("/books/editorial/:editorial", "BooksController.searchBookByEditorial");
    Route.get("/books/format/:formato", "BooksController.searchBookByFormat");
    Route.put("/books/update/:id", "BooksController.updateBook");
    Route.post("/books", "BooksController.store");
    Route.delete("/books/delete/:id", "BooksController.deleteBook");
    //rutas de usuarios
    Route.get('/users', "AuthController.getUsers");
    Route.get('/users/:id', "AuthController.searchUserById");
    Route.get('/users/:name', "AuthController.searchUserByName");
    Route.put('/users/update/:id', "AuthController.updateUser");
    Route.delete('/users/delete/:id', "AuthController.deleteUser");
    Route.post('/users', "AuthController.register");
    Route.post('/users/login', "AuthController.login");
    //rutas de perfiles
    Route.get('/profiles', "ProfilesController.getProfiles");
    Route.get('/profiles/:id', "ProfilesController.getProfile");
    Route.post('/profiles', "ProfilesController.createProfile");
    Route.delete('/profiles/delete/:id', "ProfilesController.deleteProfile");
    Route.put('/profiles/update/:id', "ProfilesController.updateProfile");
  }).middleware(["auth"]);

}).prefix("api");
