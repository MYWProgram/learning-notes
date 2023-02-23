// 冒泡排序
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    // ! 注意标志的创建位置，应该每一次循环外层的时候创建
    let flag = true;

    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        flag = false;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }

    // 如果某一次循环没有交换过元素，那么意味着排序已经完成
    if (flag) break;
  }

  return arr;
}

// 快速排序
// left和right代表分区后"新数组"的区间下标,因为没有创建新数组区分左右,所以需要left/right来确认新数组的位置
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    // pos即为被置换的位置,不单独传入一般第一趟为-1
    let pos = left - 1;

    // 循环遍历数组,从left下标处开始,且与right作比较
    for (let i = left; i <= right; i++) {
      // 选取right下标处的值与当前值作比较
      if (arr[i] <= arr[right]) {
        // 若小于等于基准数，pos++，并置换元素, 这里使用小于等于而不是小于, 其实是为了避免因为重复数据而进入死循环
        pos++;
        const temp = arr[pos];
        arr[pos] = arr[i];
        arr[i] = temp;
      }
    }

    // 一趟排序完成后，pos位置即基准数的位置，以pos的位置分割数组
    quickSort(arr, left, pos - 1);
    quickSort(arr, pos + 1, right);
  }

  // 数组只包含一个或者零个元素时,left > right,递归终止
  return arr;
}

// 归并排序
function mergeSort(arr) {
  // 判断数组长度,防止死循环
  if (arr.length <= 1) return arr;

  const middle = Math.ceil(arr.length / 2);

  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  // 递归不断分组且不断排序
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];

  while (left.length && right.length) {
    left[0] < right[0] ? result.push(left.shift()) : result.push(right.shift());
  }

  // 只要左右数组还有成员,就进行添加,直到全部成员添加到空数组为止(也为下一次等分数组做准备:保证不漏掉一个成员)
  while (left.length) result.push(left.shift());
  while (right.length) result.push(right.shift());

  return result;
}
