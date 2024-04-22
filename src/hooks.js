import { emitUpdateForHooks } from './react-dom'

const states = []
let hookIndex = 0

export function resetHookIndex() {
    hookIndex = 0
}
export function useState(initialValue) {
    states[hookIndex] = states[hookIndex] || initialValue
    const currentIndex = hookIndex
    function setState(newValue) {
        states[currentIndex] = newValue
        emitUpdateForHooks()
    }
    return [states[hookIndex++], setState]
}

export function useReducer(reducer, initialValue) {
    states[hookIndex] = states[hookIndex] || initialValue
    const currentIndex = hookIndex
    function dispatch(action) {
        states[currentIndex] = reducer(states[currentIndex], action)
        emitUpdateForHooks()
    }
    return [states[hookIndex++], dispatch]
}

export function useEffect(effectFunc, deps) {
    const currentIndex = hookIndex
    const [destroyedFunc, prevDeps] = states[currentIndex] || [null, null]
    // 首次调用，或者依赖发生变化
    if(!deps || !states[currentIndex] || deps.some((item, index) => item !== prevDeps[index])) {
        destroyedFunc && typeof destroyedFunc === 'function' && destroyedFunc()
        states[currentIndex] = [effectFunc(), deps]
    }
    hookIndex++
}

export function useRef(initialValue) {
    states[hookIndex] = states[hookIndex] || { current: initialValue }
    return states[hookIndex++]
}

export function useMemo(cb, deps) {
    const [prevValue, prevDeps] = states[hookIndex] || [null, null]
    if(!states[hookIndex] || deps.some((item, index) => item !== prevDeps[index])) {
        const curVal = cb()
        states[hookIndex++] = [curVal, deps]
        return curVal
    } else {
        hookIndex++
        return prevValue
    }
}

export function useCallback(cb, deps) {
    const [prevCb, prevDeps] = states[hookIndex] || [null, null]
    if(!states[hookIndex] || deps.some((item, index) => item !== prevDeps[index])) {
        states[hookIndex++] = [cb, deps]
        return cb
    } else {
        hookIndex++
        return prevCb
    }
}