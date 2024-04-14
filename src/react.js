import { REACT_ELEMENT } from './utils'
import Component from './Component'

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

export default {
    createElement,
    Component
}