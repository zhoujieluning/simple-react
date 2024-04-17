// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';
import './index.css'

function FuncComp(props) {
    return <div>asdf</div>
}

class ClassComp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count1: 0,
            count2: 1,
            amount: 1
        }
    }
    handleAddCount(e) {
        this.setState({
            count1: this.state.count1 + 1,
        })
        this.setState({
            count2: this.state.count2 + 1
        })
    }
    handleAmount(e) {
        this.setState({
            amount: this.state.count1 + this.state.count2
        })
    }
    render() {
        const { count1, count2, amount } = this.state
        return <div onClick={(e) => this.handleAmount(e)}>
            <div onClick={(e) => this.handleAddCount(e)}>增加</div>
            <div>count1: {count1}</div>
            <div>count2: {count2}</div>
            <div>amount: {amount}</div>
        </div>
    }
}

const root = document.getElementById('root') 
const ref = React.createRef()
// const elem = (
//         <div className='red' id="a" kk="vv" key="asd" ref={ref} onClick={(e) => {console.log('父亲', e.currentTarget)}} style={{color: 'blue'}}>
//             <span onClick={(e) => {console.log(e.currentTarget);}}>子元素</span>
//         </div> 
//     )
ReactDOM.render(<ClassComp ref={ref}/>, root);
console.log('---ref', ref);
