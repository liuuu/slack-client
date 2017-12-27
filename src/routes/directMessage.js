import React from 'react';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/appLayout';
import Sidebar from '../container/Sidebar';
import DirectMessageContainer from '../container/DirectMessageContainer';

import { meQuery } from '../graphql/team';

const WholeView = ({
  mutate,
  data: { loading, me, getUser },
  match: { params: { teamId, userId } },
}) => {
  if (loading) {
    console.log('loading', loading);

    return null;
  }

  const { username, teams } = me;

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];
  console.log('team', team);

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        username={username}
        directMessageMembers={team.directMessageMembers}
      />
      <Header channelName={getUser.username} />
      <DirectMessageContainer teamId={teamId} userId={userId} />
      <SendMessage
        onSubmit={async (text) => {
          const response = await mutate({
            variables: {
              text,
              receiverId: userId,
              teamId,
            },
            optimisticResponse: {
              createDirectMessage: true,
            },
            update: (store) => {
              const data = store.readQuery({ query: meQuery });
              const teamIdx2 = findIndex(data.me.teams, ['id', team.id]);
              // check if the member we added is already  in the directMessage List
              //  if not push if to
              const notAlreadyThere = data.me.teams[teamIdx2].directMessageMembers.every(member => member.id !== parseInt(userId, 10));
              if (notAlreadyThere) {
                data.me.teams[teamIdx2].directMessageMembers.push({
                  __typename: 'User',
                  id: userId,
                  username: getUser.username,
                });
                store.writeQuery({ query: meQuery, data });
              }
            },
          });
          console.log(response);
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

const directMessageMeQuery = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

export default compose(
  graphql(directMessageMeQuery, {
    options: props => ({
      variables: { userId: props.match.params.userId },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(createDirectMessageMutation),
)(WholeView);
