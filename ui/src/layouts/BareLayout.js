import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainFooter from "../components/layout/MainFooter";

const BareLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <Row>
      <Col
        className="main-content p-0"
        lg={{ size: 4, offset: 4 }}
        md={{ size: 6, offset: 3 }}
        sm="12"
        tag="main"
        style={{paddingTop: "5rem"}}
      >
        {children}
        {!noFooter && <MainFooter />}
      </Col>
    </Row>
  </Container>
);

BareLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

BareLayout.defaultProps = {
  noNavbar: false,
  noFooter: false
};

export default BareLayout;
