import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment, Button } from 'semantic-ui-react';

import Messages from '../components/Messages';

/*
  type Subscription {
    newChannelMessage(channelId:Int!) :Message!
  }
*/

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

class MessageContainer extends React.Component {
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId, data: { messages } }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }

    if (
      this.sl &&
      this.sl.scrollTop < 100 &&
      this.props.data.messages &&
      messages &&
      this.props.data.messages.length !== messages.length
    ) {
      // preserve height before re-render
      const heightBeforeRender = this.sl.scrollHeight;

      // this.heightBeforeRender = this.sl.scrollHeight;
      setTimeout(() => {
        // set the position of bar after re-render
        this.sl.scrollTop = this.sl.scrollHeight - heightBeforeRender;
      }, 200);
    }
  }

  // componentDidUpdate({ channelId }) {
  //   if (
  //     this.sl &&
  //     this.sl.scrollHeight !== this.heightBeforeRender &&
  //     this.heightBeforeRender &&
  //     this.props.channelId === channelId
  //   ) {
  //     this.sl.scrollTop = this.sl.scrollHeight - this.heightBeforeRender;
  //   }
  // }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = channelId =>
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('prev', prev);
        console.log('subscriptionData', subscriptionData.data.newChannelMessage);

        if (!subscriptionData) {
          return prev;
        }

        return {
          ...prev,
          messages: [subscriptionData.data.newChannelMessage, ...prev.messages],
        };
      },
    });

  handleScroll = () => {
    const tillTop = this.sl.scrollTop;

    if (tillTop === 0) {
      //
      const offset = this.props.data.messages.length;
      console.log('offset', offset);

      this.props.data.fetchMore({
        variables: {
          channelId: this.props.channelId,
          offset: this.props.data.messages.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages],
          };
        },
      });
    }
  };

  render() {
    const { data: { loading, messages } } = this.props;
    return loading ? null : (
      <div
        onScroll={this.handleScroll}
        ref={(sl) => {
          this.sl = sl;
        }}
        style={{
          gridColumn: 3,
          gridRow: 2,
          paddingLeft: ' 20px',
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column-reverse',
          overflowY: 'auto',
        }}
      >
        <Comment.Group>
          {/* <Button
              onClick={() => {
                const offset = this.props.data.messages.length;
                console.log('offset', offset);

                this.props.data.fetchMore({
                  variables: {
                    channelId: this.props.channelId,
                    offset: this.props.data.messages.length,
                  },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                      return previousResult;
                    }
                    return {
                      ...previousResult,
                      messages: [...previousResult.messages, ...fetchMoreResult.messages],
                    };
                  },
                });
              }}
            >
              Load More
            </Button> */}
          {[...messages].reverse().map(m => (
            <Comment key={`${m.id}-message`}>
              <Comment.Content>
                <Comment.Author as="a">{m.user.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{m.created_at}</div>
                </Comment.Metadata>
                <Comment.Text>{m.text}</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </div>
    );
  }
}

const messagesQuery = gql`
  query($channelId: Int!, $offset: Int!) {
    messages(channelId: $channelId, offset: $offset) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

export default graphql(messagesQuery, {
  options: props => ({
    variables: {
      channelId: props.channelId,
      offset: 0,
    },
    fetchPolicy: 'network-only',
  }),
})(MessageContainer);
