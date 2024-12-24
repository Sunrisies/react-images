import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import styles from '@/assets/styles/login.module.css'
import { loginApi, registerApi } from '@/api';
import { Button, Form, FormProps, Input } from 'antd';
import { LoginAndRegisterType } from '@/api/login';
export const Route = createFileRoute('/login')({
  component: RouteComponent,
})


function RouteComponent() {
  const [isSwitched, setIsSwitched] = useState(false);
  const handleSwitch = () => {
    setIsSwitched(!isSwitched);
  };

  const logon = async (params: LoginAndRegisterType) => {
    const res = await loginApi(params)
    console.log(res, 'res登录之后')
  }
  const register = async (params: LoginAndRegisterType) => {
    const res = await registerApi(params)
    console.log(res, 'res注册之后')
  }
  return (
    <div className={styles.container1}>
      <div className={styles.main}>
        <div className={`${styles.container} ${styles.a_container} ${isSwitched ? styles.is_txl : ''} ${isSwitched ? styles.is_hidden : ''}`} id="a-container">
          {/* <form  id="a-form" method="" action=""> */}
          <div className={styles.form}>

            <h2 className={styles.title}>创建账号</h2>
            <div className="form__icons"></div>
            <Form
              name="register"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={(values: LoginAndRegisterType) => register({ ...values })}
              autoComplete="off"
            >
              <Form.Item<LoginAndRegisterType>
                name="user_name"
                rules={[{ required: true, message: '请输入用户名账号!' }]}
              >
                <Input className={styles.form__input} placeholder="请输入用户名账号" />
              </Form.Item>

              <Form.Item<LoginAndRegisterType>
                // label="密码"
                name="pass_word"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input.Password className={styles.form__input} placeholder="请输入密码" />
              </Form.Item>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  注册
                </Button>
              </Form.Item>
            </Form>


          </div>

          {/* <button className={styles.button} onClick={() => register()} >注册</button> */}
          {/* </form> */}
        </div>
        <div className={`${styles.container} ${styles.b_container} ${isSwitched ? styles.is_txl : ''} ${isSwitched ? '' : styles.is_hidden}`} id="b-container">
          {/* <form className={styles.form} id="b-form" method="" action=""> */}
          <div className={styles.form}>
            <h2 className={styles.title}>登录网站</h2>
            <div className="form__icons"></div>
            <span className={styles.form__span}>或使用您的电子邮件帐户</span>
            <Form
              name="login"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={(values: LoginAndRegisterType) => logon({ ...values })}
              autoComplete="off"
            >
              <Form.Item<LoginAndRegisterType>
                name="user_name"
                rules={[{ required: true, message: '请输入用户名账号!' }]}
              >
                <Input className={styles.form__input} placeholder="请输入用户名账号" />
              </Form.Item>

              <Form.Item<LoginAndRegisterType>
                name="pass_word"
                rules={[{ required: true, message: '请输入你的密码!' }]}
              >
                <Input.Password className={styles.form__input} placeholder="请输入密码" />
              </Form.Item>

              <Form.Item label={null}>
                <a className={styles.form__link}>忘记密码？</a>

                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </Form.Item>

            </Form>
            {/* <button className={styles.button} onClick={() => logon()} >登录</button> */}
          </div>
          {/* </form> */}
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
    </div>

  );
};
