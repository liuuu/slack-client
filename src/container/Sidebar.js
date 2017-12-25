import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// import _ from 'lodash';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
  };

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  };

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  };

  render() {
    const { data: { loading, allTeams }, currentTeamId } = this.props;
    if (loading) {
      return null;
    }
    console.log('allTeams', allTeams);

    console.log('currentTeamId', currentTeamId);

    const teamIdx = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;

    const team = allTeams[teamIdx];
    console.log('team--------', team);
    console.log('team.channels', team.channels);

    let username = '';
    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
      console.log('user', user);
    } catch (err) {}

    return [
      <Teams
        key="team-sidebar"
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
      />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        channels={team.channels}
        onClick={this.handleAddChannelClick}
        users={[{ id: 1, name: 'nihaoa' }, { id: 2, name: 'hahah' }]}
      />,
      <AddChannelModal
        teamId={team.id}
        onClose={this.handleCloseAddChannelModal}
        open={this.state.openAddChannelModal}
        key="sidebar-add-channel-modal"
      />,
    ];
  }
}

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(Sidebar);
