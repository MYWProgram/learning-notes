# Typescript

## 高级类型

除了`基础类型、接口、类`等基础类型以外；其实`TS`提供了很多高级类型，用于简化类型定义的书写，另一方面方便`单声明，多拓展`的工具库开发

### 类型运算

#### 集合运算

`&`计算两个类型的交集

```TS
type Type1 = 'a' | 'b';
type Type2 = 'b' | 'c';
type Type3 = Type1 & Type2; // 'b'
```

`|`计算两个类型的并集

```TS
type Type4 = Type1 | Type2; // 'a' | 'b' | 'c'
```

#### 索引签名

用于定义`interface`中`key`的类型

```TS
interface Props {
  [key: string]: number;
}
```

#### 类型键入

可以像对象取值一样取得类型

```TS
type User = {
  userId: string;
  friendList: {
    name: string;
    age: number;
  }[]
};

type UserIdType = User['userId']; // string
type FriendList = User['friendList']; // { name: string; age: number; }[]
type Friend = FriendList[number]; // { name: string; age: number; }
// 元组中也可以通过字面量数字取得类型
type Tuple = [string, number];
const str: Tuple[0] = 'test';
const num: Tuple[1] = 0;
```

#### typeof value

推算一个变量的类型

```TS
let str1 = 'foo';
type Type1 = typeof str1; // string

const str2 = 'boo';
type Type2 = typeof str2; // 'boo'
```

`typeof`在计算变量和常量时有所不同，由于常量时不会变的，所以`Typescript`会使用严格的类型；而变量会是宽松的基础类型

#### keyof Type

获取一个对象类型的所有`key`类型

```TS
type User = {
  name: string;
  age: number;
};
type UserKeyType = keyof User; // string | number
```

`enum`枚举具有特殊性，如果需要获取其`key`类型，需要先`typeof`再`keyof`

```TS
enum ErrCode {
  online,
  outline
}

type ErrCodeType = keyof typeof ErrCode;

const errStatus: ErrCodeType = "online";
```

#### extends

在`interface`中表示类型扩展，在条件类型语句中表示布尔值运算，在泛型中起限制作用

```TS
// interface 扩展
interface AProps {
  a: string;
}
interface BProps extends AProps {
  b: number;
} // { a: string; b: number }

// 条件语句中布尔值运算
type Judge<T> = T extends string ? 'string' : never;
type A = Judge<number>; // never
type B = Judge<string>; // 'string'

// 类型限制
type Conflicate<T extends object> = T;
type A = Conflicate<number>; // 类型'number'不满足约束'object'
type B = Conflicate<string>; // 类型'string'不满足约束'object'
type C = Conflicate<{}>;
```

使得`A extends B`在布尔值运算和泛型限制中成立的条件是 A 是 B 的子集，也就是说 A 需要比 B 更具体，至少都要和 B 一样

```Ts
type K = '1' extends '1' | '2' ? 'true' : 'false'; // "true"
type L = '1' | '2' extends '1' ? 'true' : 'false'; // "false"

type M = { a: 1 } extends { a: 1, b: 1 } ? 'true' : 'false'; // "false"
type N = { a: 1, b: 1 } extends { a: 1 } ? 'true' : 'false'; // "true"
```

#### is

类型防护，告诉`TS`如何辨别类型

```TS
interface Fish {
  swim: () => {};
}
// pet is Fish 告诉 TS 如果函数运行结果返回 true 时，证明 pet 已经是验证过的 Fish 类型
function isFish(pet: any): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

let pet = {} as unknown;

if (isFish(pet)) {
  pet.swim(); // OK
} else {
  pet.swim(); // Object is of type 'unknown'
}
```

### 映射类型

#### Record

`Record`定义键类型为`Keys`、值类型为`Values`的对象类型

```TS
// 源码
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

```TS
type Type = {
  x: number;
  y: number;
  z: number;
};
// 索引签名 + 接口
interface Props {
  [key: string]: number
}
// 类型别名
type Type = Record<'x' | 'y' | 'z', number>;
```

>如果在一个对象中存在不同类型的各种值，该如何简写？

```TS
type LetterType = Record<'a' | 'b', string>;
type NumberType = Record<'x' | 'y', number>;
// 使用并集 + 类型别名的方式进行简写
type CombType = LetterType | NumberType;
// 为什么不像这样写？
type CombType = Record<'a' | 'b' | 'x' | 'y', string | number>;
```

>上面第一个代码块中，interface 和 type 的区别在哪？如何消除 interface 写法的弊端

#### in 关键字

在类型中表示类型映射，和索引签名的写法相似

```TS
// 使用 in + Type 解决上述问题
type Type = {
  [key in 'x' | 'y' | 'z']: number;
};
```

#### Partial

将类型定义的属性变成可选

```TS
// 源码
type Partial<T> = {
  [U in keyof T]?: T[U];
};
```

```TS
type UserPartA = {
  id: string;
  uuid: string;
};
type UserPartB = {
  name: string;
  age?: number;
};
// 修改
type UserEdit = UserPartA | UserPartB;
// 新增
type UserNew = Partial<UserPartA> | UserPartB;
```

#### Required

对象类型的属性都变成必须

```TS
// 源码
type Required<T> = {
  [U in keyof T]-?: T[U];
};
// -? 表示强制去掉可选符号，也存在 + 修饰符
```

```TS
type UserPartA = {
  id?: string;
  uuid?: string;
};
// 修改
type UserEditr = Required<UserPartA> | UserPartB;
```

#### Readonly

将对象类型的属性都变成只读

```TS
// 源码
type Readonly<T> = {
  readonly [U in keyof T]: T[U];
};
```

```TS
// JS 使用 const 声明对象，成员属性值可变？
type User = {
  name: string;
  age: number;
};
type RdonlyUser = Readonly<User>;
const user: ReadOnlyUser = {
  name: 'Daming',
  age: 18
}
user.age = 19; // Cannot assign to 'age' because it is a read-only property
```

#### Pick

挑选类型中的部分属性

```TS
// 源码
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

```TS
type Location = {
  province: string;
  city: string;
  lat: number;
  long: number;
}
type LatLong = Pick<Location, 'lat' | 'long'>; // { lat: number; long: number; }
```

#### Omit

结合了`Pick`和`Exclude`，会忽略对象类型中的部分`key`

```TS
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

```TS
type LatLong = Omit<Location, 'province' | 'city'>; // { lat: number; long: number; }
```
