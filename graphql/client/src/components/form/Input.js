import React from 'react';
import { FormInput } from "shards-react";

const Input = ({
	error,
	placeholder,
	register,
	name,
	className,
	type="text"
})=>{
	return <div className='form__unit'>	
           <FormInput 
             placeholder={placeholder} 
             className={className} 
             innerRef={register} 
             invalid={error} 
             name={name}
             type={type} />
           {error && <span className="form__error">{error}</span>} 
		   </div>
}
export default Input