import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-client';
import { HttpLink, InMemoryCache } from 'apollo-client-preset';
import { ApolloProvider } from 'react-apollo';
import 'semantic-ui-css/semantic.min.css';
import gql from 'graphql-tag';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

const App = Routes;

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8888/graphql' }),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('root'),
);

registerServiceWorker();
