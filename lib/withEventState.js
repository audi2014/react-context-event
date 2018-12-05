import {createElement, Component as ReactComponent} from "react";
import {withEvent} from "./withEvent";

export function withEventState(Component, stateFromEvent) {
    class ComponentWithEventState extends ReactComponent {
        constructor(props) {
            super(props);
            this.state = {}

            for (let event in stateFromEvent) {
                const [callback, initialState, ...args] = stateFromEvent[event]

                this.state[event] = initialState;

                this.props.on(event, (data, next) => {
                    this.setState(function (prevState) {
                        return {
                            [event]: callback(prevState[event], data, next, this.props.emit)
                        }
                    })
                }, ...args)
            }

        }

        handleClearEventState = event => {
            this.setState({[event]: stateFromEvent[event][1]});
        };

        render() {
            return createElement(
                Component,
                {
                    ...this.props,
                    ...this.state,
                    resetEventState: this.handleClearEventState,
                }
            )
        }
    }

    ComponentWithEventState.displayName = `withEventState(${Component.displayName})`;
    const ComponentWithEventAndState = withEvent(ComponentWithEventState);
    ComponentWithEventState.displayName = `withEvent(${Component.displayName})`;
    return ComponentWithEventAndState;
}