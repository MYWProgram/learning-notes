# 名词解释:

1. 时间复杂度指的是一个算法执行所耗费的时间
2. 空间复杂度指运行完一个程序所需内存的大小
3. 'in-space'占用常数内存不占用额外内存;'out-space'占用额外内存
4. 是否稳定: 如果 a=b,a 在 b 的前面,排序后 a 仍然在 b 的前面则稳定;反之不稳定
5. 'n': 数据规模; 'k': 桶的个数

![算法相关概念](https://tva1.sinaimg.cn/large/00831rSTgy1gcz4lq7o3sj30qu0gcjvp.jpg)

## 冒泡排序

- 原理

  1. 比较相邻的元素,如果前者大于后者,就交换它们两个的位置
  2. 对每一对相邻元素作同样的工作,从开始第一对到结尾的最后一对,这样在最后的元素应该会是最大的数
  3. 针对所有的元素重复以上的步骤,除了最后一个
  4. 重复步骤 1~3,直到排序完成

- 代码

```js
function bubbleSort(arr) {
  // 外层循环控制循环次数
  for (var i = 0; i < arr.length; i++) {
    // 内层循环控制数组内成员的'index'
    for (var j = 0; j < arr.length - 1; j++) {
      // 比较相邻的两个数
      if (arr[j + 1] < arr[j]) {
        // 把更小的那个数放在前面的一个位置
        var tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
}
```

- 改进后的冒泡排序

  设置一标志性变量`pos`,用于记录每趟排序中最后一次进行交换的位置;由于`pos`位置之后的记录均已交换到位,故在进行下一趟排序时只要扫描到`pos`位置即可;这样减少了不必要的循环

```js
function bubbleSort(arr) {
  // 没开始排序时,最后位置保持不变
  var i = arr.length - 1;
  while (i > 0) {
    // 每一次开始比较时,没有交换记录
    var pos = 0;
    for (var j = 0; j < i; j++) {
      if (arr[j + 1] < arr[j]) {
        // 记录交换的位置
        pos = j;
        var tmp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = tmp;
      }
    }
    // 为下一次排序做准备,直接从记录位置开始排序
    i = pos;
  }
  return arr;
}
```

- 再次优化

  在每趟排序中进行正向和反向两遍冒泡的方法,一次可以得到两个最值(最大值和最小值),从而使排序趟数几乎减少了一半

```js
function bubbleSort(arr) {
  // 设置变量的初始值
  var low = 0;
  var high = arr.length - 1;
  while (high > low) {
    // 正向冒泡,找到最大值
    for (var i = low; i < high; i++) {
      if (arr[i] > arr[i + 1]) {
        var tmp = arr[i + 1];
        arr[i + 1] = arr[i];
        arr[i] = tmp;
      }
    }
    // 修改索引的位置,最后一个位置前移一位(第一次循环之后数组最大值已找到)
    --high;
    // 反向冒泡,找到最小值
    for (var j = high; j > low; j--) {
      if (arr[j] < arr[j - 1]) {
        var tmp = arr[j - 1];
        arr[j - 1] = arr[j];
        arr[j] = tmp;
      }
    }
    // 修改索引位置,第一个位置后移一位(第一次循环之后数组最小值已找到)
    ++low;
  }
  return arr;
}
```

## 选择排序

- 原理

  1. 首先从原始数组中找到最小的元素,并把该元素放在数组的最前面
  2. 然后再从剩下的元素中寻找最小的元素,放在之前最小元素的后面
  3. 针对剩下的元素重复以上步骤除了最后一个元素

- 代码

```js
function selectSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    // 假设当前'i'就是数组最小数的索引minIndex
    var minIndex = i;
    for (var j = i + 1; j < arr.length; j++) {
      // 将索引为'minIndex'的数和其后面一个数做比较
      // 此时i = minIndex
      if (arr[j] < arr[minIndex]) {
        // 如果后面那个数小于索引为'minIndex'的数
        // 改变最小索引为'j'
        minIndex = j;
      }
    }
    // 最后再更换两个数的位置
    // 此时更换之前minIndex = j
    var tmp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = tmp;
  }
  return arr;
}
```

## 快速排序

- 原理

  1. 从数组中选定一个基数(pivot)
  2. 把数组中的每一项与此基数做比较,小的放入一个新数组,大的放入另外一个新数组
  3. 再采用这样的方法操作两个新数组(递归);直到所有子集只剩下一个元素,排序完成

- 代码

```js
function fastSort(arr) {
  // 开头设置判断,数组成员为一个时返回数组
  // 为最后递归左右区间数组,防止死循环做准备
  if (arr.length < 2) {
    return arr;
  }
  // 定义一个中值的索引并通过索引取到中值
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  // 分别定义左右区间数组来存放小于和大于中值的数
  var leftArr = [];
  var rightArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }
  // 递归方法对左右中值数组进行再次快排序
  return fastSort(leftArr).concat([pivot], fastSort(rightArr));
}
```

## 插入排序

- 原理

  1. 从第一个元素开始,该元素可以认为已经被排序
  2. 取出下一个元素,在已经排序的元素序列中从后向前扫描
  3. 如果该元素(已排序)大于新元素,将该元素移到下一位置
  4. 重复步骤 3,直到找到已排序的元素小于或者等于新元素的位置
  5. 将新元素插入到该位置后
  6. 重复步骤 2~5

- 代码

```js
function insertionSort(arr) {
  // 设定'i = 1',默认数组索引为'0'的第一个数已排序
  for (var i = 1; i < arr.length; i++) {
    // 声明一个'key'来保存当前要进行比较的新元素
    var key = arr[i];
    var j = i - 1;
    // 用新元素和前面已经排序的元素(从后向前)进行大小比较
    while (j >= 0 && arr[j] > key) {
      // 已排序数组成员比需要排序成员大的时候,就将已排序成员向后移动一位
      arr[j + 1] = arr[j];
      // 索引前移,为继续比较大小操作做准备
      j--;
    }
    // 比较完毕
    // 找到合适的位置插入需要进行排序的成员
    arr[j + 1] = key;
  }
  return arr;
}
```

- 优化之后的插入排序

  查找插入位置时使用二分查找的方式

```js
function insertionSort(arr) {
  // 设定'i = 1',默认数组索引为'0'的第一个数已排序
  for (var i = 1; i < arr.length; i++) {
    // 声明一个'key'来保存要进行比较的新元素
    var key = arr[i];
    // 定义一个区间,默认这个区间已经排序,并且区间的右边界索引小于新元素的索引
    var left = 0;
    var right = i - 1;
    while (left <= right) {
      // 二分法取到区间中值
      var middle = parseInt((left + right) / 2);
      // 比较新元素和区间中值的大小(从而进行中值的不断缩小找到新元素适合的位置)
      if (key < arr[middle]) {
        // 新元素小于中值时,右边界移动到中值前一位
        right = middle - 1;
      } else {
        // 新元素大于中值时,左边界移动到中值后一位
        left = middle + 1;
      }
    }
    // 不断对新元素之前区间进行排序
    for (var j = i - 1; j >= left; j--) {
      var tmp = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = tmp;
    }
  }
  return arr;
}
```

## 希尔排序

- 原理

  1. 选择一个增量序列 t1,t2,…,tk;其中 ti>tj,tk=1
  2. 按增量序列个数 k,对序列进行 k 趟排序
  3. 每趟排序,根据对应的增量 ti,将待排序列分割成若干长度为 m 的子序列,分别对各子表进行直接插入排序;仅增量因子为 1 时,整个序列作为一个表来处理,表长度即为整个序列的长度

- 动态计算间隔序列(shellsort()函数)

```js
// 数组长度
var len = this.dataStore.length;
// 初始间隔
var gap = 1;
// 动态设置
while (gap < len / 3) {
  gap = 3 * gap + 1;
}

// 回到外循环之前的最后一条语句会计算一个新的间隔值
gap = (gap - 1) / 3;
```

- 代码

```js
function shellSort(arr) {
  // 获取数组长度并初始化间隔值
  var len = arr.length,
    gap = 1;
  // 用公式动态求间隔值
  while (gap < len / 5) {
    gap = gap * 5 + 1;
  }
  while (gap >= 0) {
    for (var i = 0; i < len; i++) {
      // 插入排序(对以间隔值为区分的数组成员排序)
      for (var j = i; j >= gap && arr[j] < arr[j - gap]; j -= gap) {
        var tmp = arr[j];
        arr[j] = arr[j - gap];
        arr[j - gap] = tmp;
      }
    }
    // 初始化间隔值,为下一次动态求间隔值做准备
    gap = (gap - 1) / 5;
  }
  return arr;
}
```

## 归并排序

- 原理

  1. 把长度为 n 的输入序列分成两个长度为 n/2 的子序列
  2. 对这两个子序列分别采用归并排序
  3. 将两个排序好的子序列合并成一个最终的排序序列

- 代码

```js
function mergeSort(arr) {
  // 判断数组长度防止死循环
  if (arr.length < 2) {
    return arr;
  }
  // 数组基本等分为左右两个数组
  var middle = Math.floor(arr.length / 2);
  var left = arr.slice(0, middle);
  var right = arr.slice(middle);
  // 递归不断等分数组并且不断排序
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  // 声明一个空数组来接收排序后的左右数组
  var result = [];
  // 判空操作
  while (left.length && right.length) {
    // 左数组第一个成员小于右数组第一个成员时,取出左数组第一个成员添加到空数组
    if (left[0] <= right[0]) {
      result.push(left.shift());
    }
    // 反之添加右数组第一个成员到空数组
    else {
      result.push(right.shift());
    }
  }
  // 只要左右数组还有成员,就进行添加,知道全部成员添加到空数组为止(也为下一次等分数组做准备: 保证不漏掉一个成员)
  while (left.length) {
    result.push(left.shift());
  }
  while (right.length) {
    result.push(right.shift());
  }
  return result;
}
```

## 堆排序

- 堆的定义与相关知识
  1. 堆是一个完全二叉树
  2. 完全二叉树: 二叉树除开最后一层,其他层结点数都达到最大,最后一层的所有结点都集中在左边(左边结点排列满的情况下,右边才能缺失结点)
  3. 大顶堆: 根结点为最大值,每个结点的值大于或等于其孩子结点的值
  4. 小顶堆: 根结点为最小值,每个结点的值小于或等于其孩子结点的值
  5. 对于某一节点'i',其子节点为'2i+1'与'2i+2'
  6. 堆的存储: 堆由数组来实现,相当于对二叉树做层序遍历。如下图:

![大项堆](https://segmentfault.com/img/bVbc809?w=416&h=361)
![对应数组](https://segmentfault.com/img/bVbc81e?w=700&h=116)

- 原理

  1. 一种利用堆的概念来排序的选择排序
  2. 将初始二叉树转化为大顶堆(heapify)(实质是从第一个非叶子结点开始,从下至上,从右至左,对每一个非叶子结点做 shiftDown 操作),此时根结点为最大值,将其与最后一个结点交换
  3. 除开最后一个结点,将其余节点组成的新堆转化为大顶堆(实质上是对根节点做 shiftDown 操作),此时根结点为次最大值,将其与最后一个结点交换
  4. 重复步骤 3,直到堆中元素个数为 1(或其对应数组的长度为 1),排序完成

- 代码

```js
/**
 * @param x 数组下标
 * @param len 堆大小
 */
function heapify(arr, x, len) {
  // 声明当前节点为'i'的两个子节点;声明最大下标为数组当前某成员下标
  var l = 2 * x + 1,
    r = 2 * x + 2,
    largest = x;
  // 判断那个子节点更大,对应更换最大下标
  if (l < len && arr[l] > arr[largest]) {
    largest = l;
  }
  if (r < len && arr[r] > arr[largest]) {
    largest = r;
  }
  // 交换下标为largest的成员到当前节点
  if (largest !== x) {
    var tmp = arr[x];
    arr[x] = arr[largest];
    arr[largest] = tmp;
    // 递归这个操作,确保当前节点是最大值
    heapify(arr, largest, len);
  }
}

function heapSort(arr) {
  var heapSize = arr.length;
  // 初始化这个堆找到一个节点
  for (var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
    heapify(arr, i, heapSize);
  }
  // 找到当前节点的最大值之后进行首尾交换(经过多次递归之后最大值就到了最后)
  for (var j = heapSize - 1; j >= 1; j--) {
    var tmp = arr[0];
    arr[0] = arr[j];
    arr[j] = tmp;
    heapify(arr, 0, --heapSize);
  }
  return arr;
}
```

## 计数排序

- 原理

  1. 找出待排序的数组中最大和最小的元素
  2. 统计数组中每个值为 i 的元素出现的次数,存入数组 C 的第 i 项
  3. 对所有的计数累加(从 C 中的第一个元素开始,每一项和前一项相加)
  4. 反向填充目标数组: 将每个元素 i 放在新数组的第 C(i)项,每放一个元素就将 C(i)减去 1

- 代码

```js
function countingSort(arr) {
  // 声明用来存放排序后的数组B,以及计数的数组C
  // 声明最大最小值默认为数组第一个成员
  var B = [],
    C = [],
    len = arr.length,
    min = (max = arr[0]);
  // 找到最小和最大值
  for (var i = 0; i < len; i++) {
    min = min <= arr[i] ? min : arr[i];
    max = max >= arr[i] ? max : arr[i];
    // 统计需排序数组中每一个成员出现的次数,并用当前值作为下标添加到C数组中
    C[arr[i]] = C[arr[i]] ? C[arr[i]] + 1 : 1;
  }
  // 把C数组中所有成员进行累加(每一项和前一项相加)
  for (var j = min; j < max; j++) {
    C[j + 1] = (C[j + 1] || 0) + (C[j] || 0);
  }
  // 用C数组的下标对B数组进行反向填充
  for (var k = len - 1; k >= 0; k--) {
    B[C[arr[k]] - 1] = arr[k];
    C[arr[k]]--;
  }
  return B;
}
```

## 桶排序

- 原理

  1. 设置一个定量的数组当作空桶
  2. 遍历输入数据,并且把数据一个一个放到对应的桶里去
  3. 对每个不是空的桶进行排序
  4. 从不是空的桶里把排好序的数据拼接起来

- 公式

  假设桶的数量为`n`,数组中最大值为`max`,最小值为`min`

  1. 桶的范围: `space=(max-min+1)/n`
  2. 数组成员对应桶的范围: `floor((arr[i]-min)/space)`

- 代码

```js
const bucketSort = (arr, num) => {
  // 判断数组长度
  if (arr.length < 2) {
    return arr;
  }
  let l = arr.length,
    buckets = [],
    result = [],
    min = (max = arr[0]),
    space,
    n = 0;
  // 找出数组的最大值和最小值
  for (let i = 1; i < l; i++) {
    min = min <= arr[i] ? min : arr[i];
    max = max >= arr[i] ? max : arr[i];
  }
  // 声明步长并计算这个量
  space = (max - min + 1) / num;
  for (let j = 0; j < l; j++) {
    // 找到数组中每个元素放在桶中之后的序号
    let index = Math.floor((arr[j] - min) / space);
    // 对当前桶进行判空,不为空就进行插入排序
    if (buckets[index]) {
      let k = buckets[index].length - 1;
      while (k >= 0 && buckets[index][k] > arr[j]) {
        buckets[index][k + 1] = buckets[index][k];
        k--;
      }
      buckets[index][k + 1] = arr[j];
    }
    // 为空就初始化该桶
    else {
      buckets[index] = [];
      buckets[index].push(arr[j]);
    }
  }
  // 合并每一个桶,数组排序完成
  while (n < num) {
    result = result.concat(buckets[n]);
    n++;
  }
  return result;
};
```

## 基数排序

- 原理

  1. 取得数组中的最大数,并取得位数
  2. arr 为原始数组,从最低位开始取每个位组成 radix 数组
  3. 对 radix 进行计数排序(利用计数排序适用于小范围数的特点)

- 代码

```js
// 'maxDigit'为数组中最大成员的位数
const radixSort = (arr, maxDigit) => {
  let mod = 10,
    dev = 1,
    counter = [];
  for (let i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
    for (let j = 0; j < arr.length; j++) {
      // 对数组中每一个成员进行取个位的操作赋值给'bucket'变量
      let bucket = parseInt((arr[j] % mod) / dev);
      // 'bucket'可能的值有0-9,也可能缺少0-9的某个值
      // 所以要进行判空操作,当缺少某个值时让对应'bucket'下标的'counter'数组为空占位
      if (counter[bucket] === undefined) {
        counter[bucket] = [];
      }
      // 将'bucket'变量的值插入对应的'counter[bucket]'尾部
      counter[bucket].push(arr[j]);
    }
    // 把'counter[bucket]容器里的数依次取出'
    let pos = 0;
    for (let j = 0; j < counter.length; j++) {
      let value;
      if (counter[j] !== undefined) {
        while ((value = counter[j].shift()) !== undefined) {
          arr[pos++] = value;
        }
      }
    }
  }
  return arr;
};
```

### 参考链接

- [前端常见算法的JS实现](https://segmentfault.com/a/1190000008593715)
- [十大经典排序算法总结](https://juejin.im/post/57dcd394a22b9d00610c5ec8)