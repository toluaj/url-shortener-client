import React, {useState, useEffect} from 'react';
import './index.css';
import { render } from 'react-dom';
import { ApolloClient, InMemoryCache, gql, useLazyQuery } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//define where the graphql server is
const client = new ApolloClient({
  uri: 'https://bitty-uri.herokuapp.com/graphiql',
  cache: new InMemoryCache()
});

//graphql query
const GET_SHORTENED_URL = gql`
  query Shorten($url: String!) {
    shortenUrl(url: $url) {
      short
      shortenedUrl
      fullUrl
    }
  }
`;

toast.configure();

function GetUrl() {

 const [url, setUrl] = useState("");
  
 //make sure the query doesn't run on page load
 const [ getData, {data, loading, error} ] = useLazyQuery(GET_SHORTENED_URL, {
   variables: { url },
   fetchPolicy: 'network-only'
 });
 
 function goBack() {
   window.location.reload();
 }

 if (loading) return <img src="https://res.cloudinary.com/dthdj5bkt/image/upload/v1618933618/Infinity-1.4s-191px.svg" />
 
 if(error) { 
  
  toast.error("Invalid Url", setTimeout(() => {
    goBack();
  }, 4000))

  }
  
  return (

    <div id="container">
      <h1 className="head">URL SHRINKER - BACKDROP.PHOTO</h1>
      <div className="demo-flex-spacer"></div>
      { data ? 
        <div>
          <h1>Full Url: {data.shortenUrl.fullUrl} </h1>
          <hr></hr>
          <h1>Shortened Url: <a href={data.shortenUrl.shortenedUrl} target="_blank">{data.shortenUrl.shortenedUrl}</a></h1>
          <br></br>
          <button onClick={() => goBack()}><i className="fa fa-chevron-left fa-4x" style={{cursor: 'pointer'}} aria-hidden="true"></i></button>
        </div> 
      : 
            
        <div className="webflow-style-input">
          <input 
            type="text"
            placeholder="URL"
            disabled={error}
            onChange={(e) => {
            setUrl(e.target.value);
            }}
          />
          <button onClick={() => getData()}>SHRINK</button>
        </div>     
      }

    </div>
    
  )
}

render(
  <ApolloProvider client={client}>
    <GetUrl />
  </ApolloProvider>,
  document.getElementById('root')
  
);
