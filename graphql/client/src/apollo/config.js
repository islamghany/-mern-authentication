import {InMemoryCache} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';
import {counterMutation} from './mutations/counterMutation';
const cache = new InMemoryCache();

const client = new ApolloClient({
	uri:'http://localhost:8000/graphql',
	cache,
	resolvers: {
     Mutation: {
      ...counterMutation
     }
   }
});
const initialSatate = {
	counter:22,
	auth:{
      _id:null,
      token:null,
      name:null,
      email:null
	}
}

cache.writeData({data:initialSatate});

export default client;