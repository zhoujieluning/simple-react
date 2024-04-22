import { addEvent } from './event'
import { primitiveDataTypes, REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT } from './utils';

function render(VNode, containerDOM) {
    // 文本直接挂载
    if(primitiveDataTypes.includes(typeof VNode)) {
        containerDOM.appendChild(document.createTextNode(VNode))
        return 
    }
    mount(VNode, containerDOM)
}

function mount(VNode, containerDOM) {
    // 将虚拟dom转化成真实dom
    const dom = createDOM(VNode)
    // 将真实dom挂载到container
    containerDOM.appendChild(dom)
}

export function createDOM(VNode) {
    const { props = {}, type, key, ref } = VNode
    const { children = [] } = props

    // 处理文本
    if(VNode.$$typeof === REACT_TEXT) {
        const dom = document.createTextNode(VNode.value)
        VNode.dom = dom
        return dom
    }

    // 处理类组件
    if(typeof type === 'function' && type.IS_CLASS_COMP) {
        return getDOMByClassComponent(VNode)
    }
    // 处理函数组件
    if(typeof type === 'function' && type.$$typeof === REACT_ELEMENT) {
        return getDOMByFunctionComponent(VNode)
    }
    // 处理函数组件-forwardRef
    if(VNode.$$typeof === REACT_FORWARD_REF) {
        return getDOMByForwardRefFunctionComponent(VNode)
    }

    // 处理普通标签
    const container = document.createElement(type)
    children.forEach((child, index) => {
        child.index = index
        mount(child, container)
    })

    setPropsForDOM(container, props) 
    
    ref && (ref.current = container)

    VNode.dom = container
    return container
}

function setPropsForDOM(container, props = {}) {
    if(!container) return 
    const { style, className } = props

    for(let key in props) {
        if(key === 'children') continue
        if(/^on[A-Z].*/.test(key)) {
            addEvent(container, key.toLowerCase(), props[key])
        } else if(key === 'style') {
            // style 要求是纯对象类型 - {}
            if(Object.prototype.toString.call(style) !== '[object Object]') {
                throw new Error('The `style` prop expects a mapping from style properties to values')
            } else {
                for(let key in style) {
                    container.style[key] = style[key]
                }
            }
        } else if(key === 'className') {
            container.className = className
        }
        container.setAttribute(key, props[key])
    }

}

function getDOMByFunctionComponent(VNode) {
    const { type, props } = VNode
    const renderVNode = type(props)
    if(!renderVNode) return
    return createDOM(renderVNode)
}

function getDOMByClassComponent(VNode) {
    const { type, props, ref } = VNode
    const classInstance = new type(props)
    const renderVNode = classInstance.render()

    ref && (ref.current = classInstance)

    if(!renderVNode) return
    const dom = createDOM(renderVNode)
    // 将dom节点和VNode记录在实例上。
    classInstance.oldVNode = renderVNode
    classInstance.oldVNode.dom = dom
    return dom
}

function getDOMByForwardRefFunctionComponent(VNode) {
    const { type, props, ref } = VNode
    const render = type.render
    if(typeof render !== 'function') return
    
    const renderVNode = render(props, ref)
    return createDOM(renderVNode)
}

export function updateDOMTree(oldVNode, newVNode, oldDOM) {
    const typeMaps = {
        NO_OPERATE: !oldVNode && !newVNode,
        DELETE: oldVNode && !newVNode,
        APPEND: !oldVNode && newVNode,
        REPLACE: oldVNode && newVNode && oldVNode.type !== newVNode.type,
        DIFF: oldVNode && newVNode && oldVNode.type === newVNode.type
    }
    const parent = oldDOM.parentNode
    const oprType = Object.keys(typeMaps).filter(type => typeMaps[type])[0]

    switch(oprType) {
        // 新旧节点都不存在
        case 'NO_OPERATE':
            break
        // 旧节点存在，新节点不存在，删除旧dom
        case 'DELETE':
            oldDOM.remove()
            break
        // 旧节点不存在，新节点存在，插入新dom
        case 'APPEND':
            parent.appendChild(createDOM(newVNode))
            break
        // 新旧节点都存在，类型不一样，替换
        case 'REPLACE':
            oldDOM.remove()
            parent.appendChild(createDOM(newVNode))
            break
        // 新旧节点都存在，类型也一样，深度比较
        case 'DIFF':
            deepDomDiff(oldVNode, newVNode, oldDOM)
    }
}

