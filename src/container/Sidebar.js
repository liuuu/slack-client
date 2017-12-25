import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// import _ from 'lodash';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import { allTeamsQuery } from '../graphql/team';
import InvitePeopleModal from '../components/InvitePeopleModal';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false,
  };

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  };

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  };

  handleInvitePeopleClick = () => {
    this.setState({ openInvitePeopleModal: true });
  };

  handleCloseInvitePeopleModal = () => {
    this.setState({ openInvitePeopleModal: false });
  };

  render() {
    console.log('re-render');
    const { teams, team } = this.props;
    const { openInvitePeopleModal, openAddChannelModal } = this.state;
    let username = '';

    let isOwner = false;
    try {
      // get the user from token
      const token = localStorage.getItem('token');

      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
      // check if the login user is the owner of this team
      isOwner = user.id === team.owner;
    } catch (err) {}

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        onClick={this.handleAddChannelClick}
        users={[{ id: 1, name: 'nihaoa' }, { id: 2, name: 'hahah' }]}
        onInvitePeopleClick={this.handleInvitePeopleClick}
        isOwner={isOwner}
      />,
      <AddChannelModal
        teamId={team.id}
        onClose={this.handleCloseAddChannelModal}
        open={openAddChannelModal}
        key="sidebar-add-channel-modal"
      />,
      <InvitePeopleModal
        teamId={team.id}
        onClose={this.handleCloseInvitePeopleModal}
        open={openInvitePeopleModal}
        key="invite-people-modal"
      />,
    ];
  }
}

export default graphql(allTeamsQuery)(Sidebar);
