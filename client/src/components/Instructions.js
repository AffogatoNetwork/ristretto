import React, { Component } from "react";
import { Container, Col, Row, Form, FormGroup } from "reactstrap";

import { Heading, Field, Input, Button, Card, Text } from "rimble-ui";

class Instructions extends Component {
  render() {
    return (
      <>
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col lg="6">
              <Heading.h2>Instructions</Heading.h2>
              <Card className="mt-4 mx-auto">
                <Text mb={4}>
                  <Heading.h4>Endorser</Heading.h4>
                  <ul>
                    <li>Stake Money</li>
                    <li>Endorse Users</li>
                    <li>Earn interest money from honest borrower</li>
                    <li>Close Debt</li>
                  </ul>
                  <Heading.h4>Borrower</Heading.h4>
                  <ul>
                    <li>Receive Endorsement</li>
                    <li>Request Lending</li>
                    <li>Receive Money</li>
                    <li>Repay Money + 5% Interest in less than 2 months</li>
                    <li>Close Debt</li>
                  </ul>
                  <Heading.h4>Lender</Heading.h4>
                  <ul>
                    <li>Lend Money</li>
                    <li>Regain your Money plus an interest</li>
                    <li>Close Debt</li>
                  </ul>
                  <b>
                    *If in two months the borrower doesn't pay anyone can call
                    Force Close Debt and the endorsers will pay the lending
                  </b>
                </Text>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Instructions;
