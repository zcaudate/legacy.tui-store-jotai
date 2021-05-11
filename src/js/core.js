// js.core/capitalize
function capitalize(s){
  return (s[0]).toUpperCase() + (s).substr(1);
}

// js.core/decapitalize
function decapitalize(s){
  return (s[0]).toLowerCase() + (s).substr(1);
}

// js.core/typeString
function typeString(x){
  let name = typeof x;
  return (name == "object") ? (x ? x.constructor.name : name) : name;
}

// js.core/symbolString
function symbolString(sym){
  let s = (sym).toString();
  return (s).substring(7,(s).length - 1);
}

// js.core/isFn
function isFn(obj){
  return "function" == typeof (obj);
}

// js.core/isNumber
function isNumber(obj){
  return ("number" == typeof (obj)) || (obj instanceof Number);
}

// js.core/isString
function isString(obj){
  return ("string" == typeof (obj)) || (obj instanceof String);
}

// js.core/isBoolean
function isBoolean(obj){
  return ("boolean" == typeof (obj)) || (obj instanceof Boolean);
}

// js.core/isPlainObject
function isPlainObject(val){
  return typeString(val) == "Object";
}

// js.core/isPlainArray
function isPlainArray(val){
  return typeString(val) == "Array";
}

// js.core/isPlainContainer
function isPlainContainer(val){
  let ts = typeString(val);
  return (ts == "Object") || (ts == "Array");
}

// js.core/size
function size(obj){
  if((obj) == null){
    return 0;
  }
  else if(isFn(obj)){
    return 0;
  }
  else if(isPlainObject(obj)){
    return (Object.keys(obj)).length;
  }
  else{
    return obj["length"] || 0;
  }
}

// js.core/isEmpty
function isEmpty(obj){
  if((obj) == null){
    return true;
  }
  else if(isFn(obj)){
    return false;
  }
  else{
    let len = obj["length"];
    if(0 === (len)){
      return true;
    }
    else if(isPlainObject(obj)){
      return 0 === ((Object.keys(obj)).length);
    }
    else{
      return false;
    };
  }
}

// js.core/get
function get(obj,k){
  if(obj){
    return (obj[k]);
  }
}

// js.core/getIn
function getIn(obj,arr){
  if(obj && arr){
    return (arr).reduce(function (o,k){
      return o && o[k];
    },obj);
  }
}

// js.core/setIn
function setIn(obj,arr,v){
  if(isEmpty(arr)){
    return obj;
  }
  let acc = obj || {};
  (arr.slice(0,-1)).reduce(function (acc,k){
    if(!isPlainContainer((acc[k]))){
      acc[k] = {};
    }
    return (acc[k]);
  },acc)[(arr)[(arr).length - 1]] = v;
  return acc;
}

// js.core/keep
function keep(arr,f){
  return (arr || []).reduce(function (acc,e,i){
    let val = f(e,i);
    if((val) != null){
      (acc).push(val);
    }
    return acc;
  },[]);
}

// js.core/transpose
function transpose(obj){
  return (Object.entries(obj || {})).reduce(function (acc,[k,v]){
    acc[v] = k;
    return acc;
  },{});
}

// js.core/range
function range(n,end,step){
  if(step){
    return (Array.from(new Array(Math.ceil((end - n) / step)).keys())).map((i) => (i * step) + n);
  }
  else if(end){
    return (Array.from(new Array(end - n).keys())).map((i) => i + n);
  }
  else{
    return Array.from(new Array(n).keys());
  }
}

// js.core/delKeys
function delKeys(obj,ks){
  return keep(ks || Object.keys(obj || {}),function (k){
    if(delete obj[k]){
      return k;
    }
  });
}

// js.core/selectKeys
function selectKeys(obj,ks){
  return (ks || []).reduce(function (acc,k){
    acc[k] = (obj[k]);
    return acc;
  },{});
}

// js.core/mapVals
function mapVals(obj,f){
  return (Object.entries(obj || {})).reduce(function (acc,[k,v],i){
    acc[k] = f(v,k,i);
    return acc;
  },{});
}

// js.core/mapEntries
function mapEntries(obj,f){
  return Object.fromEntries((Object.entries(obj || {})).map(f));
}

// js.core/filterVals
function filterVals(obj,f){
  return (Object.entries(obj || {})).reduce(function (acc,[k,v],i){
    if(f(v,k,i)){
      acc[k] = v;
    }
    return acc;
  },{});
}

// js.core/keepVals
function keepVals(obj,f){
  return (Object.entries(obj || {})).reduce(function (acc,[k,v],i){
    let val = f(v,k,i);
    if(val){
      acc[k] = val;
    }
    return acc;
  },{});
}

// js.core/mapJuxt
function mapJuxt(arr,[kf,vf]){
  return Object.fromEntries((arr || []).map((e,i) => [kf(e,i),vf(e,i)]));
}

