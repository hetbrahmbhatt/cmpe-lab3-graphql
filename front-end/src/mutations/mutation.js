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
const addExpenseMutation = gql`
    mutation addExpense(
        $groupID:String,
        $groupName:String,

        $userID:String,
        $currency:String,
        $description:String,
        $amount : String

    ){
        addExpense(  
            groupID :$groupID,
            userID : $userID,
            currency : $currency,
            description : $description,
            amount : $amount,
            groupName : $groupName,
    
                        ){
                            groupID,
                            groupName
                        }
    }
`;
const leaveGroupMutation = gql`
    mutation addExpense(
        $groupID:String,
        $userID:String

    ){
        addExpense(  
            groupID :$groupID,
            userID : $userID,
    
                        ){
                            groupID,
                        }
    }
`;


export { userSignUpMutation, userLogin, addExpenseMutation, leaveGroupMutation,addGroupMutation, updateGroupStatusMutation, updateUserProfileMutation };