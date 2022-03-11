import React, { useEffect } from 'react'
import TopHeader from '../../components/TopHeader'
import SideMenu from '../../components/SideMenu'
import NewsRouter from './NewsRouter'
import NProgress from 'nprogress'
import { Layout } from 'antd';
import 'nprogress/nprogress.css'
import "./index.css"
const { Content } = Layout;

export default function NewsSandBox() {
    NProgress.start()
    useEffect(() => {
        NProgress.done() 
    }) //!切换路由时的加载进度条(用npm的nprogress)
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto"
                    }}>
                    <NewsRouter />
                </Content>
            </Layout>
        </Layout>

    )
}
