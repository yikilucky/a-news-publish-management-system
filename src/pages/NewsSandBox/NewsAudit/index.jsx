import React, { useEffect, useState } from 'react'
import { Button, Table, notification} from 'antd'
import { SAVEUSER } from '../../../util/constant'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

export default function NewsAudit() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?auditState=1&_expand=category`).then((res) => {
            const list = res.data
            //console.log(list);
            setDataSource(SAVEUSER().roleId === 1 ? list : [
                ...list.filter(data => data.author === SAVEUSER().username),
                ...list.filter(data => data.region === SAVEUSER().region && data.roleId === 3)
            ])
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
            title: '操作',
            render: (item) => <div>
                <Button type="primary" style={{ marginRight: "10px" }} onClick={() => handleAudit(item, 2, 1)}>通过</Button>
                <Button onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
            </div>
        },
    ]

    const handleAudit = (item, auditState, publishState) => {
        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        }).then(() => {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            notification.info({
                message: "通知",
                description: "你可以在[审核列表/审核新闻]中查看您的新闻!",
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
