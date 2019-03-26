# 算法

## 目录

1. [排序](#排序)

## 排序

[返回目录](#目录)

1. [冒泡排序](#冒泡排序)
2. [选择排序](#选择排序)
3. [快速排序](#快速排序)

名词解释:

  1. 时间复杂度指的是一个算法执行所耗费的时间
  2. 空间复杂度指运行完一个程序所需内存的大小
  3. 'in-space'占用常数内存不占用额外内存;'out-space'占用额外内存
  4. 是否稳定: 如果a=b,a在b的前面,排序后a仍然在b的前面则稳定;反之不稳定
  5. 'n': 数据规模; 'k': 桶的个数

![图片解释](https://user-gold-cdn.xitu.io/2016/11/29/4abde1748817d7f35f2bf8b6a058aa40?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 冒泡排序

- 原理: 依次比较相邻的两个值,如果后面的比前面的小,则将小的元素排到前面;依照这个规则进行多次并且递减的迭代,直到顺序正确

  - 平均时间复杂度O(n*n)
  - 最好情况O(n)
  - 最差情况O(n*n)
  - 空间复杂度O(1)
  - 稳定性: 稳定

- 代码

~~~js
function bubbleSort(arr) {
  for(var i=0; i<arr.length; i++) {
    for(var j=i+1; j<arr.length; j++) {
      // 比较相邻的两个数
      if(arr[j] < arr[i]) {
        // 把更小的那个数放在前面的一个位置
        var tmp = arr[j];
        arr[j] = arr[i];
        arr[i] = tmp;
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

- 原理: 首先从原始数组中找到最小的元素,并把该元素放在数组的最前面,然后再从剩下的元素中寻找最小的元素,放在之前最小元素的后面,直到排序完毕

  - 平均时间复杂度O(n*n)
  - 最好情况O(n*n)
  - 最差情况O(n*n)
  - 空间复杂度O(1)
  - 稳定性: 不稳定

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

- 原理: 从数组中选定一个基数,然后把数组中的每一项与此基数做比较,小的放入一个新数组,大的放入另外一个新数组。然后再采用这样的方法操作新数组;直到所有子集只剩下一个元素,排序完成

  - 平均时间复杂度O(nlogn)
  - 最好情况O(nlogn)
  - 最差情况O(n*n)
  - 空间复杂度O(logn)
  - 稳定性: 不稳定

- 代码

~~~js
function fastSort(arr) {
  if(arr.length < 2) {
    return arr;
  }
  // 定义一个中值的索引并通过索引取到中值
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  // 分别定义左右区间来存放小于和大于中值的数
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