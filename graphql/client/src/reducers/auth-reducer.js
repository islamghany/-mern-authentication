export default (state={loading:true},action)=>{
      switch(action.type){
      	case 'SIGNING_IN':
      	  return action.payload;
      	case 'SIGNING_OUT':
      	  return {};
      	default: return state;    
      }
}