<?php

// 接收用户提交的用户名密码
if (empty($_POST['username']) || empty($_POST['password'])) {
  // echo ;
  exit('请提交用户名和密码');
}
// 校验
$username = $_POST['username'];
$password = $_POST['password'];
if ($username === 'admin' && $password === '123') {
  exit('恭喜你');
}

exit('用户名或者密码错误');
// 响应