// js.core/groupBy
function groupBy(arr,f){
  return (arr || []).reduce(function (acc,e,i){
    let k = f(e,i);
    let arr = acc[k] || [];
    (arr).push(e);
    acc[k] = arr;
    return acc;
  },{});
}

// js.core/oneShot
function oneShot(f){
  let result;
  let flag = true;
  return function (...args){
    if(flag){
      result = (f).apply(null,args);
      flag = false;
    }
    return result;
  };
}

// js.core/memoizeKey
function memoizeKey(f){
  let cache = {};
  let cacheFn = function (key){
    let result = (f).apply(null,arguments);
    cache[key] = result;
    return result;
  };
  return function (key){
    return (cache[key]) || cacheFn(key);
  };
}

// js.core/isEqual
function isEqual(src,dst,cache){
  let top = !cache;
  if(!cache){
    cache = new Set();
  }
  let arrayFn = function (src,dst){
    return ((src).length == (dst).length) ? (range((src).length)).every((i) => isEqual((src[i]),(dst[i]),cache)) : false;
  };
  let objectFn = function (src,dst){
    let ksrc = Object.keys(src);
    let kdst = Object.keys(dst);
    return ((ksrc).length == (kdst).length) ? (ksrc).every((k) => isEqual((src[k]),(dst[k]),cache)) : false;
  };
  let lookup = {"Array":arrayFn,"Object":objectFn};
  let typeSrc = typeString(src);
  let typeDest = typeString(dst);
  if(typeSrc !== typeDest){
    return false;
  }
  let checkFn = (lookup[typeSrc]);
  if(!checkFn){
    return src === dst;
  }
  if(src === dst){
    return true;
  }
  if((cache).has(src) && (cache).has(dst)){
    return true;
  }
  (cache).add(src);
  (cache).add(dst);
  return checkFn(src,dst);
}

// js.core/shuffle
function shuffle(arr){
  let curr = (arr).length;
  let tmpVal;
  let tmpIdx;
  while(0 !== curr){
    tmpIdx = Math.floor(Math.random() * curr);
    curr = (curr - 1);
    tmpVal = (arr[curr]);
    arr[curr] = (arr[tmpIdx]);
    arr[tmpIdx] = tmpVal;
  }
  return arr;
}

// js.core/mergeNested
function mergeNested(...objs){
  return (objs).reduce(function (acc,obj){
    (Object.keys(obj || {})).forEach(function (k){
      let av = (acc[k]);
      let ov = (obj[k]);
      if(isPlainObject(av) && isPlainObject(ov)){
        acc[k] = mergeNested(av,ov);
      }
      else{
        acc[k] = ov;
      };
    });
    return acc;
  },{});
}

// js.core/cloneNested
function cloneNested(obj,cache){
  if(!cache){
    cache = new Map();
  }
  if(((obj) == null) || ("function" == typeof (obj)) || !"object" == typeof (obj)){
    return obj;
  }
  if((cache).has(obj)){
    return (cache).get(obj);
  }
  if(!isPlainObject(obj) && !isPlainArray(obj)){
    return obj;
  }
  let out = new obj.constructor();
  (cache).set(obj,out);
  return Object.assign(out,mapVals(obj,(v) => cloneNested(v,cache)));
}

// js.core/skeleton
function skeleton(obj,cache,path){
  if(!path){
    path = [];
  }
  if(!cache){
    cache = new Map();
  }
  if(((obj) == null) || ("function" == typeof (obj)) || isPlainArray(obj) || !isPlainObject(obj)){
    return typeString(obj);
  }
  if((cache).has(obj)){
    return ["<ref>",(cache).get(obj)];
  }
  (cache).set(obj,path);
  return mapEntries(obj,function ([k,v]){
    return [k,skeleton(v,cache,[...path,k])];
  });
}

// js.core/MODULE
const MODULE = {
  "capitalize":capitalize,
  "decapitalize":decapitalize,
  "typeString":typeString,
  "symbolString":symbolString,
  "isFn":isFn,
  "isNumber":isNumber,
  "isString":isString,
  "isBoolean":isBoolean,
  "isPlainObject":isPlainObject,
  "isPlainArray":isPlainArray,
  "isPlainContainer":isPlainContainer,
  "size":size,
  "isEmpty":isEmpty,
  "get":get,
  "getIn":getIn,
  "setIn":setIn,
  "keep":keep,
  "transpose":transpose,
  "range":range,
  "delKeys":delKeys,
  "selectKeys":selectKeys,
  "mapVals":mapVals,
  "mapEntries":mapEntries,
  "filterVals":filterVals,
  "keepVals":keepVals,
  "mapJuxt":mapJuxt,
  "groupBy":groupBy,
  "oneShot":oneShot,
  "memoizeKey":memoizeKey,
  "isEqual":isEqual,
  "shuffle":shuffle,
  "mergeNested":mergeNested,
  "cloneNested":cloneNested,
  "skeleton":skeleton
}

export default MODULE