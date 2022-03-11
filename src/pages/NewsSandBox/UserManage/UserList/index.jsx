import React, { useEffect, useState, useRef } from 'react'
import UserForm from '../../../../components/UserForm'
import { Button, Table, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal;
export default function UserList() {
    const formRef = useRef(null)
    const [dataSource, setDataSource] = useState([])
    const [visible, setVisible] = useState(false);
    const [isUpData, setIsUpData] = useState(false);
    const [regionsList, setRegionsList] = useState([])
    const [rolesList, setRolesList] = useState([])
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const saveCurrentUser = JSON.parse(localStorage.getItem("token"))
        axios.get("/users?_expand=role").then((res) => {
            const { data } = res
            setDataSource(saveCurrentUser.roleId === 1 ? data : [
                ...data.filter(item => item.username === saveCurrentUser.username),
                ...data.filter(item => item.region === saveCurrentUser.region && item.roleId === 3) //!根据用户不同的权限，用户列表显示不同的table
            ])
        })
        axios.get("/regions").then((res) => {
            setRegionsList(res.data)
        })
        axios.get("/roles").then((res) => {
            setRolesList(res.data)
        })
    }, [])
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionsList.map(item => ({
                    text: item.title,
                    value: item.value
                })),
                {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {
                if (item.region === "")
                    return "全球"
                return item.region === value
            },
            render: region => <b>{region === "" ? "全球" : region}</b>
        },
        {
            title: '角色名称',
            render: (item) => item.role?.roleName
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '用户状态',
            render: (item) => <Switch checked={item.roleState} disabled={item.default} onChange={() => changeSwitchChecked(item)} />
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} disabled={item.default} />
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => upUserData(item)} />
                    </div>
                )

            }
        },
    ]
    const upUserData = (item) => {
        //console.log(item);
        setTimeout(() => {
            setIsUpData(true)
            setVisible(true)
            formRef.current.setFieldsValue(item)
            setCurrentUser(item)
        }, 0)

    }
    const changeSwitchChecked = (item) => {
        item.roleState = !item.roleState
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        }).then(() => {
            setDataSource([...dataSource])
        })
    }
    const showConfirm = item => {
        confirm({
            title: '警告',
            icon: <ExclamationCircleOutlined />,
            content: '确认删除吗?',
            onOk() {
                deleteRightList(item)
            }
        });
    }
    const deleteRightList = item => {
        axios.delete(`/users/${item.id}`).then(() => {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            setVisible(false)
        })
    }
    const formOk = () => {
        if (!isUpData) {
            formRef.current.validateFields().then((res) => {
                //console.log(res);
                const { username, password, region, roleId } = res
                axios.post("/users", {
                    username,
                    password,
                    region,
                    roleId,
                    roleState: true,
                    default: false
                }).then((res) => {
                    //!清空输入框
                    formRef.current.resetFields()
                    setDataSource([...dataSource, {
                        ...res.data,
                        //!给users添加上role中对应的属性
                        role: rolesList.filter(data => roleId === data.id)[0]
                    }])
                    setVisible(false)
                })

            }).catch((res) => {
                console.log(res);
            })
        } else {
            formRef.current.validateFields().then((res) => {
                axios.patch(`/users/${currentUser.id}`, (res)).then(() => {
                    setDataSource(dataSource.map((item) => {
                        if (item.id === currentUser.id) {
                            return {
                                ...item,
                                ...res,
                                role: rolesList.filter(data => res.roleId === data.id)[0]
                            }
                        } else {
                            return item
                        }
                    }))
                    formRef.current.resetFields()
                    setVisible(false)
                })

            })
        }

    }
    return (
        <div>
            <Modal
                visible={visible}
                title={isUpData ? "更新用户" : "添加用户"}
                okText={isUpData ? "更新" : "确定"}
                cancelText="取消"
                onCancel={() => setVisible(false)}
                onOk={formOk}>
                <UserForm regionsList={regionsList} rolesList={rolesList} ref={formRef} isUpData={isUpData} />
            </Modal>
            <Button type="primary" onClick={() => { setTimeout(() => { setIsUpData(false); setVisible(true); formRef.current.resetFields() }, 0) }}>添加用户</Button>
            <Table rowKey={item => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    )
}
