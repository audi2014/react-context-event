// withContext.js
import React from 'react';
// const CONTEXT = React.createContext({});
// export function getContext(){return CONTEXT;}
const EVENT_CONTEXT = React.createContext({
    emit:function (event, data, ...args) {

    },
    log:function (type, ...args) {
        console[type]("EVENT_CONTEXT: ", args)
    }
});
export function getEventContext(){return EVENT_CONTEXT;}