function deepDomDiff(oldVNode, newVNode, oldDOM) {
    const  { $$typeof, type = {} } = oldVNode
    const typeMaps = {
        ORIGIN_NODE: typeof type === 'string',
        CLASS_COMPONENT: typeof type === 'function' && type.IS_CLASS_COMP,
        FUNC_COMPONENT: typeof type === 'function' && !type.IS_CLASS_COMP,
        TEXT: $$typeof === REACT_TEXT
    }
    const DIFF_TYPE = Object.keys(typeMaps).filter(item => typeMaps[item])[0]
    switch(DIFF_TYPE) {
        case 'ORIGIN_NODE': 
            newVNode.dom = oldVNode.dom
            setPropsForDOM(oldDOM, newVNode.props)
            updateChildren(oldVNode.props.children, newVNode.props.children, oldVNode.dom)
            break
        case 'CLASS_COMPONENT': 
            updateClassComponent(oldVNode, newVNode)
            break
        case 'FUNC_COMPONENT': 
            updateFuncComponent(oldVNode, newVNode)
            break
        case 'TEXT': 
            newVNode.dom = oldVNode.dom
            oldVNode.dom.textContent = newVNode.value
            break
    }
}

function updateClassComponent(oldVNode, newVNode) {
    const { type, props } = newVNode
    const classInstance = new type(props)
    const renderVNode = classInstance.render()
    renderVNode.classInstance = classInstance
    updateDOMTree(oldVNode, renderVNode, oldVNode.dom)
}

function updateFuncComponent(oldVNode, newVNode) {
    const { type, props } = newVNode
    const renderVNode = type(props)
    updateDOMTree(oldVNode, renderVNode, oldVNode.dom)
}

function updateChildren(oldVNodeChildren, newVNodeChildren, parent) {
    // 基点，最近的一个能匹配到新节点的旧节点的下标
    let lasNotChangeIndex = -1
    // 用于记录新节点的操作： 移动，新增
    const actions = []
    const oldVNodeKeyMap = {}
    oldVNodeChildren.forEach((oldVNodeChild, index) => {
        oldVNodeChild.key = oldVNodeChild.key ? oldVNodeChild.key : index
        oldVNodeKeyMap[oldVNodeChild.key] = oldVNodeChild
    })
    newVNodeChildren.forEach((newVNodeChild, index) => {
        newVNodeChild.key = newVNodeChild.key ? newVNodeChild.key : index
        // 匹配到旧节点
        if(oldVNodeKeyMap[newVNodeChild.key]) {
            const oldVNodeChild = oldVNodeKeyMap[newVNodeChild.key]
            // 旧节点位置靠前
            if(oldVNodeChild.index < lasNotChangeIndex) {
                actions.push({
                    operation: 'move',
                    newVNodeChild,
                    oldVNodeChild,
                    index
                })
                updateDOMTree(oldVNodeChild, newVNodeChild, oldVNodeChild.dom)
                // 将用到的删除，oldVNodeKeyMap中最后剩下的，都是用不到的
                delete oldVNodeKeyMap[newVNodeChild.key]
            } else {
                // 使用旧节点
                lasNotChangeIndex = oldVNodeChild.index
                updateDOMTree(oldVNodeChild, newVNodeChild, oldVNodeChild.dom)
                // 将用到的删除，oldVNodeKeyMap中最后剩下的，都是用不到的
                delete oldVNodeKeyMap[newVNodeChild.key]
            }
        } else {
            // 没匹配到旧节点，说明是新增的
            actions.push({
                operation: 'create',
                newVNodeChild,
                index
            })
        }
    })

    // 将无用的旧dom都删掉
    const VNodeToMove = actions.filter(action => action.operation === 'move').map(action => action.oldVNodeChild)
    const VNodeToDelete = Object.values(oldVNodeKeyMap)
    VNodeToMove.concat(VNodeToDelete).forEach(oldVNode => {
        oldVNode.dom.remove()
    })

    actions.forEach(action => {
        const { operation: oprType, oldVNodeChild, newVNodeChild, index } = action
        const childNodes = parent.childNodes
        const childNode = childNodes[index]
        if(oprType === 'move') {
            if(childNode) {
                parent.insertBefore(oldVNodeChild.dom, childNode)
            } else {
                parent.appendChild(oldVNodeChild.dom)
            }
        } else {
            if(childNode) {
                parent.insertBefore(createDOM(newVNodeChild), childNode)
            } else {
                parent.appendChild(createDOM(newVNodeChild))
            }
        }
    })

}

export default {
    render
}