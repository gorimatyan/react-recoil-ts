import React from 'react'
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue, useSetRecoilState, SetterOrUpdater, } from 'recoil';

// アトムの型定義
type todoListState = {
    text: string;
    isComplete: boolean;
    id: number | null | undefined;
    key: string,
    default: string[] 
}
// アトムの追加
export const todoListState = atom<todoListState[]>({
    key: 'TodoList',
    default: [],
});

export const textState = atom({
    key: 'textState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
  });





const AtomFamily = () => {
  return (
    <div>AtomFamily</div>
  )
}

export default AtomFamily