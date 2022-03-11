import React, { forwardRef, useState } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select;
const UserFrom = (props, ref) => {
    const [regionsDis, setRegions] = useState(false)
    const saveCurrentUser = JSON.parse(localStorage.getItem("token"))
    const decisionRegionDisabled = (item) => {
        // !只有更新时候父传给子了isUpData，所以先判断是更新还是新建，第一个if块修改更新时候的Form，再判断是超级管理员还是区域管理员
        if (props.isUpData) {
            if (saveCurrentUser.roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            if (saveCurrentUser.roleId === 1) {
                return false
            } else {
                return (item.value !== saveCurrentUser.region)
            }
        }
    } //!区域管理员和超级管理员在添加和更新用户时看的Form权限不一样，前者有些Option是禁用的，上面函数改的是区域Selector，下面改的是角色Selector
    const decisionRoleDisabled = (item) => {
        if (props.isUpData) {
            if (saveCurrentUser.roleId === 1) {
                return false
            } else {
                return true
            }
        } else {
            if (saveCurrentUser.roleId === 1) {
                return false
            } else {
                return (item.roleType !== 3)
            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical">
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}>
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}>
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={regionsDis ? [] : [{ required: true, message: 'Please input the title of collection!' }]}>
                <Select disabled={regionsDis}>
                    {props.regionsList.map((item) => <Option disabled={decisionRegionDisabled(item)} key={item.id} value={item.value}>{item.value}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}>
                <Select onChange={(value) => {
                    if (value === 1) {
                        setRegions(true)
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setRegions(false)
                    }
                }}>
                    {props.rolesList.map((item) => <Option disabled={decisionRoleDisabled(item)} key={item.id} value={item.id}>{item.roleName}</Option>)}
                </Select>
            </Form.Item>
        </Form>

    )
}
export default forwardRef(UserFrom)
