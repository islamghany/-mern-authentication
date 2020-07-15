import {GET_COUNTER,GET_AUTH} from '../queries/counterQueries';
import {gql} from 'apollo-boost';
import { authenticate,signout } from "../../helpers/auth.js";


export const UPDATE_COUNTER = gql`
mutation updateCounter($offset: Number!) {
  updateCounter(offset: $offset) @client
}`;
export const HANDLE_AUTH = gql`
mutation handleAuth($_id:String,$token:String,$name:String,$email:String){
  handleAuth(_id:$_id,name:$name,email:$email,token:$token) @client
}   
`
export const counterMutation = {
  updateCounter: (_, variables, { cache }) => {
    //query existing data
    const data = cache.readQuery({ query: GET_COUNTER });
    //Calculate new counter value
    const newCounterValue = data.counter + variables.offset;
    cache.writeData({
      data: { counter: newCounterValue }
    });
    return null; //best practice
  },
  handleAuth:(_,variables,{cache})=>{
    const data = cache.readQuery({ query: GET_AUTH });
    console.log(variables)
    if(data.auth && data.auth._id){
      signout(()=>{
         cache.writeData({
      data: { ...data,auth:null}
    });
      })
    }
    else{
      authenticate(variables,()=>{
       cache.writeData({
        data: { ...data,auth:{...variables}}
      }); 
    })  
    }
    return null 
    
  }
};