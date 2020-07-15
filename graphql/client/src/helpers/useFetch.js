import {useState,useEffect,useCallback} from 'react';
import axios from 'axios';

export const useFetch = ()=>{
	const [error,setErrors] = useState(null);
	const [isLoading,setIsLoading] = useState(null);

	const request = useCallback(
		async (
			url,
			method='get',
			data=null,
			headers=null,
			params=null)=>{
       try{
       setIsLoading(true); 
       const resData = await axios({
          	method,
          	url,
          	data,
          	headers,
          	params
          })
        setIsLoading(false);
        return resData;
      }catch (err) {
        //graphql
        console.log(err.response)
        if(err.response && err.response.data && err.response.data.errors){
          setError(err.response.data.errors[0].message);
        }  
        else{
          setError('Unknowen error');
        }

        //api
        // if(err.response){
        //   setError(err.response.data.message);
        // }else{
        //   setError(err.message);
        // }
        // setIsLoading(false);
        setIsLoading(false);
        throw err;
      }
      setIsLoading(false);
	},[]);
  const setError=(err)=>{
    setErrors(err);
  }
	const clearError =()=>{
		setError(null);
	}

  return {request,error,isLoading,clearError,setError};

}