// import React, { useState, useReducer, useEffect, useRef, useMemo, useCallback } from 'react';
// import ReactDOM from 'react-dom';
import React, { useState, useReducer, useEffect, useRef, useMemo, useCallback } from './react';
import ReactDOM from './react-dom';
import './index.css'


function FuncComp(props) {
    const [count1, setCount1] = useState(0)
    const [count2, setCount2] = useState(0)
    const [count3, setCount3] = useState(0)
    const amount = useMemo(() => {
        console.log('缓存计算');
        return count1 + count2
    }, [count1, count2])

    const addCount12 = useCallback(() => {
        console.log('缓存函数');
        setCount1(count1 + 1)
        setCount2(count2 + 1)
    }, [count1], [count2])

    function addCount3() {
        setCount3(count3 + 1)
    }
    
    return <div>
        <div>count1:{count1}</div>
        <div>count2:{count2}</div>
        <div>count3:{count3}</div>
        <div>amount:{amount}</div>
        <button onClick={addCount12}>count12</button>
        <button onClick={addCount3}>count3</button>
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
