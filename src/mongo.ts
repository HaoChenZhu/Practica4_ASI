import { Db, MongoClient } from "mongodb";

export const connectDB = async (): Promise<Db> => {
  const user = "user";
  const password = "user";
  const dbName: string = "Graphql";
  const mongouri: string = `mongodb+srv://${user}:${password}@cluster0.gw7id.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  const client = new MongoClient(mongouri);

  try {
    await client.connect();
    console.info("MongoDB connected");
    return client.db(dbName);
  } catch (e) {
    throw e;
  }
};
