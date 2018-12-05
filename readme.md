# react-context-event
rapid event emiter and listener hoc

Хоки этой либы внедряют в компоненты возможность Эмитить сообщения вверх по иерархии компонентов.

## 1) withEvent
Внедряет в компонент следующие функции: on, emit

### emit(`Событие`, `Сообщение`, `userInfo(optional)`)
Посылает сообщение себе и всем компонетам выше по иерархии подписаным на `Событие`
пример: 
```
const EmiterComponent = withEvent({emit}) => (
	<button onClick={() => emit("paybutton:click", {amount:500, productId:1})}>Buy product 1</button>
));
```

### on(`Событие`, `Обработчик`)
обрабатывает сообщения типа `Событие` с помощью калбэка `Обработчик`

`Обработчик`:
```(`Сообщение`, `Обработчик_Верхнего_компонента_подписаного на "Событие"`) => { /* process */ }```

пример: 
```
const HandlerComponent = withEvent(({depth, on, emit, children}) => {
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

пример: 
```
const HandlerComponent = withEventState({depth, on, emit, children, ...props}) => {
    on("paybutton:click", (data, next) => {
        next(data);
        alert(data)
    });
    return (
        <fieldset>
            {
            	props['error:nomoney'] 
            		? "не хватает "+props['error:nomoney'].amountText
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