import {useState,useEffect,useCallback} from 'react';
import axios from 'axios';

export const useFetch = ()=>{
	const [error,setError] = useState(null);
	const [loading,setLoading] = useState(null);

	const request = useCallback(
		async (
			url,
			method='get',
			data=null,
			headers=null,
			params=null)=>{

       try{
       setLoading(true); 
       const response = await axios({
          	method,
          	url,
          	data,
          	headers,
          	params
          });
        setLoading(false);
        return response;
      }catch (error) {
        if(error.response){
          setError(error.response.data.message);
        }     
        setLoading(false);
        throw error;
      }
	},[]);

	const clearError =()=>{
		setError(null);
	}

  return {request,error,loading,clearError};

}