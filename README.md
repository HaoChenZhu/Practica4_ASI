# Practica4_ASI 
## SignIn
Permite registrarse con usuario y contraseña.
## SignOut
Permite a un usuario loggeado borrar su cuenta. Borra todas sus recetas.
## LogIn
Permite loggearse con usuario y contraseña.
## LogOut
Permite desloggearse cuando el usuario tiene la sesión iniciada.
## AddIngredient
Añade un ingrediente a la base de datos. Solo usuarios registrados.
## DeleteIngredient
Borra un ingrediente de la base de datos y todas las recetas que contengan ese ingrediente. Solo usuarios registrados. Solo puedes borrar el ingrediente si es tuyo. Se borran todas las recetas, aunque no sean tuyas.
## AddRecipe
Añade una receta a la base de datos. Solo usuarios registrados.
## UpdateRecipe
Actualiza una receta existente en la base de datos. Solo usuarios registrados. Solo puedes actualizar la receta si es tuya.
## DeleteRecipe
Borra una receta de la base de datos. Solo usuarios registrados. Solo puedes borrar la receta si es tuya.
## getRecipes
Devuelve todas las recetas.
## getUser
Devuelve un usuario pedido por id
## getUsers
Devuelve todos los usuarios
## Ejecucion
npm run dev
