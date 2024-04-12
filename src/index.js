// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';
import './index.css'

function FuncComp(props) {
    return <div>asdf</div>
}

class ClassComp extends React.Component {
    render() {
        return <div>asdf{this.props.aaa}</div>
    }
}

const root = document.getElementById('root') 
const elem = <div className='red' kk="vv" key="asd" onClick={() => {console.log(111)}} style={{color: 'blue'}}>sss<div>asdf<span>sdgdfg</span><div>kkkkk</div></div>bbb</div> 
ReactDOM.render(<ClassComp aaa="aaa" />, root);
