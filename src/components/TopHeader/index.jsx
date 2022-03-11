import React from 'react'
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {onScroll,offScroll} from '../../redux/action/scrollAction'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
const { Header } = Layout;

function TopHeader(props) {
    const currentUser = JSON.parse(localStorage.getItem("token")) //把字符串解析成对象
    const onScroll = () => {
        props.onScroll()
    }
    const offScroll = () => {
        props.offScroll()
    }
    const menu = (
        <Menu>
            <Menu.Item key="1">{currentUser.role.roleName}</Menu.Item>
            <Menu.Item danger key="2"><NavLink to="/login" onClick={() => localStorage.removeItem("token")}>退出</NavLink></Menu.Item>
        </Menu>
    );
    return (
        <Header className="site-layout-background" style={{ padding: "0 16px" }}>
            {props.switch ? <MenuUnfoldOutlined onClick={()=>offScroll()} /> : <MenuFoldOutlined onClick={()=>onScroll()} />}

            <div style={{ float: "right" }}>
                <span>欢迎 <span style={{ color: "skyblue" }}>{currentUser.username}</span> 回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}

export default connect(
    state => ({switch:state.scrollReducer}),
    {
        onScroll,
        offScroll
    }
)(TopHeader)