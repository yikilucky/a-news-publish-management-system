import React, { useEffect, useState } from 'react'
import { Editor} from "react-draft-wysiwyg";
import { convertToRaw,ContentState, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("")
    useEffect(() => {
        //console.log(props.pushContent);
        //如果是新增新闻，没有传给子组件pushContent，就直接跳出函数，不然后面htmlToDraft(html)无法识别undefined，会报错
        if (props.pushContent === undefined) return
        const html = props.pushContent.content
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.pushContent])

    return (
        <div>
            < Editor
                //editorState为要展示的内容
                editorState={editorState}
                //控制编辑器各个区域的样式
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                //onEditorStateChange方法为获取输入框的数据传给editorState作展示
                onEditorStateChange={(value) => {
                    //console.log(value);
                    setEditorState(value)

                }}
                onBlur={() => {
                    //子传给父，实参是把输入值转成了HTML的形式
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
