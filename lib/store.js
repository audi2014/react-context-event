import {createContext} from 'react';

var EVENT_CONTEXT = null;

const defaultLogger = function (type, ...args) {
    console[type]("EVENT_CONTEXT: ", args)
}
const  defaultEventRootHandler = function (event, data, ...argss) {
}

function createEventContext({eventRootHandler = defaultEventRootHandler, log = defaultLogger}) {
    return createContext({
        emit:eventRootHandler, log,
    });
}

export function getEventContext() {
    if (!EVENT_CONTEXT) {
        EVENT_CONTEXT = createEventContext({})
    }
    return EVENT_CONTEXT;
}

export function setupEventContext(cfg) {
    if (!EVENT_CONTEXT) {
        EVENT_CONTEXT = createEventContext(cfg)
    } else {
        throw new Error("EVENT_CONTEXT already created")
    }
    return EVENT_CONTEXT;
}