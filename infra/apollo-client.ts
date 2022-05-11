import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: `token ${process.env.NEXT_PUBLIC_GTIHUB_TOKEN}`
  }
})

export default client
