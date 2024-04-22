// import React, { useState, useReducer } from 'react';
// import ReactDOM from 'react-dom';
import React, { useState, useReducer } from './react';
import ReactDOM from './react-dom';
import './index.css'

function reducer(state, action) {
    switch(action.type) {
        case 'add':
            return state + 1
        case 'minus':
            return state - 1
        default:
            throw new Error('unknown action')
    }
}

function FuncComp(props) {
    const [amount, setAmount] = useState(0)
    const [count, dispatch] = useReducer(reducer, 0)
    function addOne() {
        dispatch({ type: 'add'})
    }
    function minusOne() {
        dispatch({ type: 'minus'})
    }
    function addAmount() {
        setAmount(amount + 1)
    }

    return <div>
        {count}
        <button onClick={addOne}>加</button>
        <button onClick={minusOne}>减</button>
        <button onClick={addAmount}>amount</button>
        <div>{amount}</div>
    </div>
}

const ForwardFuncComp = React.forwardRef((props, ref) => {
    return <div ref={ref}>asdf</div>
})

class ClassComp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: ['A', 'B', 'C', 'D', 'E' ]
        }
    }
    componentDidMount() {
        console.log('mount');
        const aaa = document.getElementById('#aaa')
        debugger
        console.log(aaa);
    }

    componentDidUpdate(prevProps, pervState, snapshot) {
        console.log('update', prevProps, pervState);
    }
    componentWillUnMount() {
        console.log('unmount');
    }
    changeArr(e) {
        this.setState({
            arr: ['C', 'F', 'B', 'A', 'E' ],
        })
    }
    render() {
        const { arr } = this.state
        return <div key="g">
            <button key="n" onClick={(e) => this.changeArr(e)}>改变</button>
            {arr.map(item => {
                return <div key={item}>{item}</div>
            })}
        </div>
    }
}

const root = document.getElementById('root') 
// const elem = (
//         <div className='red' id="a" kk="vv" key="asd" ref={ref} onClick={(e) => {console.log('父亲', e.currentTarget)}} style={{color: 'blue'}}>
//             <span onClick={(e) => {console.log(e.currentTarget);}}>子元素</span>
//         </div> 
//     )
ReactDOM.render(<FuncComp />, root);
