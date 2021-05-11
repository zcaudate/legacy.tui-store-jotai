import React from 'react'
import * as jotai from 'jotai'
import * as jotaiUtils from 'jotai/utils'
import nodeUtil from 'util'

import b from './js/blessed'

// play.tui-store-basic.main/FlagPos
const FlagPos = jotai.atom(true)

// play.tui-store-basic.main/FlagNeg
const FlagNeg = jotai.atom((get) => !get(FlagPos))

// play.tui-store-basic.main/App
function App(props){
  let [pressed,setPressed] = React.useState(false);
  let [pos,setPos] = jotai.useAtom(FlagPos);
  let [npos] = jotai.useAtom(FlagNeg);
  return (
    <box width={30}
      left={10}
      top={10}><button mouse={true}
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
        content={"\n" + "  " + (pressed ? "ON" : "OFF") + "\n" + "\n  " + nodeUtil.inspect({npos,pos},{"colors":true})}></button></box>
    );
}

// play.tui-store-basic.main/__init__
b.run((
  <App></App>
  ),"JS Blessed Store Test");