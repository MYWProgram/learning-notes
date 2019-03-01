<?php

header('Content-Type: application/javascript');

// echo json_encode(array(
//   'time' => time()
// ));

// => {"time":153142321}

// echo 'foo({"time":153142321})';

// => foo({"time":153142321})


$json = json_encode(array(
  'time' => time()
));

// 在 JSON 格式的字符串外面包裹了一个函数的调用，
// 返回的结果就变成了一段 JS 代码
echo "foo({$json})";
