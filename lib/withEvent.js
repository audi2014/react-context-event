import {createElement} from "react";
import {getEventContext} from "./store";

export function withEvent(Component, Context = getEventContext()) {
    console.log(Component.displayName);
    const EventComponent = function ({_emit, _log, children, ...props}) {
        const events = {};
        const handleOn = (event, callback, ...args) => {
            const name = Component.displayName;
            if (events[event]) {
                _log("error", "handleOn", event, `already subscribed`, name, ...args);
            } else {
                _log("info", "handleOn", event, `subscribed`, name, ...args)
                events[event] = callback;
            }
        };
        const handleEmit = (event, data, ...args) => {
            if (events[event]) {

                _log("info", "handleEmit", event, `handled`, Component.displayName, data, ...args)

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

        return createElement(
            Component,
            {
                ...props,
                on: handleOn,
                emit: handleEmit,
            },
            createElement(
                Context.Provider,
                {
                    value: {
                        emit: handleEmit,
                        log: _log
                    }
                },
                children
            )
        )
    };

    EventComponent.displayName = `withEvent(${Component.displayName})`

    const ComponentWithEvent = function (props) {
        return createElement(
            Context.Consumer,
            null,
            ({emit, log}) => createElement(EventComponent, {...props, _emit: emit, _log: log})
        );
    };
    ComponentWithEvent.displayName = `withEventContext(${EventComponent.displayName})`;
    return ComponentWithEvent;

}