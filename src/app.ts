import { ApolloServer } from "apollo-server";
import { connectDB } from "./mongo";
import { typeDefs } from "./schema";
import { Query , User, Recipe, Ingredient } from "./resolvers/Query";
import { Mutation } from "./resolvers/Mutation";

const resolvers = {
  Query,
  Mutation,
  User,
  Recipe,
  Ingredient
};

const run = async () => {
  const clientDB = await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      const loggeado = ["SignOut", "LogOut"];
      const notlogged = ["SignIn", "LogIn"];
      const ing = ["AddIngredient", "DeleteIngredient"];
      const rec = ["AddRecipe", "UpdateRecipe", "DeleteRecipe"];
      const get = ["getRecipe", "getRecipes", "getUser", "getUsers"];

      const psw = req.headers["psw"];
      const email = req.headers["email"];
      const token = req.headers["token"];

      /*
      if(email == null || psw == null){
        throw new Error("No hay email o password.");
      }
      */
      
      if (notlogged.some((elem) => req.body.query.includes(elem))) {
        return {
          clientDB,
          psw,
          email,
        };
      }

      if (loggeado.some((elem) => req.body.query.includes(elem))) {
        return {
          clientDB,
          psw,
          email,
          token,
        };
      }

      if (ing.some((elem) => req.body.query.includes(elem))) {
        return {
          clientDB,
          psw,
          email,
          token,
        };
      }

      if (rec.some((elem) => req.body.query.includes(elem))) {
        return {
          clientDB,
          psw,
          email,
          token,
        };
      }

      if (get.some((elem) => req.body.query.includes(elem))) {
        return {
          clientDB
        };
      }
    },
  });

  server.listen(3000).then((url) => {
    console.log("Server escuchando en el puerto 3000");
  });
};

try {
  run();
} catch (error) {
  console.log(error);
}