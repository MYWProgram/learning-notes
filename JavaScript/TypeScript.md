# Typescript

## 高级类型

除了`基础类型、接口、类`等基础用法以外；`TS`还提供了很多高级类型，一方面用于简化类型定义的书写，另一方面方便`单声明，多拓展`的工具库开发

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
  }[];
};

type UserIdType = User['userId']; // string
type FriendList = User['friendList']; // { name: string; age: number; }[]
type Friend = FriendList[number]; // { name: string; age: number; }
```

`Tuple`中也可以通过字面量数字取得类型

```TS
type Tuple = [string, number];
const str: Tuple[0] = 'test';
const num: Tuple[1] = 0;
```

`Tuple`和`Array`的区别在哪？

#### typeof value

推算一个变量的类型

```TS
let str1 = 'foo';
type Type1 = typeof str1; // string

const str2 = 'boo';
type Type2 = typeof str2; // 'boo'
```

`typeof`在推算变量和常量时有所不同，由于常量是不会变的，所以`Typescript`会使用严格的类型；而变量会是宽松的基础类型

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

使得`A extends B`在布尔值运算和泛型限制中成立的条件是`A`是`B`的子集，也就是说`A`需要比`B`更具体，至少都要和`B`一样

```Ts
type K = '1' extends '1' | '2' ? 'true' : 'false'; // "true"
type L = '1' | '2' extends '1' ? 'true' : 'false'; // "false"
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

`Record`定义键类型为`Keys`、值类型为`Value`的对象类型

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
// 索引签名
interface Props {
  [key: string]: number
}
// 类型别名
type Type = Record<'x' | 'y' | 'z', number>;
```

思考上述`interface`和`type`两种写法优劣？

如果在一个对象中存在不同类型的各种值，该如何简写？

```TS
type LetterType = Record<'a' | 'b', string>;
type NumberType = Record<'x' | 'y', number>;
// 使用并集 + 类型别名的方式进行简写
type CombType = LetterType | NumberType;
```

为什么不像这样写？

```TS
type CombType = Record<'a' | 'b' | 'x' | 'y', string | number>;
```

#### in 关键字

在类型中表示类型映射，和索引签名的写法相似

```TS
// 使用 in + Type 解决上述问题
type Type = {
  [key in 'x' | 'y' | 'z']: number;
};
```

与索引签名相比，有什么优点？

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
  username: string;
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
type ReadOnlyUser = Readonly<User>;
const user: ReadOnlyUser = {
  name: 'Daming',
  age: 18
}
user.age = 19; // Cannot assign to 'age' because it is a read-only property
```

#### Mutable

将类型的属性变成可修改

```TS
// 源码
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
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

### 条件类型

#### 三目运算符

通常与`泛型`一起出现，通过`extends`关键字判断条件是否成立

```TS
type IsString<T> = T extends string ? true : false;
const a = 'a';
const bool: IsString<typeof a> = true;
```

#### infer

动态推导泛型，常用于需要通过传入的泛型参数去获取新的类型

```TS
type ApiResponse<T> = {
  code: number;
  data: T;
};
type UserResponse = ApiResponse<{
  id: string;
  name: string;
  age: number;
}>;
type ArticleResponse = ApiResponse<{
  id: string;
  title: string;
  content: string;
}>;
```

上述情况建立在已知回参类型的情况下，如果是多项目或者微前端，`UserResponse`和`ArticleResponse`都由别的项目提供，我们进行导入并使用，此时可以使用`infer`来推断这两个类型

```TS
type ApiResponseEntity<T> = T extends ApiResponse<infer U> ? U : never;
type User = ApiResponseEntity<UserResponse>;
type Article = ApiResponseEntity<ArticleResponse>;
```

#### ReturnType

用于获取方法的返回值类型

```TS
// 源码
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

```TS
type A = (a: string) => number;
type B = ReturnType<A>;
// react
import { useDrag } from 'Utils/CustomHooks';
const getDragProps: ReturnType<typeof useDrag> = useDrag();
```

#### Parameters

获取方法的参数类型

```TS
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

获取一些原生或者没有`TS`定义的类型，包括一些第三方库使用类型书写但是没有提供导出的类型

```TS
type EventListenerParamsType = Parameters<typeof window.addEventListener>;
// [type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined]
```

#### Exclude

计算在`T`中而不在`U`中的类型

```TS
// 源码
type Exclude<T, U> = T extends U ? never : T;
```

```TS
type A = number | string;
type B = string;
type C = Exclude<A, B>; // number
```

#### Extract

计算`T`中可以赋值给`U`的类型

```TS
// 源码
type Extract<T, U> = T extends U ? T : never;
```

```TS
type A = number | string;
type B = string;
type C = Extract<A, B>; // string
```

#### NonNullable

从类型中排除`null`和`undefined`

```TS
// 源码
type NonNullable<T> = T extends null | undefined ? never : T;
```

简化一些经常会变动的接口定义，比如某个参数一开始可以为 null，后面变动只能为确定的基础类型

```TS
type A = {
  a?: number | null;
};
type B = NonNullable(A['a']); // number
```

## 泛型进阶

泛型是一种抽象类型，区别于平时我们对`值`进行编程，泛型是对`类型`进行编程

### 泛型约束

假设我们有一个`trace`函数用于调试程序

```TS
function trace<T>(arg: T): T {
  console.log(arg);
  return arg;
}
```

此时我们想要打印参数中的某个属性，但是我们不对`T`做任何约束

```TS
function trace<T>(arg: T): T {
  console.log(arg.size); // Error: Property 'size doesn't exist on type 'T'
  return arg;
}
```

由于上面的`T`可以是任何类型，但是不同于`any`，所以这样使用会报错；解决方法就是定义一个类型，然后使用`T`实现这个接口

```TS
interface Sizeable {
  size: number;
}
function trace<T extends Sizeable>(arg: T): T {
  console.log(arg.size);
  return arg;
}
```

### 嵌套函数

已知`Reverse`为反转参数列表功能，`CutHead`为去掉数组第一项

```TS
type CutTail<Tuple extends any[]> = Reverse<CutHead<Reverse<Tuple>>>;
```

那么`CutTail`就是将传递进来的参数列表反转，切掉第一个参数，然后反转回来；也就是说去掉参数的最后一项

### 递归

```TS
// HTMLElement 的定义
declare var HTMLElement: {
  prototype: HTMLElement;
  new(): HTMLElement;
};
// 递归可选
type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type PartialedWindow = DeepPartial<Window>; // 现在 window 上所有属性都变成了可选
```

## inject

[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

[如何在 Vue + TS 中使用 Provide/Inject](https://www.coder.work/article/1332213)
