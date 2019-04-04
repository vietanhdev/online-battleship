import React from "react";
import { Link } from 'react-router-dom'
import { Container, Button } from "shards-react";

const NotFound = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>404 Not Found</h2>
        <h3>Nothing here!</h3>
        <Link to="/">
        <Button pill>&larr; Go Back</Button>
        </Link>
        
      </div>
    </div>
  </Container>
);

export default NotFound;
