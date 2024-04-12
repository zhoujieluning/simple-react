function render(VNode, containerDOM) {
    console.log('VNode', VNode);
    console.log('containerDOM', containerDOM);

    mount(VNode, containerDOM)
}

function mount(VNode, containerDOM) {
    // 将虚拟dom转化成真实dom
    const dom = createDOM(VNode)
    // 将真实dom挂载到container
    containerDOM.appendChild(dom)
}

function createDOM(VNode) {
    // 字符串直接当作文本挂载
    if(typeof VNode === 'string') {
        return document.createTextNode(VNode)
    }
    
    const { props = {}, type, key, ref } = VNode
    const { children } = props

    // 处理类组件
    if(typeof type === 'function' && type.IS_CLASS_COMP) {
        return getDOMByClassComponent(VNode)
    }
    // 处理函数组件
    if(typeof type === 'function') {
        return getDOMByFunctionComponent(VNode)
    }

    const container = document.createElement(type)
    // 只有一个文本类型节点
    if(typeof children === 'string')  {
        let dom = document.createTextNode(children)
        container.appendChild(dom)
    } else if(typeof children === 'object') {
        // 有多个子节点
        if(Array.isArray(children)) {
            children.forEach(item => {
                mount(item, container)
            })
        } else { // 有一个非文本类型子节点
            mount(children, container)
        }
        
    }

    setPropsForDOM(container, props) 
    

    return container
}

function setPropsForDOM(container, props = {}) {
    if(!container) return 
    const { style, className } = props

    for(let key in props) {
        if(key === 'children') continue
        if(/^on[A-Z].*/.test(key)) {
            // todo: 事件

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
    const { type, props } = VNode
    const classInstance = new type(props)
    const renderVNode = classInstance.render()
    if(!renderVNode) return
    return createDOM(renderVNode)
}

export default {
    render
}