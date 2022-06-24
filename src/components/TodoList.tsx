import React, { Key, useState } from 'react'
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue, useSetRecoilState, SetterOrUpdater, } from 'recoil';

// 1、アトムファミリーにアトムを追加する------------------------------------------------------------------------------
// アトムの型定義
type todoListState = {
    id: Key | null | undefined;
    key: string,
    // default: string[] 
}
// アトムの追加
const todoListState = atom<todoListState[]>({
    key: 'TodoList',
    default: [],
});

const TodoList: React.FC = () => {
    // 2、アトムファミリーからアトムを読み込む
    const todoList = useRecoilValue(todoListState);

    return (
        <>
            {/* <TodoListStats /> */}
            {/* <TodoListFilters /> */}
            <TodoItemCreator />

            {todoList.map((todoItem) => (
                <TodoItem key={todoItem.id} item={todoItem} />
            ))}
        </>
    );
}
const TodoItemCreator: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    // 3、アトムファミリーにあるアトムの内容を更新する関数を取得する
    const setTodoList: SetterOrUpdater<any> = useSetRecoilState(todoListState);

    const addItem = () => {
        setTodoList((oldTodoList: any) => [
            ...oldTodoList,
            {
                id: getId(),
                text: inputValue,
                isComplete: false,
            },
        ]);
        setInputValue('');
    };

    const onChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setInputValue(value);
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={onChange} />
            <button onClick={addItem}>Add</button>
        </div>
    );
}

// utility for creating unique Id
let id = 0;
function getId() {
    return id++;
}

type Props = {
    item: any
}
const TodoItem: React.FC<Props> = ({ item }) => {
    // 4、useStateのようにAtomを扱えるようにする
    const [todoList, setTodoList] = useRecoilState(todoListState);

    const index: number = todoList.findIndex((listItem) => listItem === item);

    const editItemText = (e:  React.ChangeEvent<HTMLInputElement>) => {
        const newList: todoListState[] = replaceItemAtIndex(todoList, index, {
            ...item,
            text: e.target.value,
        });

        setTodoList(newList);
    };

    const toggleItemCompletion = () => {
        const newList: todoListState[] = replaceItemAtIndex(todoList, index, {
            ...item,
            isComplete: !item.isComplete,
        });

        setTodoList(newList);
    };

    const deleteItem = () => {
        const newList: todoListState[] = removeItemAtIndex(todoList, index);

        setTodoList(newList);
    };

    return (
        <div>
            <input type="text" value={item.text} onChange={(e) => editItemText(e)} />
            <input
                type="checkbox"
                checked={item.isComplete}
                onChange={toggleItemCompletion}
            />
            <button onClick={deleteItem}>X</button>
        </div>
    );
}

const replaceItemAtIndex = (arr: todoListState[], index: number, newValue: any) => {
    // slice(x, y) = 配列または文字列の[x]番目以上[y]番目未満を切り出して新たな配列を生成する。
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

const removeItemAtIndex = (arr: todoListState[], index: number) => {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export default TodoList