import { gql } from 'apollo-boost';

const userLogin = gql`
mutation userLogin($email: String, $password: String){
    userLogin(email:$email, password:$password){
        _id,
        name,
        email
    }
  }
`;

const userSignUpMutation = gql`
    mutation userSignUp($name: String, $email: String, $password: String){
        userSignUp(name: $name, email: $email, password: $password){
            email,
            _id,
            name
        }
    }
`;

const updateUserProfileMutation = gql`
    mutation updateUserProfile(
        $name:String,   
        $email:String,
        $phoneno:String,
        $language:String,
        $timezone:String,
        $defaultcurrency:String,
    ){
        updateUserProfile(  name:$name,   
                            email:$email,
                            phoneno:$phoneno,
                            language:$language,
                            timezone:$timezone,
                            defaultcurrency:$defaultcurrency,
                        ){
            email
        }
    }
`;

const addGroupMutation = gql`
    mutation addGroupMutation(
        $name:String,   
        $email:String,
        $phoneno:String,
        $language:String,
        $timezone:String,
        $defaultcurrency:String,
    ){
        updateUserProfile(  name:$name,   
                            email:$email,
                            phoneno:$phoneno,
                            language:$language,
                            timezone:$timezone,
                            defaultcurrency:$defaultcurrency,
                        ){
            email
        }
    }
`;

export { userSignUpMutation, userLogin, updateUserProfileMutation };