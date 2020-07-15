import {gql} from 'apollo-boost';

export const GET_COUNTER = gql`
  query GetCounterValue {
    counter @client
  }
`;

export const SIGN_IN = gql`
  query Signin($email:String!,$password:String!){
  	userData: signin(userInput:{email:$email,password:$password}){
    token
    name
    email
    _id
  }
  }   
`
const USET=gql`
    
`
export const GET_AUTH=gql`
  query{
  	userData{
  		name
  		_id
  		token
  		email
  	}
  }
`
