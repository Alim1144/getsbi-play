import { MongoClient, Db } from 'mongodb'

const uri: string | undefined = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient> | null = null

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) {
    return null
  }

  if (clientPromise) {
    return clientPromise
  }

  if (process.env.NODE_ENV === 'development') {
    // В режиме разработки используем глобальную переменную
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // В продакшене создаем новый клиент
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

export default getClientPromise()

export async function getDatabase(): Promise<Db | null> {
  const promise = getClientPromise()
  if (!promise) {
    return null
  }
  const client = await promise
  return client.db('getsbi-play')
}
