import { Db } from "mongodb";

export const Query = {
  getRecipe: async (
    parent: any,
    args: { id: string },
    { clientDB }: { clientDB: Db }
  ) => {
    const rec = await clientDB.collection("Recipes").findOne({
      id: args.id,
    });
    if (!rec) {
      return "Error no existe receta.";
    }

    return {
      id: rec.id,
      name: rec.name,
      description: rec.description,
      ingredients: rec.ingredients,
      author: rec.author,
    };
  },

  getRecipes: async (
    parent: any,
    args: any,
    { clientDB }: { clientDB: Db }
  ) => {
    const rec = await clientDB.collection("Recipes").find().toArray();
    if (!rec) {
      return "Error no existen recetas.";
    }

    const arrUser = rec.map(async (elem) => {
      return {
        id: elem.id,
        name: elem.name,
        description: elem.description,
        ingredients: elem.ingredients,
        author: elem.author,
      };
    });

    return arrUser;
  },

  getUser: async (
    parent: any,
    args: { id: string },
    { clientDB }: { clientDB: Db }
  ) => {
    const busca = await clientDB.collection("Users").findOne({ id: args.id });
    if (!busca) {
      return "Error no se encuentra al usuario";
    }

    return {
      id: busca.id,
      email: busca.email,
      pass: busca.pass,
      token: busca.token,
      recipes: busca.recipes,
    };
  },

  getUsers: async (parent: any, args: any, { clientDB }: { clientDB: Db }) => {
    const busca = await clientDB.collection("Users").find().toArray();
    if (!busca) {
      return "Error no existen usuarios.";
    }

    const arrUser = busca.map(async (elem) => {
      return {
        id: elem.id,
        pass: elem.pass,
        email: elem.email,
        token: elem.token,
        recipes: elem.recipes,
      };
    });

    return arrUser;
  },
};

export const Recipe = {
  ingredients: async (
    parent: { ingredients: any },
    args: any,
    { clientDB }: { clientDB: Db }
  ) => {
    let arrayObjIngrediente = [];
    if (parent.ingredients.length == 1) {
      arrayObjIngrediente = parent.ingredients.map(
        async (ingrediente: string) => {
          const ObjIngrediente = await clientDB
            .collection("Ingredients")
            .findOne({ name: ingrediente });
          return {
            id: ObjIngrediente.id,
            name: ObjIngrediente.name,
            recipes: ObjIngrediente.recipes,
          };
        }
      );
    } else {
      arrayObjIngrediente = parent.ingredients.map(
        async (ingrediente: string) => {
          const ObjIngrediente = await clientDB
            .collection("Ingredients")
            .findOne({ name: ingrediente });
          return {
            id: ObjIngrediente.id,
            name: ObjIngrediente.name,
            recipes: ObjIngrediente.recipes,
          };
        }
      );
    }

    return arrayObjIngrediente;
  },

  author: async (
    parent: { author: string },
    args: any,
    { clientDB }: { clientDB: Db }
  ) => {
    const user = await clientDB
      .collection("Users")
      .findOne({ id: parent.author });
    return {
      id: user.id,
      email: user.email,
      pass: user.pass,
      token: user.token,
      recipes: user.recipes,
    };
  },
};

export const User = {
  recipes: async (
    parent: { recipes: string[] },
    args: any,
    { clientDB }: { clientDB: Db }
  ) => {
    const arrayRecetas: any = parent.recipes.map(async (receta: string) => {
      const ObjReceta = await clientDB
        .collection("Recipes")
        .findOne({ id: receta });
      return {
        id: ObjReceta.id,
        name: ObjReceta.name,
        description: ObjReceta.description,
        ingredients: ObjReceta.ingredients,
        author: ObjReceta.author,
      };
    });
    return arrayRecetas;
  },
};

export const Ingredient = {
  recipes: async (
    parent: { recipes: string[] },
    args: any,
    { clientDB }: { clientDB: Db }
  ) => {
    const arrayRecetas: any = parent.recipes.map(async (receta: string) => {
      const ObjReceta = await clientDB
        .collection("recetas")
        .findOne({ id: receta });
      return {
        id: ObjReceta.id,
        name: ObjReceta.name,
        description: ObjReceta.description,
        ingredients: ObjReceta.ingredients,
        author: ObjReceta.author,
      };
    });
    return arrayRecetas;
  },
};