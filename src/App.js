import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Recipients from './components/Recipients';
import TextBox from './components/TextBox';
import Saved from './components/Saved';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.recipients = React.createRef();
    this.text = React.createRef();
    this.saved = React.createRef();
    this.state = {
      api: 'https://phaqvwjbw6.execute-api.us-west-1.amazonaws.com/dev/api/v1'
    }
    window.onresize = this.resize
  }
  sendMsg = () => {
    if (!this.readyToSend()) return
    let selected = this.recipients.current.gridApi.getSelectedNodes()
    let emails = []
    for (let node of selected) {
      let email = `email_${node.data.email.toLowerCase()}`
      if (emails.indexOf(email) === -1) emails.push(email)
    }
    const formData = new FormData()
    formData.append('tags', emails.join(','))
    formData.append('message', this.text.current.getMsg())
    fetch(`${this.state.api}/send_notification`, {
      method: 'POST',
      body: formData
    })
  }
  readyToSend = () => {
    return (
      this.recipients.current.gridApi.getSelectedNodes().length &&
      this.text.current.getMsg()
    )
  }
  select = (nodes) => {
    let alreadySelected = true
    nodes.forEach(node => {
      if (!node.selected) alreadySelected = false
      node.setSelected(true)
    });
    if (alreadySelected) nodes.forEach(node => {
      node.setSelected(false)
    })
  }
  saveGroup = () => {
    let selected = this.recipients.current.gridApi.getSelectedNodes()
    if (!selected.length) return
    let name = prompt('Enter group name:')
    if (!name.length) return
    let newGroup = {name: name, nodes: selected}
    this.saved.current.setState({
      groups: [...this.saved.current.state.groups, newGroup]
    });
  }
  render() {
    return (
      <Container fluid className='h-100 pt-3 pl-3 pr-3 pb-0'>
        <Row className='d-flex'>
          <Col lg={8} className='mb-3'>
            <Recipients ref={this.recipients} api={this.state.api}/>
          </Col>
          <Col lg={4}>
            <TextBox ref={this.text} send={this.sendMsg} ready={this.readyToSend}/>
            <Saved ref={this.saved} select={this.select} save={this.saveGroup} send={this.sendMsg}/>
          </Col>
        </Row>
      </Container>
    );
  }
  resize = () => {
    this.text.current.resize()
    this.recipients.current.resize()
  }
}

export default App;
