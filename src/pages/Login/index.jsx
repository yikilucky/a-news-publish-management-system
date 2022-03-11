import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Particles from 'react-particles-js';
import axios from 'axios';
import "./login.css"
import { withRouter } from 'react-router-dom';


function Login(props) {
    const onFinish = (value) => {
        axios.get(`http://localhost:3000/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then((res) => {
            //!axios请求中，如果用户名密码等没问题，那么res,data就是[该用户的item对象]
            //console.log(res.data);
            if (res.data.length === 0) {
                message.error("账号或密码错误!") //message是antd的提示框
            } else {
                localStorage.setItem("token", JSON.stringify(res.data[0])) //!要把对象变成字符串形式
                props.history.push("/")
            }
        })

    }
    return (
        <div style={{ backgroundColor: "#272a49", height: "100%", overflow: "hidden" }}> 
            <Particles height={document.documentElement.clientHeight} />
            <div className="loginWrap">
                <div className="loginTitle">新闻发布管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
export default withRouter(Login)