import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal;

export default function RightList() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            //为了让首页不出现下级图标
            const list = res.data;
            list.forEach(element => {
                if (element.children.length === 0)
                    element.children = ""
            });
            setDataSource(list)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            //当有render方法，就不会按照dataIndex执行，而是执行render
            render: id => <b>{id}</b>
        },
        {
            title: '权限列表',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: key => <Tag color="orange">{key}</Tag>
        },
        {
            title: '操作',
            render: item => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
                        <Popover content={
                            <div style={{ textAlign: "center" }}>
                                <Switch checked={item.pagepermisson === 1} onChange={() => changeSwitchCheck(item)} />
                            </div>
                        }
                            title="页面配置项" trigger={item.pagepermisson === undefined ? "" : "click"}>
                            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                        </Popover>
                    </div>
                )
            }
        },
    ];

    const changeSwitchCheck = item => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            }).then(() => {
                setDataSource([...dataSource])
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            }).then(() => {
                setDataSource([...dataSource])
            })
        }


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
        if (item.grade === 1) {
            axios.delete(`/rights/${item.id}`).then(() => {
                setDataSource(dataSource.filter(data => data.id !== item.id))
            })
        } else {
            // 通过子rigthId找到父id
            let list = dataSource.filter(data => data.id === item.rightId)
            //过滤
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            // console.log(list);
            // console.log(dataSource);
            axios.delete(`/children/${item.id}`).then(() => {
                setDataSource([...dataSource])
            })

        }
    }

    return (
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    )
}
