import React, { Key, useState } from 'react'
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue, useSetRecoilState, SetterOrUpdater, } from 'recoil';
import { todoListState } from '../AtomFamily';

// 1、アトムファミリーにアトムを追加する------------------------------------------------------------------------------
// アトムの型定義
type todoListState = {
    text: string;
    isComplete: boolean;
    id: number | null | undefined;
    key: string,
    default: string[] 
}


const TodoList: React.FC = () => {
    // 2、アトムファミリーからアトムの値(Value)を読み込む
    const todoList = useRecoilValue(todoListState);

    return (
        <>
            {/* <TodoListStats /> */}
            {/* <TodoListFilters /> */}
            <TodoItemCreator />

            {/* map関数でtodoListアトムをtodoItemとしてひとつずつ展開し、keyにid、itemにtodoItemをpropsとしてTodoItemコンポーネントに渡す */}
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

    // Inputの中身を動的に変える処理。
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    
    const addItem = () => {
        // 配列に追加する典型的な処理。これは覚えとこう。
        setTodoList((oldTodoList: todoListState[]) => [
            ...oldTodoList,
            {
                id: getId(),
                text: inputValue,
                isComplete: false,
            },
        ]);
        setInputValue('');
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={(e) => onChange(e)} />
            <button onClick={addItem}>Add</button>
        </div>
    );
}

// utility for creating unique Id
let id = 0;
function getId() {
    return id++;
}


// TodoListからひとつひとつ取り出したやつ(TodoItem)のコンポーネント
type Props = {
    item: todoListState
}
const TodoItem: React.FC<Props> = (props) => {
    // 4、Atomの変数と更新関数を同時に取得
    const [todoList, setTodoList] = useRecoilState(todoListState);

    // findIndexでtodoListからひとつずつlistItemとして取り出す。
    // indexには登録済みのtodoList配列の要素数(todoの数)が返ってくる。
    const index: number = todoList.findIndex((listItem) => listItem === props.item);
    console.log(index);

    const editItemText = (e:  React.ChangeEvent<HTMLInputElement>) => {
        const newList: todoListState[] = replaceItemAtIndex(todoList, index, {
            ...props.item,
            text: e.target.value,
        });
        console.log(props.item);
        console.log(newList);
        setTodoList(newList);
    };

    const toggleItemCompletion = () => {
        const newList: todoListState[] = replaceItemAtIndex(todoList, index, {
            ...props.item,
            isComplete: !props.item.isComplete,
        });

        setTodoList(newList);
    };

    const deleteItem = () => {
        const newList: todoListState[] = removeItemAtIndex(todoList, index);

        setTodoList(newList);
    };

    return (
        <div>
            <input type="text" value={props.item.text} onChange={(e) => editItemText(e)} />
            <input
                type="checkbox"
                checked={props.item.isComplete}
                onChange={toggleItemCompletion}
            />
            <button onClick={deleteItem}>X</button>
        </div>
    );
}

const replaceItemAtIndex = (arr: todoListState[], index: number, newValue: todoListState) => {
    // slice(x, y) = 配列または文字列の[x]番目以上[y]番目未満を切り出して新たな配列を生成する。
    // sliceでindex以外のtodoをあとから合体させている
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
    // index = 4 arr = [0,1,2,3,4,5]
    // ...[...arr.slice(0, index) = [0,1,2,3], newValue, ...arr.slice(index + 1) = [5]];
    // return [0,1,2,3,newValue,5]
}

const removeItemAtIndex = (arr: todoListState[], index: number) => {
    
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
    // index = 4 arr = [0,1,2,3,4,5]
    // ...[...arr.slice(0, index) = [0,1,2,3], ...arr.slice(index + 1) = [5]];
    // return [0,1,2,3,4]
}

export default TodoList