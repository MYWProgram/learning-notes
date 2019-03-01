<?php

$zhangsan = array('name' => '张三', 'age' => 18);

// 于情于理都应该设置 application/json
// header('Content-Type: application/json');

echo json_encode($zhangsan);
