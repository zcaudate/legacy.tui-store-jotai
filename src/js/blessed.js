import blessed from 'blessed'
import reactBlessed from 'react-blessed'

// js.blessed/createScreen
function createScreen(title,options){
  const s = blessed.screen(Object.assign({
    "smartCSR":true,
    "dockBorders":true,
    "autoPadding":true,
    "cursor":{
        "artificial":true,
        "shape":{"bg":"yellow","fg":"white","bold":true},
        "blink":true
      },
    "debug":true,
    "title":title,
    "sendFocus":true,
    "useBCE":true,
    "grabKeys":true
  },options));
  s.key(["q","C-c","Esc"],function (){
    this.destroy();
  });
  return s;
}

// js.blessed/run
function run(element,title,options){
  reactBlessed.render(element,createScreen(title,options));
}

// js.blessed/MODULE
const MODULE = {"createScreen":createScreen,"run":run}

export default MODULE