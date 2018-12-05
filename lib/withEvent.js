import React from "react";
import {getEventContext} from "./store";

export function withEvent(Component, Context = getEventContext()) {
    console.log(Component.displayName);
    const EventComponent = function ({_emit, _log, children, ...props}) {
        const events = {};
        const handleOn = (event, callback, ...args) => {
            const name = Component.displayName;
            if(events[event]) {
                _log("error", "handleOn", `event ${event} subscribed in Component:`, name, ...args);
                console.error(`event ${event} already subscribed in Component:`, name, ...args)
            } else {
                _log("info", "handleOn", `event ${event} subscribed in Component:`, name, ...args)
                events[event] = callback;
            }
        };
        const handleEmit = (event, data, ...args) => {
            if (events[event]) {

                _log("info", "handleEmit", `event ${event} handled by Component:`, Component.displayName, data, ...args)

                events[event](
                    data,
                    (...nextArgs) => {
                        return _emit(event, ...nextArgs)
                    }
                )
            } else {
                return _emit(event, data, ...args)
            }
        };
        return (
            <Component
                {...props}
                on={handleOn}
                emit={handleEmit}
            >
                <Context.Provider
                    value={{
                        emit: handleEmit,
                        log: _log
                    }}
                >
                    {children}
                </Context.Provider>
            </Component>
        );
    };

    EventComponent.displayName = `withEvent(${Component.displayName})`

    const ComponentWithEvent = function (props) {
        return (
            <Context.Consumer>
                {
                    ({emit, log}) => (<EventComponent {...props} _emit={emit} _log={log}/>)
                }
            </Context.Consumer>
        )
    };
    ComponentWithEvent.displayName = `withEventContext(${EventComponent.displayName})`;
    return ComponentWithEvent;

}