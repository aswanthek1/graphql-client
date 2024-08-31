import './App.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import DisplayData from './DisplayData/DisplayData';

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache,
    uri: "http://localhost:4000/graphql"
  })
  return (
    <ApolloProvider client={client} >
      <div className="App">
        <DisplayData/>
      </div>
    </ApolloProvider>
  );
}

export default App;
