```jsx
import React, {Component} from 'react';


// import {setupEventContext,withEvent, withEventState} from 'react-context-event'
import {setupEventContext,withEvent, withEventState} from './lib/';

setupEventContext({
    log: function (type, ...args) {
        console[type]("EVENT_CONTEXT: ", args)
    },
    eventRootHandler: function () {
        console.log("setupEventContext:eventRootHandler")
    },
});


const A = ({depth, on, emit, children}) => {
    on("eventA", (data, next) => {
        next(data);

    });
    return (
        <fieldset>
            <h4>A {depth}</h4>
            <p>this listener continue events of A</p>
            <button onClick={() => emit("eventA", "a")}>eventA:a</button>
            <button onClick={() => emit("eventB", "b")}>eventA:b</button>
            <button onClick={() => emit("eventC", "c")}>eventA:c</button>
            <br/>
            {children}
        </fieldset>
    )
};
A.displayName = "A";
const AwithEvent = withEvent(A);
AwithEvent.displayName = "AwithEvent";

const AB = ({depth, on, emit, children, eventA}) => {
    on("eventA", (data, next) => {


    });
    on("eventB", (data, next) => {
        next(data);

    });
    return (
        <fieldset>
            <h4>AB {depth}</h4>
            <p>this listener stoped events of A </p>
            <p>this listener continue events of B </p>

            <code>{eventA}</code><br/>
            <button onClick={() => emit("eventA", "a")}>eventA:a</button>
            <button onClick={() => emit("eventB", "b")}>eventA:b</button>
            <button onClick={() => emit("eventC", "c")}>eventA:c</button>
            <br/>
            {children}
        </fieldset>
    )
};
AB.displayName = "AB";
const ABwithEvent = withEvent(AB);
ABwithEvent.displayName = "ABwithEvent";

const AC = ({depth, on, emit, resetEventState, children, eventA, eventC}) => (
    <fieldset>
        <h4>AC {depth}</h4>
        <p>this listener rewrite eventA by EventState. eventA will continue</p>
        <p>this listener show C state </p>

        <code>{eventC}</code> <button onClick={() => resetEventState("eventC")}>ok</button><br/>
        <button onClick={() => emit("eventA", "a")}>eventA:a</button>
        <button onClick={() => emit("eventB", "b")}>eventA:b</button>
        <input
            type="text"
            defaultValue={"eventC:input"}
            onChange={(e) => emit("eventC", e.currentTarget.value)}
        />

        <br/>
        {children}
    </fieldset>
);
AC.displayName = "AC";

const ACwithEvent = withEventState(AC, {
    eventA: [function (prevState, data, next, emit) {
        next("updated by AC => " + data);
        return prevState + " (state without updation)";
    }, "state of eventA", "AC-eventA-withEventState"],
    eventC: [function (prevState, data, next, emit) {
        next(data);
        return data;
    }, "state of eventC", "AC-eventC-withEventState"]
});
ACwithEvent.displayName = "ACACwithEvent";


class App extends Component {
    render() {
        return (
            <div className="App">
                <ACwithEvent>
                    <ABwithEvent depth="1">
                        <ABwithEvent depth="2">
                            <ABwithEvent depth="1">

                                <AwithEvent depth="3">
                                    <div>
                                        <ACwithEvent/>
                                    </div>

                                </AwithEvent>
                            </ABwithEvent>
                        </ABwithEvent>
                    </ABwithEvent>
                </ACwithEvent>
            </div>
        );
    }
}


export default App;
```