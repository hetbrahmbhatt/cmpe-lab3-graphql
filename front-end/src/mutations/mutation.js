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
export { userSignUpMutation, userLogin };