import { createDOM, updateDOMTree } from './react-dom'

/**
 * 单例模式创建更新器队列，只存在一个，全部组件共用
 */
export class UpdaterQueue {
    constructor() {
        this.isBatchingUpdate = false
        this.updaters = new Set()
        this.instance = null
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new UpdaterQueue()
            return this.instance
        } else {
            return this.instance
        }
    }

    flushUpdaters() {
        this.isBatchingUpdate = false
        for(let updater of this.updaters) {
            updater.launchUpdate()
        }
        this.updaters.clear()
    }
}

/**
 * 更新器，处理类组件的更新逻辑，一个类组件对应一个
 */
class Updater {
    constructor(classCompInstance) {
        this.updaterQueueIns = UpdaterQueue.getInstance()
        this.classCompInstance = classCompInstance
        this.pendingStates = {}
    }

    // 暂存状态
    stageStates(partialState) {
        const updaterQueueIns = this.updaterQueueIns
        this.pendingStates = {
            ...this.pendingStates,
            ...partialState
        }
        // 处于批量更新机制中，收集更新器
        if(updaterQueueIns.isBatchingUpdate) {
            updaterQueueIns.updaters.add(this)
        } else {
            // 不处于，立即更新
            this.launchUpdate()
        }
    }

    launchUpdate() {
        console.log('重新渲染');
        // 状态合并
        this.classCompInstance.state = {
            ...this.classCompInstance.state,
            ...this.pendingStates
        }

        const classCompInstance = this.classCompInstance

        const oldVNode = classCompInstance.oldVNode
        const oldDOM = oldVNode.dom
        const newVNode = classCompInstance.render()
        classCompInstance.oldVNode = newVNode

        updateDOMTree(oldVNode, newVNode, oldDOM)
    }
}

export default class Component {
    static IS_CLASS_COMP = true
    constructor(props) {
        this.props = props
        this.updater = new Updater(this)
    }

    setState(partialState) {
        this.updater.stageStates(partialState)
    }
}