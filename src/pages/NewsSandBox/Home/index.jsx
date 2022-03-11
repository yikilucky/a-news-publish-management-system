import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Avatar, List, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom'
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from 'lodash'
import { SAVEUSER } from '../../../util/constant'

const { Meta } = Card;

export default function Home() {
    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const [allList, setAllList] = useState([])
    const [visible, setVisible] = useState(false)
    const [isMychart, setIsMychart] = useState(null)

    const chartRef = useRef();
    const pieRef = useRef();

    useEffect(() => {
        axios.get("http://localhost:3000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then((res) => {
            //console.log(res.data);
            setViewList(res.data)
        })

        axios.get("http://localhost:3000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then((res) => {
            //console.log(res.data);
            setStarList(res.data)

        })
    }, [])

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then((res) => {
            //console.log(res.data);

            //第一个参数为要操作的数据，第二个参数为函数，返回要提取的字段
            //console.log(_.groupBy(res.data, item => item.category.title));
            const pieList = res.data.filter(item => item.author === SAVEUSER().username)
            
            showCharts(_.groupBy(res.data, item => item.category.title))
            setAllList(pieList)
        })
        //当组件销毁后不再关注窗口大小
        return () => {
            window.onresize = null
        }

    }, [])

    const showCharts = (obj) => {
        var myChart = Echarts.init(chartRef.current);
        let option = {
            title: {
                text: '新闻分类'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                //获取对象key值
                data: Object.keys(obj),
                //让x轴永远显示
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };
        myChart.setOption(option);
        //当窗口大小发生改变时触发
        window.onresize = () => {
            //console.log("111");
            //让图标随窗口自适应
            myChart.resize()
        }
    }
    const showPieCharts = () => {
        const groupPie=_.groupBy(allList, item => item.category.title)
        //console.log(groupPie);
        const list=[]
        for(let i in groupPie){
            list.push({
                name:i,
                value:groupPie[i].length
            })
        }
        let myChart;
        if(isMychart===null){
            myChart=Echarts.init(pieRef.current)
            setIsMychart(myChart)
        }else{
            myChart=isMychart
        }
        
        var option;
        option = {
            title: {
                text: '个人新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            dataSource={viewList}
                            renderItem={item => (
                                <List.Item>
                                    <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            dataSource={starList}
                            renderItem={item => (
                                <List.Item>
                                    <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <EyeOutlined key="eye" onClick={() => {
                                //避免组件渲染完成，数据没出来报错
                                setTimeout(() => {
                                    setVisible(true)
                                    showPieCharts()
                                }, 0)
                            }
                            } />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={SAVEUSER().username}
                            description={<div>
                                <b>{SAVEUSER().region ? SAVEUSER().region : "全球"}</b><span style={{ marginLeft: "20px" }}>{SAVEUSER().role.roleName}</span>
                            </div>}
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer title="个人新闻分类分析" placement="right" onClose={() => setVisible(false)} visible={visible} width="500px">
                <div ref={pieRef} style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
            </Drawer>
            <div ref={chartRef} style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
        </div>
    )
}
