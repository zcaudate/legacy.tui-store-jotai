import nodeUtil from 'util'
import React from 'react'
import * as jotai from 'jotai'
import * as jotaiUtils from 'jotai/utils'

import b from './js/blessed'

// play.tui-store-basic.main/FlagPos
const FlagPos = jotai.atom(true)

// play.tui-store-basic.main/FlagNeg
const FlagNeg = jotai.atom(function (get){
  return !get(FlagPos);
})

// play.tui-store-basic.main/Button
function Button(props){
  let [pressed,setPressed] = React.useState(false);
  let [pos,setPos] = jotai.useAtom(FlagPos);
  let [npos] = jotai.useAtom(FlagNeg);
  return (
    <button mouse={true}
      style={{"bg":"black","hover":{"bg":"red"}}}
      width={30}
      height={5}
      onMouse={function (e){
        if(e.button == "left"){
          if((e.action == "mouseup")){
            setPressed(false);
          }
          else{
            setPressed(true);
          }
        }
      }}
      onClick={() => setPos(!pos)}
      content={"\n" + "  " + props.id + " - " + (pressed ? "ON" : "OFF") + "\n" + "\n  " + nodeUtil.inspect({npos,pos},{"colors":true})}></button>
    );
}

// play.tui-store-basic.main/App
function App(props){
  return (
    <box><box left={4}
        top={6}><jotai.Provider><Button id="context 1"></Button></jotai.Provider></box>
      <box left={4}
        top={12}><jotai.Provider><Button id="context 2"></Button></jotai.Provider></box>
      <box left={4}
        top={18}><Button id="global 1"></Button></box>
      <box left={4}
        top={24}><Button id="global 2"></Button></box></box>
    );
}

// play.tui-store-basic.main/__init__
b.run((
  <App></App>
  ),"JS Blessed Store Test");