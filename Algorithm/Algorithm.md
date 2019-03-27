# 算法

## 目录

1. [排序](#排序)

## 排序

[返回目录](#目录)

1. [冒泡排序](#冒泡排序)
2. [选择排序](#选择排序)
3. [快速排序](#快速排序)
4. [插入排序](#插入排序)

名词解释:

  1. 时间复杂度指的是一个算法执行所耗费的时间
  2. 空间复杂度指运行完一个程序所需内存的大小
  3. 'in-space'占用常数内存不占用额外内存;'out-space'占用额外内存
  4. 是否稳定: 如果a=b,a在b的前面,排序后a仍然在b的前面则稳定;反之不稳定
  5. 'n': 数据规模; 'k': 桶的个数

![图片解释](https://user-gold-cdn.xitu.io/2016/11/29/4abde1748817d7f35f2bf8b6a058aa40?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 冒泡排序

- 原理
  1. 比较相邻的元素,如果前者大于后者,就交换它们两个的位置
  2. 对每一对相邻元素作同样的工作,从开始第一对到结尾的最后一对,这样在最后的元素应该会是最大的数
  3. 针对所有的元素重复以上的步骤,除了最后一个
  4. 重复步骤1~3,直到排序完成

- 代码

~~~js
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
};
~~~

- 改进后的冒泡排序

  设置一标志性变量`pos`,用于记录每趟排序中最后一次进行交换的位置;由于`pos`位置之后的记录均已交换到位,故在进行下一趟排序时只要扫描到`pos`位置即可;这样减少了不必要的循环

~~~js
function bubbleSort(arr) {
  // 没开始排序时,最后位置保持不变
  var i = arr.length - 1;
  while(i > 0) {
    // 每一次开始比较时,没有交换记录
    var pos = 0;
    for(var j = 0; j < i; j++) {
      if(arr[j + 1] < arr[j]) {
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
};
~~~

- 再次优化

  在每趟排序中进行正向和反向两遍冒泡的方法,一次可以得到两个最值(最大值和最小值),从而使排序趟数几乎减少了一半

~~~js
function bubbleSort(arr) {
  // 设置变量的初始值
  var low = 0;
  var high = arr.length - 1;
  while(high > low){
    // 正向冒泡,找到最大值
    for(var i = low; i < high; i++) {
    if(arr[i] > arr[i + 1]) {
      var tmp = arr[i + 1];
      arr[i + 1] = arr[i];
      arr[i] = tmp;
    }
  }
  // 修改索引的位置,最后一个位置前移一位(第一次循环之后数组最大值已找到)
  --high;
  // 反向冒泡,找到最小值
  for(var j = high; j > low; j--) {
    if(arr[j] < arr[j - 1]) {
      var tmp = arr[j - 1];
      arr[j - 1] = arr[j];
      arr[j] = tmp;
    }
  }
  // 修改索引位置,第一个位置后移一位(第一次循环之后数组最小值已找到)
  ++low;
  }
  return arr;
};
~~~

### 选择排序

- 原理
  1. 首先从原始数组中找到最小的元素,并把该元素放在数组的最前面
  2. 然后再从剩下的元素中寻找最小的元素,放在之前最小元素的后面
  3. 针对剩下的元素重复以上步骤除了最后一个元素

- 代码

~~~js
function selectSort(arr) {
  for(var i=0; i<arr.length; i++) {
    // 假设当前'i'就是数组最小数的索引minIndex
    var minIndex = i;
    for(var j=i+1; j<arr.length; j++) {
      // 将索引为'minIndex'的数和其后面一个数做比较
      // 此时i = minIndex
      if(arr[j] < arr[minIndex]) {
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
};
~~~

### 快速排序

- 原理
  1. 从数组中选定一个基数(pivot)
  2. 把数组中的每一项与此基数做比较,小的放入一个新数组,大的放入另外一个新数组
  3. 再采用这样的方法操作两个新数组(递归);直到所有子集只剩下一个元素,排序完成

- 代码

~~~js
function fastSort(arr) {
  // 开头设置判断,数组成员为一个时返回数组
  // 为最后递归左右区间数组,防止死循环做准备
  if(arr.length < 2) {
    return arr;
  }
  // 定义一个中值的索引并通过索引取到中值
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  // 分别定义左右区间数组来存放小于和大于中值的数
  var leftArr = [];
  var rightArr = [];
  for(var i=0; i<arr.length; i++) {
    if(arr[i] < pivot) {
      leftArr.push(arr[i]);
    }
    else {
      rightArr.push(arr[i]);
    }
  }
  // 递归方法对左右中值数组进行再次快排序
  return fastSort(leftArr).concat([pivot], fastSort(rightArr));
};
~~~

### 插入排序

- 原理
  1. 从第一个元素开始,该元素可以认为已经被排序
  2. 取出下一个元素,在已经排序的元素序列中从后向前扫描
  3. 如果该元素(已排序)大于新元素,将该元素移到下一位置
  4. 重复步骤3,直到找到已排序的元素小于或者等于新元素的位置
  5. 将新元素插入到该位置后
  6. 重复步骤2~5

- 代码

~~~js
function insertionSort(arr) {
  // 设定'i = 1',默认数组索引为'0'的第一个数已排序
  for(var i = 1; i < arr.length; i++) {
    // 声明一个'key'来保存当前要进行比较的新元素
    var key = arr[i];
    var j = i - 1;
    // 用新元素和前面已经排序的元素(从后向前)进行大小比较
    while(j >= 0 && arr[j] > key) {
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
};
~~~

- 优化之后的插入排序

  查找插入位置时使用二分查找的方式

~~~js
function insertionSort(arr) {
  // 设定'i = 1',默认数组索引为'0'的第一个数已排序
  for(var i = 1; i < arr.length; i++) {
     // 声明一个'key'来保存要进行比较的新元素
    var key = arr[i];
    // 定义一个区间,默认这个区间已经排序,并且区间的右边界索引小于新元素的索引
    var left = 0;
    var right = i - 1;
    while(left <= right) {
      // 二分法取到区间中值
      var middle = parseInt((left + right) / 2);
      // 比较新元素和区间中值的大小(从而进行中值的不断缩小找到新元素适合的位置)
      if(key < arr[middle]) {
        // 新元素小于中值时,右边界移动到中值前一位
        right = middle - 1;
      }
      else {
        // 新元素大于中值时,左边界移动到中值后一位
        left = middle + 1;
      }
    }
    // 不断对新元素之前区间进行排序
    for(var j = i - 1; j >= left; j--) {
      var tmp = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = tmp;
    }
  }
  return arr;
};
~~~
