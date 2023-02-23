function deepCopy(target, hash = new WeakSet()) {
  if (typeof target !== "object" || target === null) return target;

  // 判断目标的引用是否存在hash之中，避免循环引用
  // 初次执行hash为空，不会走这个判断
  if (hash.has(target)) return target;

  let result = {};

  // 循环处理目标中属性值的类型，做不同形式的赋值拷贝
  for (const key in target) {
    const currentValue = target[key];

    // 基础数据类型、函数直接赋值拷贝
    if (typeof currentValue !== "object" || currentValue === null) {
      result[key] = currentValue;
    } else if (Array.isArray(currentValue)) {
      result[key] = currentValue.map(item => deepCopy(item, hash));
    } else if (currentValue instanceof Set) {
      let newSet = new Set();
      currentValue.forEach(item => newSet.add(deepCopy(item)));
      result[key] = newSet;
    } else if (currentValue instanceof Map) {
      let newMap = new Map();
      currentValue.forEach((itemValue, itemKey) => newMap.set(itemKey, deepCopy(itemValue, hash)));
      result[key] = newMap;
    } else {
      // 如果目标当前属性为对象，将目标作为键名、键值存入hash中
      hash.add(target);
      // 递归调用函数，传入目标当前属性和存储了上一次目标为引用的WeakMap
      // 如果因为循环引用产生了闭环,那么由于这两个引用是指向相同的对象,就会进入上面if (hash.has(target))的判断.从而return退出函数,防止栈溢出
      result[key] = deepCopy(currentValue, hash);
    }
  }

  return result;
}

// 测试用例
const person = {
  name: "xxx",
  age: 18,
  hobby: ["swim", "running"],
  fruit: new Set(["apple", "orange"]),
  gf: new Map([
    ["A", "Lily"],
    ["B", "Mary"]
  ]),
  father: undefined,
  mother: null,
  getFather: () => {
    return this.father;
  }
};

person.cycle = person;

const DaMing = deepCopy(person);
