import React from 'react';
import ReactDOM from 'react-dom';

import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-client-preset';
import { ApolloProvider } from 'react-apollo';
import 'semantic-ui-css/semantic.min.css';
import gql from 'graphql-tag';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

const App = Routes;

const httpLink = new HttpLink({ uri: 'http://localhost:8888/graphql' });

// const middlewareLink = new ApolloLink((operation, forward) => {
//   // add the authorization to the headers
//   operation.setContext({
//     headers: {
//       'x-token': localStorage.getItem('token') || null,
//       'x-refresh-token': localStorage.getItem('token') || null,
//     },
//   });

//   return forward(operation);
// });

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken'),
  },
}));

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const { response: { headers } } = operation.getContext();
    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');

      if (token) {
        localStorage.setItem('token', token);
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }

    return response;
  }));

const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink));

const client = new ApolloClient({
  link: httpLinkWithMiddleware,
  cache: new InMemoryCache(),
});

// const client = new ApolloClient({
//   link: new HttpLink({ uri: 'http://localhost:8888/graphql' }),
//   cache: new InMemoryCache(),
// });

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('root'),
);

registerServiceWorker();
