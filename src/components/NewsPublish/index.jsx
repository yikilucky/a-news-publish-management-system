import React from 'react'
import { Table } from 'antd'
import { NavLink } from 'react-router-dom'
export default function NewsPublish(props) {

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
            render: (item) => props.button(item.id)
        },
    ]

    return (
        <div>
            <Table rowKey={item => item.id} dataSource={props.dataSource} columns={columns} />
        </div>
    )
}
