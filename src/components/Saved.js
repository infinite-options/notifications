import React from 'react';
import { Container, Button, Modal, ListGroup } from 'react-bootstrap'

export default class Saved extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      showGroups: false
    }
  }

  openGroups = () => {
    this.setState({showGroups: true})
  }

  closeGroups = () => {
    this.setState({showGroups: false})
  }

  render() {
    return (
      <Container className='d-flex justify-content-around p-3'>
        <Button variant='secondary' onClick={this.openGroups}>
          Saved groups
        </Button>
        <Button variant='secondary' onClick={this.props.send}
          disabled={!this.props.msgValid || !this.props.selectionValid}>
          Send Message
        </Button>
        <Button variant='secondary' onClick={this.props.sendAll}
          disabled={!this.props.msgValid}>
          Send To All
        </Button>

        <Modal show={this.state.showGroups} onHide={this.closeGroups} centered>
          <Modal.Header closeButton>
            <Modal.Title>Saved Groups</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.groups.length ? <ListGroup>
              {this.state.groups.map(group =>
                <ListGroup.Item onClick={() => this.props.select(group.nodes)}
                  action key={group.name}>
                  {group.name}
                </ListGroup.Item>
              )}
            </ListGroup> : 'No saved groups'}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.props.save} disabled={!this.props.selectionValid}>
              Save new group
            </Button>
            <Button variant='secondary' onClick={this.closeGroups}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
