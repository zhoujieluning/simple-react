import { REACT_ELEMENT, REACT_TEXT, REACT_FORWARD_REF, primitiveDataTypes } from './utils'
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

    // 统一children存储方式：无论是单文本节点，还是单元素节点，props.children都存储为数组
    props.children = children.map(item => {
        if(primitiveDataTypes.includes(typeof item)) {
            return {
                $$typeof: REACT_TEXT,
                value: children[0]
            }
        }
        return item
    }).flat(1)
    
    const res = {
        $$typeof: REACT_ELEMENT,
        type,
        key,
        ref,
        props: props || {},
    }
    return res
}

function createRef() {
    return {
        current: null
    }
}

function forwardRef(render) {
    return {
        $$typeof: REACT_FORWARD_REF,
        render
    }
}

export default {
    createElement,
    Component,
    createRef,
    forwardRef
}