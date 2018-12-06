react-context-event
=========================
rapid event emitter and listener as hoc

(https://www.npmjs.com/package/react-context-event)

[![npm](https://img.shields.io/npm/dw/react-context-event.svg)](https://www.npmjs.com/package/react-context-event)
[![npm](https://img.shields.io/npm/v/react-context-event.svg)](https://www.npmjs.com/package/react-context-event)

This lib contains HOC-functions witch provides into `WrappedComponent` ability to emit messages to parent components and subscribe for events from child components

#

## 1) withEvent(`WrappedComponent`)

#### `WrappedComponent` - your react class-component or functional-component

Implements the following functions into the component: on, emit

#### emit(`Event`, `Message`, `userInfo(optional)`)

Sends a message to itself and all components above the hierarchy subscribed to `Event`
example: 
```
const EmitterComponent = withEvent({emit}) => (
	<button onClick={() => emit("paybutton:click", {amount:500, productId:1})}>Buy product 1</button>
));
```

#### on(`Event`, `Handler`)
subscribe component to ʻEvent` using the callback `Handler`
```
Handler = (`Message`, `Handler_of_parent_context_with_same_Event`) => { /* process */ }
```
example: 
```
const HandlerComponent = withEvent(({on, emit, children}) => {
    on("paybutton:click, (data, next) => {
        next(data);
        alert(data)
    });
    return (
        <fieldset>
            Handler
            {children}
        </fieldset>
    )
});
```

#

## 2) withEventState(`WrappedComponent`, `StatefulSubscriptions`)

Map subscriptions to props of WrappedComponent + all functions of HOC `withEvent`

#### `WrappedComponent` - your react class-component or functional-component

#### `StatefullSubscriptions` - object with keys like `Event`, values like [`Handler(){}`, `initial_state`]

```
const StatefullSubscriptions = [
	(`prevState`, `message`, `next`, `emit`) => { // `Handler`
		return "data from handled message which passed into the `WrappedComponent` Props by key `Event`"
	},
	"" // `initial_state`
]
```

Implements the following props into the component: `resetEventState`, `...eventProps`

#### `resetEventState` - function which resets eventProps to their `initial_state`

#### `...eventProps` - data received from handled messages

example: 
```
const HandlerComponent = withEventState({on, emit, resetEventState, children, ...eventProps}) => {
    on("paybutton:click", (data, next) => {
        next(data);
        alert(data)
    });
    return (
        <fieldset>
            {
            	eventProps['error:nomoney'] 
            		? (<p>
            			Need more gold {eventProps['error:nomoney'].amountText}!
            			<button onClick={() => resetEventState('error:nomoney')}>ok</button>
            		</p>)
            		: null
            }
            {children}
        </fieldset>
    )
}, {
	"error:nomoney": [
		function (prevState, data, next, emit) {
	        next({...data, handeled:true}); // you can change this message for parent components

	        // the return value will be passed to props['error:nomoney']
	        return {...data, amountText: "$"+(data.amount/100) }; // 
	    }, 
	    null // initial value of `props['error:nomoney']`,
    ],
});
```

## 3) setupEventContext

```
setupEventContext({
    log: function (`handleOn|handleEmit` `Event`, `ComponentName`, `userInfo`) {
    },
    eventRootHandler: function (`Event`, `Message`, `userInfo`) {
        console.log("invoked whenever there is no one to handle the event.")
    },
});
```
