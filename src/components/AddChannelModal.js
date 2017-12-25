import React from 'react';
import { Form, Input, Button, Modal } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { allTeamsQuery } from '../graphql/team';

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fluid
            placeholder="Channel name"
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Button disabled={isSubmitting} fluid onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting }) => {
      await mutate({
        variables: { teamId, name: values.name },
        update: (store, { data: { createChannel } }) => {
          // this mutation back from `data`
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: allTeamsQuery });
          // Add our comment from the mutation to the end.

          const teamIdx = _.findIndex(data.allTeams, ['id', teamId]);

          data.allTeams[teamIdx].channels.push(channel);
          // Write our data back to the cache.
          store.writeQuery({ query: allTeamsQuery, data });
        },
      });

      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
