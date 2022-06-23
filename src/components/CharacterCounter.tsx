import React from 'react'
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';

const textState = atom({
    key: 'textState', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
  });

const CharacterCounter: React.FC = () => {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  );
}

const TextInput = () => {
    //アトムへの書き込み＆読み取りが必要なコンポーネントでuseRecoilState()を使う
    const [text, setText] = useRecoilState(textState);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };
    return (
        <div>
            <input type="text" value={text} onChange={(e) => onChange(e)} />
            <br />
            {/* ↓ アトムの読み取りはuseRecoilStateを使っておけばuseStateみたいに読み取りができる */}
            Echo: {text}
        </div>
    );
}

    // セレクターの設定（アトムにあるstateの文字数を返すセレクター）
const charCountState = selector({
    key: 'charCountState', // unique ID (with respect to other atoms/selectors)
    get: ({ get }) => {
        const text = get(textState);

        return text.length;
    },
});

const CharacterCount = () => {
    const count = useRecoilValue(charCountState);

    return <>Character Count: {count}</>;
}
export default CharacterCounter