/**
 * 事件合成机制-将事件挂载到document，后续通过冒泡机制在document上调用
 * @param {*} dom 
 * @param {*} eventName 
 * @param {*} bindFuction 
 */
export function addEvent(dom, eventName, bindFuction) {
    // dom上虽然没有真正挂载事件，但是要将事件回调记录
    dom.attach = dom.attach || {}
    dom.attach[eventName] = bindFuction

    // 同一个事件，只在document上挂载一次
    if(document[eventName]) return
    document[eventName] = dispatchEvent
}

/**
 * 事件合成机制-事件统一派发函数
 * @param {Event} nativeEvent 
 */
function dispatchEvent(nativeEvent) {
    const syntheticEvent = createSyntheticEvent(nativeEvent)

    // 事件源-触发事件的dom
    let currentDom = nativeEvent.target

    // 模拟事件冒泡--一级一级往上执行父元素的同名事件
    while(currentDom) {
        // 根据事件类型，执行事件回调
        const eventName = `on${nativeEvent.type}`
        const attach = currentDom.attach || {}
        const bindFuction = attach[eventName]
        /**
         * 子元素触发事件后，冒泡到父元素，如何在父元素的事件回调里拿到当前dom呢？ 
         * 通过event.target拿到的永远是事件源的dom。通过event.currentTarget拿到的才是当前dom.
         * 所以下面要在事件里，用currentTarget记录一下当前dom
         */
        syntheticEvent.currentTarget = currentDom
        bindFuction && bindFuction(syntheticEvent)

        // 阻止冒泡
        if(syntheticEvent.isPropagationStopped) {
            break 
        }
        
        currentDom = currentDom.parentNode
    }
}

/**
 * 事件合成机制-创建合成事件，屏蔽浏览器之间差异
 * @param {Event} nativeEvent 
 */
function createSyntheticEvent(nativeEvent) {
    const syntheticEvent = {
        ...nativeEvent,
        nativeEvent,
        isDefaultPrvented: false,
        isPropagationStopped: false,
        preventDefault() {
            this.isDefaultPrvented = true
            if(this.nativeEvent.preventDefault) {
                this.nativeEvent.preventDefault()
            } else {
                this.nativeEvent.returnValue = false
            }
        },
        stopPropagation() {
            this.isPropagationStopped = true
            if(this.nativeEvent.stopPropagation) {
                this.nativeEvent.stopPropagation()
            } else {
                this.nativeEvent.cancelBubble = true
            }
        }
    }
    return syntheticEvent
}