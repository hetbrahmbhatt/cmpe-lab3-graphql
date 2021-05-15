import logo from './logo.svg';
import './App.css';
import Routing from './components/routing';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, withApollo } from 'react-apollo';
const client = new ApolloClient({
  uri: 'http://localhost:3002/graphql'
});
function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>

        <BrowserRouter>
          <div>

            <Routing />

          </div>
          <ToastContainer />

        </BrowserRouter>
      </ApolloProvider >

    </div>
  );
}

export default App;
