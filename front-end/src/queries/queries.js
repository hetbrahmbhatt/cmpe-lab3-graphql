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
const getGroupDetails = gql`
query getGroupDetails($id: String){
  getGroupDetails(id:$id){
        acceptedGroups{
          groupID,
          groupName,
          invitedBy
        }
        invitedGroups{
          groupID,
          groupName,
          invitedBy
        }
    }
  }
`;
const getGroupSummaryDetails = gql`
query groupSummaryDetails($groupID: String){
  groupSummaryDetails(groupID:$groupID){
      groupName,
      description,
      amount,
      settleFlag,
      createdAt
  }
  }
`;
const getTotalInternalBalance = gql`
query groupSummaryDetails($groupID: String){
  groupSummaryDetails(groupID:$groupID){
      userID1,
      userName,
      userID2,
      amount,
      defaultCurrency 
  }
  }
`;
export { getUserProfile, getGroupDetails, getGroupSummaryDetails, getTotalInternalBalance };