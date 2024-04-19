// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';
import './index.css'

function FuncComp(props) {
    return <div>asdf</div>
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
ReactDOM.render(<ClassComp />, root);
