import { gql } from 'apollo-boost';
const getUserProfile = gql`
query getUserProfile($email: String){
    getUserProfile(email:$email){
        _id,
        name,
     email,
     phoneno,
     defaultcurrency,
     timezone,
     language,
    }
  }
`;

export { getUserProfile };