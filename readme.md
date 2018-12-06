react-context-event
=========================
rapid event emitter and listener as hoc

(https://www.npmjs.com/package/react-context-event)

[![npm](https://img.shields.io/npm/dw/react-context-event.svg)]
[![npm](https://img.shields.io/npm/v/react-context-event.svg)]


Хоки этой либы внедряют в компоненты возможность Эмитить сообщения вверх по иерархии компонентов.

## 1) withEvent
Внедряет в компонент следующие функции: on, emit

### emit(`Событие`, `Сообщение`, `userInfo(optional)`)
Посылает сообщение себе и всем компонетам выше по иерархии подписанным на `Событие`
пример: 
```
const EmitterComponent = withEvent({emit}) => (
	<button onClick={() => emit("paybutton:click", {amount:500, productId:1})}>Buy product 1</button>
));
```

### on(`Событие`, `Обработчик`)
обрабатывает сообщения типа `Событие` с помощью колбэка `Обработчик`

`Обработчик`:
```(`Сообщение`, `Обработчик Верхнего_компонента_подписаного на "Событие"`) => { /* process */ }```

пример: 
```
const HandlerComponent = withEvent(({on, emit, children}) => {
    on("paybutton:click, (data, next) => {
        next(data);
        alert(data)
    });
    return (
        <fieldset>
            Обработчик
            {children}
        </fieldset>
    )
});
```

## 2) withEventState

конвертирует подписки в пропсы компонента. +уже включает в себя hoc `withEvent`

Внедряет в компонент следующие функции: 
resetEventState - сбрасывает проперти сообщений к их `изначальному состоянию`
... - данные полученые из сообщений

withEventState(`Компонент`, {Событие:[`Обработчик(){}`, `изначальное состояние`]})

Обработчик - (предыдущее состояние, Сообщение, next, emit) => {
	return "данные которые попадут в Props компонента по ключу `Событие`"
}

пример: 
```
const HandlerComponent = withEventState({on, emit, resetEventState, children, ...props}) => {
    on("paybutton:click", (data, next) => {
        next(data);
        alert(data)
    });
    return (
        <fieldset>
            {
            	props['error:nomoney'] 
            		? (<p>
            			не хватает {props['error:nomoney'].amountText}
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
	        next({...data, handeled:true}); // вы можете изменить сообщение для верхних компонентов

	        // возвращаемое значение изменит props['error:nomoney']
	        return {...data, amountText: "$"+(data.amount/100) }; // 
	    }, 
	    null // начальное значение для `props['error:nomoney']`,
    ],
});
```

## 3) setupEventContext

```
setupEventContext({
    log: function (`handleOn|handleEmit` `Событие`, `ComponentName`, `userInfo`) {
    },
    eventRootHandler: function (`Событие`, `Сообщение`, `userInfo`) {
        console.log("вызывается всякий раз когда событие некому обработать.")
    },
});
```
