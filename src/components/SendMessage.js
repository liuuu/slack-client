import React from 'react';
import styled from 'styled-components';
import { Input, Button, Icon } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import FileUpload from './FileUpload';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  padding: 20px;
  display: grid;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  placeholder,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <SendMessageWrapper>
    <Input
      onKeyDown={(e) => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      name="message"
      value={values.message}
      fluid
      placeholder={`Message #${placeholder}`}
    />
  </SendMessageWrapper>
);

export default withFormik({
  mapPropsToValues: () => ({ message: '' }),
  handleSubmit: async (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }

    await onSubmit(values.message);
    resetForm(false);
  },
})(SendMessage);
