/**
 * @function 鉴权判断当前是否登录
 */
export function isLogin() {
  // 变成同步
  return sessionStorage.getItem('token')!== null;
}