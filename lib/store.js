import {createContext} from 'react';

const EVENT_CONTEXT = createContext({
    emit: function (event, data, ...args) {

    },
    log: function (type, ...args) {
        console[type]("EVENT_CONTEXT: ", args)
    }
});

export function getEventContext() {
    return EVENT_CONTEXT;
}