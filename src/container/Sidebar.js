import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// import _ from 'lodash';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import { meQuery } from '../graphql/team';
import InvitePeopleModal from '../components/InvitePeopleModal';

import DirectMessageModal from '../components/DirectMessageModal';
import directMessage from '../routes/directMessage';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false,
    openDirectMessgaeModal: false,
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

  handleDirectMessageClick = () => {
    console.log('sdfasdfasdfadf');

    this.setState({ openDirectMessgaeModal: true });
  };

  handleCloseDirectMessageModal = () => {
    this.setState({ openDirectMessgaeModal: false });
  };

  render() {
    console.log('re-render');
    const {
      teams, team, username, directMessageMembers,
    } = this.props;

    const { openInvitePeopleModal, openAddChannelModal, openDirectMessgaeModal } = this.state;
    console.log('team.admin', team.admin);

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        onClick={this.handleAddChannelClick}
        users={directMessageMembers}
        onInvitePeopleClick={this.handleInvitePeopleClick}
        isOwner={team.admin}
        onDirectMessageClick={this.handleDirectMessageClick}
      />,
      <AddChannelModal
        teamId={team.id}
        onClose={this.handleCloseAddChannelModal}
        open={openAddChannelModal}
        key="sidebar-add-channel-modal"
      />,
      <DirectMessageModal
        teamId={team.id}
        onClose={this.handleCloseDirectMessageModal}
        open={openDirectMessgaeModal}
        key="sidebar-direct-message-modal"
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

export default graphql(meQuery)(Sidebar);
