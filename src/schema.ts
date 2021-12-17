import {gql} from "apollo-server"

export const typeDefs = gql`
type Ingredient{
  id: ID!
  name: String!
  recipes: [Recipe!]!
}

type Recipe{
  id: ID!
  name: String!
  description: String!
  ingredients: [Ingredient!]!
  author: User!
}

type User{
  id: ID!
  email: String!
  pwd: String!
  token: String
  recipes: [Recipe!]!
}

type Query{
  getRecipes(id: String!): String,
  getRecipe: [Recipe!]!,
  getUser(id:String!): User!,
  getUsers: [User!]!
}

type Mutation{
  SignIn: String!,
  SignOut: String!,
  LogIn: String!,
  LogOut: String!,
  AddIngredient(name: String!): String!,
  DeleteIngredient(name: String!): String!,
  AddRecipe(name: String!, description: String!, ingredients: [String!]!): String!,
  UpdateRecipe(name: String!, newname: String!, newdescription: String!): String!,
  DeleteRecipe(name: String!): String!
}
`
