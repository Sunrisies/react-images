import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import styles from '@/assets/styles/login.module.css'
export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isSwitched, setIsSwitched] = useState(false);
  const handleSwitch = () => {
    setIsSwitched(!isSwitched);
  };
  return (
    <div className={styles.main}>
      <div className={`${styles.container} ${styles.a_container} ${isSwitched ? styles.is_txl : ''} ${isSwitched ? styles.is_hidden : ''}`} id="a-container">
        <form className={styles.form} id="a-form" method="" action="">
          <h2 className={styles.title}>创建账号</h2>
          <div className="form__icons"></div>
          <input className={styles.form__input} type="text" placeholder="请输入用户名账号" />
          <input className={styles.form__input} type="password" placeholder="请输入密码" />
          <button className={styles.button} >注册</button>
        </form>
      </div>
      <div className={`${styles.container} ${styles.b_container} ${isSwitched ? styles.is_txl : ''} ${isSwitched ? '' : styles.is_hidden}`} id="b-container">
        <form className={styles.form} id="b-form" method="" action="">
          <h2 className={styles.title}>登录网站</h2>
          <div className="form__icons"></div>
          <span className={styles.form__span}>或使用您的电子邮件帐户</span>
          <input className={styles.form__input} type="text" placeholder="请输入用户名或电子邮件" />
          <input className={styles.form__input} type="password" placeholder="请输入密码" /><a className="form__link">忘记密码？</a>
          <button className={styles.button} >登录</button>
        </form>
      </div>
      <div id="switch-cnt" className={`${styles.switch} ${isSwitched ? styles.is_txr : styles.is_txl}`}>
        <div className={styles.switch__circle}></div>
        <div className={`${styles.switch__circle} ${styles.switch__circle__t}`}></div>
        <div className={`${styles.switch__container} ${isSwitched ? styles.is_hidden : ''}`} id="switch-c1">
          <h2 className={styles.title}>欢迎回来 !</h2>
          <p className={styles.description}>要与我们保持联系，请使用您的个人信息登录</p>
          <button className={styles.switch__button} onClick={handleSwitch}>登录</button>
        </div>
        <div className={`${styles.switch__container} ${isSwitched ? '' : styles.is_hidden}`} id="switch-c2">
          <h2 className={styles.title}>你好，朋友!</h2>
          <p className={styles.description}>输入您的个人信息，与我们一起开始旅程</p>
          <button className={styles.switch__button} onClick={handleSwitch}>注册</button>
        </div>
      </div>
    </div>
  );
};
