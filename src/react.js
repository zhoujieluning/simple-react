import { REACT_ELEMENT } from './utils'
import { createDOM } from './react-dom'

function createElement(type, props, ...children) {
    const key = props && props.key
    const ref = props && props.ref

    // ! Uncaught TypeError: Cannot read properties of undefined (reading '__source')
    // ['key', 'ref', '__self', '__source'].forEach(item => {
    //     delete props[item]
    // })
    delete props.key
    delete props.ref
    delete props.__self
    delete props.__source
    
    if(children.length === 1) {
        props.children = children[0]
    } else if(children.length > 1) {
        props.children = children
    }
    const res = {
        $$typeof: REACT_ELEMENT,
        type,
        key,
        ref,
        props,
    }
    return res
}

class Component {
    static IS_CLASS_COMP = true
    constructor(props) {
        this.props = props
    }

    setState(partialState) {
        console.log('setState');
        const classInstance = this
        this.state = {
            ...this.state,
            ...partialState
        }

        /**
         * 1. 拿到旧dom的父节点
         * 2. 删除其子元素
         * 3. 将新节点插给他
         */
        const oldDOM = this.oldDOM
        const parent = oldDOM.parentNode
        
        parent.removeChild(oldDOM)

        const newVNode = classInstance.render()
        const newDOM = createDOM(newVNode)

        parent.appendChild(newDOM)
        this.oldDOM = newDOM

    }
}

export default {
    createElement,
    Component
}