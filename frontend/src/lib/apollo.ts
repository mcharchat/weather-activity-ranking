import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

const cache = new InMemoryCache()
const link = new HttpLink({ uri: "http://localhost:4000/graphql" })

export const client = new ApolloClient({
  link,
  cache,
})
