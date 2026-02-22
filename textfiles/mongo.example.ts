import { MongoClient } from 'mongodb'

export async function connectMongoDB(): Promise<void> {

  new MongoClient('mongodb://localhost:dinport').db('quiz')

  console.log("Ansluten till MongoDB-databasen!");

}
