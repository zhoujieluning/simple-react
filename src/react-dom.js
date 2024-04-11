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

    const { props = {}, type } = VNode
    const { children } = props
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

    // todo: 设置属性

    return container
}

export default {
    render
}