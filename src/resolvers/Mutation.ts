import { Db } from "mongodb";
import { v4 as uuid } from "uuid";

export const Mutation = {
  SignIn: async (
    parent: any,
    args: any,
    { clientDB, email, passw }: { clientDB: Db; email: string; passw: string }
  ) => {
    const validator = await clientDB
      .collection("Users")
      .findOne({ email: email });
    if (validator) {
      return "Error the user already exists.";
    }

    await clientDB.collection("Users").insertOne({
      id: uuid(),
      email: email,
      passw: passw,
      token: undefined,
      recipes: [],
    });

    console.log("Signed.\n");
    return "Registered user.";
  },

  SignOut: async (
    parent: any,
    args: any,
    {
      clientDB,
      email,
      passw,
      token,
    }: { clientDB: Db; email: string; passw: string; token: string }
  ) => {
    const validator = await clientDB
      .collection("Users")
      .findOne({ email: email, passw: passw, token: token });
    if (!validator) {
      return "Error deleting.";
    }
    const arrRecipes = validator.recipes;
    arrRecipes.forEach(async (elem: string) => {
      const busca = await clientDB.collection("Recipes").findOne({ id: elem });
      if (!busca) {
        return "Error signOut.";
      }
      const arrIngredients = busca.ingredients;
      arrIngredients.forEach(async (element: string) => {
        const elimR = await clientDB.collection("Ingredients").updateOne(
          { name: element },
          {
            $pull: {
              recipes: elem,
            },
          }
        );
        if (!elimR) {
          return "Error deleting ingredient recipe.";
        }
      });
      const elimReceta = await clientDB.collection("Recipes").deleteOne({
        id: elem,
      });
      if (!elimReceta) {
        return "Error deleting recipes.";
      }
    });

    await clientDB.collection("Users").deleteOne({
      email: email,
      passw: passw,
      token: token,
    });

    console.log("Sign Out.\n");
    return "User deleted.";
  },

  LogIn: async (
    parent: any,
    args: any,
    { clientDB, email, passw }: { clientDB: Db; email: string; passw: string }
  ) => {
    const busca = await clientDB
      .collection("Users")
      .findOne({ email: email, token: undefined });
    if (!busca) {
      return "Error login.";
    }

    const token = uuid();
    await clientDB
      .collection("Users")
      .updateOne({ email: email }, { $set: { token: token } });

    console.log("Loged.\n");
    return "Logged user.";
  },

  LogOut: async (
    parent: any,
    args: any,
    {
      clientDB,
      email,
      passw,
      token,
    }: { clientDB: Db; email: string; passw: string; token: string }
  ) => {
    const busca = await clientDB
      .collection("Users")
      .findOne({ email: email, token: token });
    if (!busca) {
      return "Error logOut";
    }

    await clientDB
      .collection("Users")
      .updateOne({ email: email }, { $set: { token: null } });

    console.log("LogOut.\n");
    return "LogOut user.";
  },

  AddIngredient: async (
    parent: any,
    args: { name: string },
    {
      clientDB,
      email,
      passw,
      token,
    }: { clientDB: Db; email: string; passw: string; token: string }
  ) => {
    const exist = await clientDB.collection("Users").findOne({
      email: email,
      passw: passw,
      token: token,
    });
    if (!exist) {
      return "User doesnt exist.";
    }

    const busca = await clientDB
      .collection("Ingredients")
      .findOne({ name: args.name });
    if (busca) {
      return "Error adding ingredient.";
    }

    const id = uuid();
    await clientDB.collection("Ingredients").insertOne({
      id: id,
      name: args.name,
      recipes: [],
    });

    console.log("AddIngredient.\n");
    return "Ingredient added.";
  },

  DeleteIngredient: async (
    parent: any,
    args: { name: string },
    {
      clientDB,
      email,
      passw,
      token,
    }: { clientDB: Db; email: string; passw: string; token: string }
  ) => {
    const exist = await clientDB.collection("Users").findOne({
      email: email,
      passw: passw,
      token: token,
    });
    if (!exist) {
      return "User doesnt exist.";
    }

    const IngreValidator = await clientDB.collection("Ingredients").findOne({
      name: args.name,
    });
    if (!IngreValidator) {
      return "Error ingredient doesnt exit.";
    }

    const arrRecet = IngreValidator.recipes;
    arrRecet.forEach(async (elem: string) => {
      const buscamosReceta = await clientDB.collection("Recipes").findOne({
        id: elem,
      });
      if (!buscamosReceta) {
        return "Error cant find the recipe .";
      }

      const elimRec = await clientDB.collection("Recipes").deleteOne({
        id: elem,
      });
      if (!elimRec) {
        return "Error deletingreceipe.";
      }

      const elimUser = await clientDB.collection("Users").updateOne(
        { id: buscamosReceta.author },
        {
          $pull: {
            recipes: buscamosReceta.id,
          },
        }
      );
      if (!elimUser) {
        return "Error deleting user.";
      }
    });

    const eliminaIngre = await clientDB.collection("Ingredients").deleteOne({
      name: args.name,
    });
    if (!eliminaIngre) {
      return "Cant delete ingredient.";
    }

    console.log("DeleteIngredient.\n");
    return "Ingredient deleted.";
  },

  AddRecipe: async (
    parent: any,
    args: { name: string; description: string; ingredients: string[] },
    {
      clientDB,
      email,
      passw,
      token,
    }: { clientDB: Db; email: string; passw: string; token: string }
  ) => {
    const exist = await clientDB.collection("Users").findOne({
      email: email,
      passw: passw,
      token: token,
    });
    if (!exist) {
      return "User doesnt exist.";
    }

    const busca = await clientDB
      .collection("Recipes")
      .findOne({ name: args.name });
    if (busca) {
      return "Error addingreceipe, recipe already include.";
    }

    const arrIngre: string[] = args.ingredients;
    arrIngre.forEach(async (elem: string) => {
      const IngreEncontrado = await clientDB
        .collection("Ingredients")
        .findOne({ name: elem });
      if (!IngreEncontrado) {
        return "Missing ingredient in the database.";
      }
    });

    const id = uuid();
    const recDB = await clientDB.collection("Recipes").insertOne({
      id: id,
      name: args.name,
      description: args.description,
      ingredients: args.ingredients,
      author: exist.id,
    });
    if (!recDB) {
      return "Error eaddingreceipe.";
    }

    const recUser = await clientDB.collection("Users").updateOne(
      { email: email, passw: passw, token: token },
      {
        $push: {
          recipes: id,
        },
      }
    );
    if (!recUser) {
      return "Error update recipe int the user.";
    }

    arrIngre.forEach(async (elem: string) => {
      const recIngre = await clientDB.collection("Ingredients").updateOne(
        { name: elem },
        {
          $push: {
            recipes: id,
          },
        }
      );
      if (!recIngre) {
        return "Error update recipe in the ingredients.";
      }
    });

    console.log("AddRecipe.\n");
    return "Recipe added.";
  },

  UpdateRecipe: async (
    parent: any,
    args: {
      name: string;
      newname: string;
      newdescription: string /*, newingredients: string[]*/;
    },
    {
      clientDB,
      email,
      passw,
      token,
    }: { clientDB: Db; email: string; passw: string; token: string }
  ) => {
    const exist = await clientDB.collection("Users").findOne({
      email: email,
      passw: passw,
      token: token,
    });
    if (!exist) {
      return "User doesnt exist.";
    }

    const busca = await clientDB
      .collection("Recipes")
      .findOne({ name: args.newname });
    if (busca) {
      return "Error adding recipe, recipe already include.";
    }

    const actu = await clientDB.collection("Recipes").updateOne(
      { name: args.name },
      {
        $set: {
          name: args.newname,
          description: args.newdescription,
        },
      }
    );
    if (!actu) {
      return "Error updating recipe.";
    }

    console.log("UpdateRecipe.\n");
    return "Recipe updated.";
  },

  DeleteRecipe: async (
    parent: any,
    args: { name: string },
    {
      clientDB,
      email,
      passw,
      token,
    }: { clientDB: Db; email: string; passw: string; token: string }
  ) => {
    //BUSCA USUARIO
    const exist = await clientDB.collection("Users").findOne({
      email: email,
      passw: passw,
      token: token,
    });
    if (!exist) {
      return "User doesnt exist.";
    }

    const validator = await clientDB.collection("Recipes").findOne({
      name: args.name,
      author: exist.id,
    });
    if (!validator) {
      return "Error doesnt exit recipe / user doesnt have this recipe.";
    }

    const arrIngre = validator.ingredients;
    arrIngre.forEach(async (elem: string) => {
      const busca = await clientDB.collection("Ingredients").updateOne(
        { name: elem },
        {
          $pull: {
            recipes: validator.id,
          },
        }
      );
      if (!busca) {
        return "Error updating ingredient.";
      }
    });

    const elimUser = await clientDB.collection("Users").updateOne(
      {
        email: exist.email,
        passw: exist.passw,
        token: exist.token,
        id: exist.id,
      },
      {
        $pull: {
          recipes: validator.id,
        },
      }
    );
    if (!elimUser) {
      return "Error deleting user.";
    }

    const elimRec = await clientDB.collection("Recipes").deleteOne({
      id: validator.id,
      name: args.name,
      author: exist.id,
    });
    if (!elimRec) {
      return "Error deleting recipe.";
    }

    console.log("DeleteRecipe.\n");
    return "Recipe deleted.";
  },
};
