import React from "react";
import { Container, Row } from "shards-react";

import PageTitle from "../components/common/PageTitle";

const Messages = ({ smallStats }) => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Messages" subtitle="Messages" className="text-sm-left mb-3" />
    </Row>
  </Container>
);

export default Messages;
