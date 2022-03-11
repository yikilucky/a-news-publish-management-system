import { Button,notification } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import NewsPublish from '../../../components/NewsPublish'
import { SAVEUSER } from '../../../util/constant'

export default function PublishSunset() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`/news?author=${SAVEUSER().username}&publishState=3&_expand=category`).then((res) => {
            //console.log(res.data);
            setDataSource(res.data);
        })
    }, [])

    const deleteNews = (id) => {
        //console.log(id);
        axios.delete(`/news/${id}`).then(() => {
            setDataSource(dataSource.filter(data => data.id !== id))
            notification.info({
                message: "通知",
                description: "您的新闻已删除!",
                placement: "bottomRight",
            });
        })
    }
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => deleteNews(id)}>删除</Button>} />
        </div>
    )
}
