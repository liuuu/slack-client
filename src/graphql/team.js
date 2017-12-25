import gql from 'graphql-tag';

export const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      owner
      channels {
        id
        name
      }
    }
    inviteTeams {
      id
      owner
      name
      channels {
        id
        name
      }
    }
  }
`;
