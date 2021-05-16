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
    mutation addGroup(
        $userID:String,   
        $userName:String,   
        $groupName:String,
        $membersValue : [String],
        $membersLabel : [String]

    ){
        addGroup(  
            userID:$userID,   
            groupName:$groupName,
            membersValue : $membersValue,
            membersLabel : $membersLabel,
            userName: $userName,   

        )
    }
`;
const updateGroupStatusMutation = gql`
    mutation updateGroupStatus(
        $userID:String,
        $groupID:String,
        $type:String,
        $userName:String,
        $groupName : String

    ){
        updateGroupStatus(  
            userID :$userID,
            groupID : $groupID,
            type : $type,
            userName : $userName,
            groupName : $groupName
                        ){
                            groupID,
                            groupName
                        }
    }
`;
export { userSignUpMutation, userLogin, addGroupMutation, updateGroupStatusMutation, updateUserProfileMutation };