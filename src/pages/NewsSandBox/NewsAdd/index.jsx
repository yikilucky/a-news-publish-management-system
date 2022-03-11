import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import NewsEditor from '../../../components/NewsEditor'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import style from './index.module.css'
import axios from 'axios';

const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
    const newsRef = useRef(null)
    const [current, setCurrent] = useState(0)
    //编辑新闻的状态
    const [newsInfo, setNewsInfo] = useState(null)

    const [categories, setCategories] = useState([])
    const [formMsg, setFormMsg] = useState({})
    //文本框的数据
    const [content, setContent] = useState("")
    const { region, username, roleId } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        if (props.match.params.id) {
            axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then((res) => {
                //console.log(res.data);
                newsRef.current.setFieldsValue({
                    "title": res.data.title,
                    "categoryId": res.data.categoryId
                })
                setNewsInfo(res.data)
                setContent(res.data.content)
            })
        }
        axios.get("/categories").then((res) => {
            //console.log(res.data);
            setCategories(res.data)
        })
    }, [props.match.params.id])
    const nextStep = () => {
        //点击下一步时，如果此时是第0项，则收集表单数据
        if (current === 0) {
            newsRef.current.validateFields().then((res) => {
                //console.log(res);
                setFormMsg(res)
                setCurrent(current + 1)
            }).catch((error) => {
                //console.log(error);
            })
        } else {
            
            if (content === "" || content.trim() === "<p></p>")
                message.error("新闻内容不能为空!")
            else
                setCurrent(current + 1)
        }

    }
    const lastStep = () => {
        setCurrent(current - 1)

    }
    const saveNewsInfo = (auditState) => {
        //console.log(formMsg, content);
        const p = new Promise((resovle, reject) => {
            if (props.match.params.id) {
                axios.patch(`/news/${newsInfo.id}`, {
                    ...formMsg,
                    "content": content,
                    "auditState": auditState
                }).then(() => {
                    resovle()
                })

            } else {
                axios.post("/news?_expand=category", {
                    ...formMsg,
                    "content": content,
                    "region": region ? region : "全球",
                    "author": username,
                    "roleId": roleId,
                    "auditState": auditState,
                    "publishState": 0,
                    "createTime": Date.now(),
                    "star": 0,
                    "view": 0
                }).then(() => {
                    resovle()
                })

            }
        })

        p.then(() => {
            notification.info({
                message: "通知",
                description:
                    `您可以在${auditState ? "审核列表" : "草稿箱"}中查看您的新闻!`,
                placement: "bottomRight",
            });
            if (auditState)
                props.history.push("/audit-manage/list")
            else
                props.history.push("/news-manage/draft")
        })

    }

    const checkEditor = () => {
        //如果是更新新闻，当newsInfo为空时先不渲染，有数据再渲染.
        if (props.match.params.id)
            return newsInfo && <NewsEditor getContent={(editorState) => setContent(editorState)} pushContent={newsInfo} />
        else
            //否则渲染普通文本编辑器
            return <NewsEditor getContent={(editorState) => setContent(editorState)} />

    }
    return (
        <div>
            {/* 固定头部 */}
            {newsInfo === null ?
                < PageHeader
                    className="site-page-header" title="撰写新闻" /> :
                <PageHeader
                    className="site-page-header" title="更新新闻"
                    onBack={() => window.history.back()} />
            }

            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体类容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>


            {/* 变化部分 */}
            <div style={{ marginTop: "70px" }} className={current === 0 ? "" : style.hidden}> 

                {/* 表单 */}
                <Form name="control-hooks" ref={newsRef}>
                    <Form.Item name="title" label="新闻标题" rules={[{ required: true, message: '标题不能为空!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="categoryId" label="新闻分类" rules={[{ required: true, message: '请选择新闻分类!' }]}>
                        <Select>
                            {categories.map(item =>
                                <Option key={item.id} value={item.id}>{item.title}</Option>
                            )}
                        </Select>
                    </Form.Item>
                </Form>
            </div>


            <div style={{ marginTop: "70px" }} className={current === 1 ? "" : style.hidden}>
                {/* 文本编辑器 */}
                {
                    checkEditor()
                }
            </div>
            <div style={{ marginTop: "70px" }} className={current === 2 ? "" : style.hidden}>

            </div>
            <div style={{ marginTop: "50px" }}>
                {
                    current > 0 && <span>
                        <Button onClick={lastStep}>上一步</Button>
                    </span>
                }
                {
                    current < 2 && <span>
                        <Button type="primary" onClick={nextStep}>下一步</Button>
                    </span>
                }
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => saveNewsInfo(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => saveNewsInfo(1)}>提交审核</Button>
                    </span>
                }
            </div>

        </div>
    )
}
