import React from 'react';

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.text = React.createRef();
    this.state = {
      height: window.innerWidth >= 990 ? window.innerHeight-96 : 150
    }
  }
  getMsg = () => {
    return this.text.current.value;
  }
  resize = () => {
    this.setState({
      height: window.innerWidth >= 990 ? window.innerHeight-96 : 150
    })
  }
  render() {
    return (
      <>
        <textarea ref={this.text} className='w-100 p-3'
         style={{'height': `${this.state.height}px`}}
          placeholder='Enter message here'
          onInput={this.props.updateValidity}/>
        <br/>
      </>
    );
  }
}
