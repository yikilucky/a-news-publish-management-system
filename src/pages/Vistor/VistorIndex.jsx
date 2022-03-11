import React, { useEffect, useState } from 'react'
import { Card, Col, Row, PageHeader, List } from 'antd'
import axios from 'axios'
//js高效率库
import _ from 'lodash'
import { NavLink } from 'react-router-dom'

export default function VistorIndex() {
    const [list, setList] = useState([])
    useEffect(() => {
        axios.get("news?publishState=2&_expand=category").then((res) => {
            //console.log(Object.entries(_.groupBy(res.data, item => item.category.title)));
            setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
            //entries用法
            // const s1={
            //     3 : 'lc',
            //     1 : 'yx',
            //     "luochao": "22"
            //   }
            //   console.log(Object.entries(s1))  [["1","yx"],["3","lc"],["luochao","22"]]
              
        })
    }, [])
    return (
        <div style={{ width: "95%", margin: "0 auto" }}>
            <PageHeader
                className="site-page-header"
                title="新闻中心"
            />
            <div className="site-card-wrapper">
                {/* 控制间距 */}
                <Row gutter={[16,16]} >
                    {list.map(item =>
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={false} hoverable>
                                <List
                                    bordered
                                    dataSource={item[1]}
                                    pagination={{
                                        pageSize:3
                                    }}
                                    renderItem={data => <List.Item>{<NavLink to={`/detail/${data.id}`}>{data.title}</NavLink>}</List.Item>}
                                />
                            </Card>
                        </Col>)}

                </Row>
            </div>
        </div>

    )
}
