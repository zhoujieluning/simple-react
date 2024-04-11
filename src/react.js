import { REACT_ELEMENT } from './utils'

function createElement(type, props, ...children) {
    const key = props && props.key
    const ref = props && props.ref

    delete props.key
    delete props.ref
    
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
    createElement
}