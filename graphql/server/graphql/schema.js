const { buildSchema } = require("graphql");

module.exports = buildSchema(`
	 type Category{
	 	_id:ID!
     	name:String!
     }
	type Product{
     	_id:ID!
     	name:String!
     	description:String!
     	price:Int!
     	category:Category!
     	quantity:Int!
     	sold:Int
     	photo:String
     	shipping:Boolean
     }
	type User{
		_id:ID!
		name:String!
		password:String
		about:String
		role:Int
		cart:[Product!]!
		favs:[Product!]!
		history:[Product!]!
	}
	type CategoriesData {
        categories: [Category!]!
    }
    type ProductData{
    	products:[Product!]!
    }
     type AuthData {
        token: String!
        _id: String!
        name:String!
        email:String!
    }
    input UserSignInData{
    	email:String!
    	password:String!
    }
    input UserInputData{
        email: String!
        name: String!
        password: String! 
    }
    input ProductInputData{
       name:String!
       description:String!
       price:Int!
       category:String!
       quantity:Int
    }
    input CategoryInputData{
    	name:String!
    }
    type RootQuery {
        getUser:User!
        signin(userInput: UserSignInData):AuthData!
        signup(userInput: UserInputData):Boolean
        accountActivation(token:String!):Boolean
        forgetPassword(email:String!):Boolean
        resetPassword(resetPasswordLink:String!,newPassword:String!):Boolean
        getCategories:CategoriesData!
        getProduct(_id:ID!):Product
        getProducts:[Product!]!
        googleLogin(idToken:String!):AuthData!
        facebookLogin(_id:String!,accessToken:String!):AuthData!
    }
    type RootMutation {
    	addCategory(categoryInput:CategoryInputData):Category!
    	addProduct(productInput: ProductInputData): Product!
        deleteCategory(_id: ID!): Boolean
        deleteProduct(_id:ID!):Boolean
    }
     schema{
     	query:RootQuery
     	mutation:RootMutation
     }
	`);
