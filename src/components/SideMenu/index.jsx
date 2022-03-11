import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import { NavLink, withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'
import "./index.css"
import {
    UserOutlined,
    HomeOutlined,
    ControlOutlined,
    SoundOutlined,
    AuditOutlined,
    SmileOutlined
} from '@ant-design/icons';
const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <ControlOutlined />,
    "/news-manage":<SoundOutlined />,
    "/audit-manage":<AuditOutlined />,
    "/publish-manage":<SmileOutlined />

}
function SideMenu(props) {
    //获取当前url中的keys值，传入Menu中，作为选中/展开条件
    const selectKeys = [props.location.pathname]  //加上[]是为了让他们成为数组传入
    const openKeys = ["/" + props.location.pathname.split("/")[1]]
    const [menuList, setMenuList] = useState([])
    const currentUser = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get("/rights?_embed=children").then(((res) => {
            setMenuList(res.data)
        }))
    }, [])
    //根据数据遍历列表
    const decision = (item) => {
        return item.pagepermisson === 1 && (currentUser.role.rights).includes(item.key)
    } //!还要判断当前用户是否有该权限
    const menuRender = menuList =>
        menuList.map(item => {
            if (item.children?.length > 0 && decision(item)) {
                return (
                    <SubMenu key={item.key} title={item.title} icon={iconList[item.key]}>
                        {/* 如果是二级列表，调用递归 */}
                        {menuRender(item.children)}
                    </SubMenu>
                )
            }
            return decision(item) &&
                <Menu.Item key={item.key} icon={iconList[item.key]}>
                    <NavLink to={item.key}>{item.title}</NavLink>
                </Menu.Item>


        }
        )
    return (
        <Sider trigger={null} collapsible collapsed={props.switch} >
            <div style={{ display: 'flex', height: "100%", flexDirection: "column" }} >
                <div className="logo">新闻发布管理系统</div>
                <div style={{ flex: 1, overflow: "auto" }}>
                    <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                        {/* 封装函数遍历生成菜单项 */}
                        {menuRender(menuList)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

export default connect(
    state =>({switch:state.scrollReducer}),
    {}
)(withRouter(SideMenu))
