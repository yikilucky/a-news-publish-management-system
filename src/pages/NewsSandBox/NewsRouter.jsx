import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Home from '../NewsSandBox/Home'
import Nopermission from '../NewsSandBox/Nopermission'
import RightList from '../NewsSandBox/RightManage/RightList'
import RoleList from '../NewsSandBox/RightManage/RoleList'
import UserList from '../NewsSandBox/UserManage/UserList'
import NewsPreview from '../../components/NewsPreview'
import NewsAdd from './NewsAdd'
import NewsDraft from './NewsDraft'
import NewsAudit from './NewsAudit'
import AuditList from './AuditList'
import PublishUnpublished from './PublishUnpublished'
import PublishPublished from './PublishPublished'
import PublishSunset from './PublishSunset'
import axios from 'axios'
import { Spin } from 'antd'
const routerList = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/audit-manage/audit": NewsAudit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": PublishUnpublished,
    "/publish-manage/published": PublishPublished,
    "/publish-manage/sunset": PublishSunset,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsAdd
}
function NewsRouter(props) {
    const saveUser = JSON.parse(localStorage.getItem("token"))
    const [saveRouterList, setSaveRouterList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then((res) => {
            setSaveRouterList([...res[0].data, ...res[1].data])
        }) //Promise.all(数组).then(两个axios都成功后才会有成功的回调)，返回的res是数组
    }, [])

    const checkRouter = (item) => {
        return routerList[item.key] && (item.pagepermisson || item.routepermisson)
    } //!判断改权限路径是否在routerList里，以及pagepermisson是否为1
    const checkUserRights = (item) => {
        return saveUser.role.rights.includes(item.key)
    } //!判断用户是否有该权限
    return (
        <Spin size="large" spinning={props.switch}>
            <Switch>
                {
                    saveRouterList.map(item => {
                        if (checkRouter(item) && checkUserRights(item)) {
                            return <Route path={item.key} key={item.key} component={routerList[item.key]} exact />
                        } //!Switch，只会渲染第一个匹配上的页面；exact：精确匹配
                        return null
                    }
                    )
                }
                <Redirect path="/" to="/home" exact />
                {
                    saveRouterList.length > 0 && <Route path="*" component={Nopermission} /> //!ajax请求还没回来前saveRouterList是空的，前面map遍历还没有，会短暂出现403。所以这边先判断下ajax请求数据是否回来了
                }

            </Switch>
        </Spin>
    )
}
export default connect(
    state =>({switch:state.loadingReducer})
)(NewsRouter)