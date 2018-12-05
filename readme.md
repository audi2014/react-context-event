# react-context-event
rapid event emiter and listener hoc

# Хоки этой либы внедряют в компоненты возможность Эмитить сообщения вверх по иерархии компонентов.

1) withEvent
Внедряет в компонент следующие функции: on, emit

# emit(`Событие`, `Сообщение`)
Посылает сообщение себе и всем компонетам выше по иерархии подписаным на `Событие`
пример: 
```<button onClick={() => emit("paybutton:click", {amount:500, productId:1})}>Buy product 1</button>```

# on(`Событие`, `Обработчик`)
обрабатывает сообщения типа `Событие` с помощью калбэка `Обработчик`

`Обработчик`:
```(`Сообщение`, `Обработчик_Верхнего_компонента_подписаного на "Событие"`) => { /* process */ }```

пример: 
```
const A = ({depth, on, emit, children}) => {
    on("paybutton:click"", (data, next) => {
        next(data);
        alert(data)
    });
    return (
        <fieldset>
            Обработчик
            {children}
        </fieldset>
    )
};
```
