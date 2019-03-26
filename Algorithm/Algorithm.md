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
  3. 是否稳定: 如果a=b,a在b的前面,排序后a仍然在b的前面则稳定;反之不稳定

![图片解释](https://user-gold-cdn.xitu.io/2016/11/29/4abde1748817d7f35f2bf8b6a058aa40?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 冒泡排序

- 原理: 依次比较相邻的两个值,如果后面的比前面的小,则将小的元素排到前面。依照这个规则进行多次并且递减的迭代,直到顺序正确

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
      if(arr[j] < arr[i]) {
        // 把更小的那个数放在前面的一个位置
        var temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
      }
    }
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
    var temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
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