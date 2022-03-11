import React, { useEffect, useState } from 'react'
import { Button, Table, notification, Tag } from 'antd'
import { SAVEUSER, AUDITSTATE, AUDITCOLOR } from '../../../util/constant'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
export default function AuditList() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${SAVEUSER().username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
            //console.log(res.data);
            setDataSource(res.data);
        })
    }, [])

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) =>
                <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: item => <span>{item.title}</span>
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: item => <Tag color={AUDITCOLOR[item]}>{AUDITSTATE[item]}</Tag>
        },
        {
            title: '操作',
            render: (item) => {
                return item.auditState === 1 ?
                    <Button onClick={() => changeHandle(item, "revocation")}>撤销</Button> : (
                        item.auditState === 2 ?
                            <Button type="primary" onClick={() => changeHandle(item)}>发布</Button> :
                            <NavLink to={`/news-manage/update/${item.id}`}><Button danger >修改</Button></NavLink>
                    )

            }
        },
    ]




    //撤销新闻 发布新闻
    const changeHandle = (item, handle) => {
        const p = new Promise((resolve, reject) => {
            if (handle === "revocation") {
                axios.patch(`/news/${item.id}`, {
                    auditState: 0
                }).then(() => {
                    resolve("您可以在草稿箱中查看您的新闻!")
                })
            } else {
                axios.patch(`/news/${item.id}`, {
                    publishState: 2
                }).then(() => {
                    resolve("您的新闻已上线！")
                })
            }
        })

        p.then((res) => {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            notification.info({
                message: "通知",
                description: res,
                placement: "bottomRight",
            });
        })

    }
    return (
        <div>
            <Table rowKey={item => item.id} dataSource={dataSource} columns={columns} />
        </div>
    )
}
