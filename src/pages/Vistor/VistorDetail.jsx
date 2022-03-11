import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions, message } from 'antd'
import { HeartTwoTone } from '@ant-design/icons';
import moment from 'moment'
import axios from 'axios';



export default function VistorDetail(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        const p = new Promise((resolve, reject) => {
            //console.log(props.match.params.id);
            //props.match.params可以获取url中的参数
            axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
                .then((res) => {
                    //console.log(res.data);
                    setNewsInfo(res.data)
                    resolve(res.data)
                })
        })
        p.then((res) => {
            axios.patch(`/news/${props.match.params.id}`,{
                view:res.view+1
            }).then((res) => {
                setNewsInfo({
                    ...res.data,
                    view:res.data.view+1
                })
            })
        })

    }, [props.match.params.id])

    const addHeart = () => {
        axios.patch(`/news/${props.match.params.id}`,{
            star:newsInfo.star+1
        }).then((res) => {
            setNewsInfo(res.data)
            message.success("感谢您的点赞和支持!")
        })
    }
    return (
        <div>
            {/* 避免组件加载完后，数据还没出来 */}
            {newsInfo &&
                <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<HeartTwoTone onClick={addHeart} twoToneColor="#eb2f96" style={{ cursor: "pointer" }} />}>
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量"><span style={{ color: "green" }}>{newsInfo.view}</span></Descriptions.Item>
                            <Descriptions.Item label="点赞数量"><span style={{ color: "green" }}>{newsInfo.star}</span></Descriptions.Item>
                            <Descriptions.Item label="评论数量"><span style={{ color: "green" }}>0</span></Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    {/* 让带标签的内容自动转换 */}
                    <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} style={{ margin: "20px 24px", border: "1px solid #ccc" }}>
                    </div>
                </div>}
        </div>
    )
}

