export const AUDITSTATE = ["未审核", "审核中", "已通过", "未通过"]
export const PUBLISHSTATE = ["未发布", "待发布", "已上线", "已下线"]
export const AUDITCOLOR=["","orange","green","red"]
export const SAVEUSER = () => {
    return JSON.parse(localStorage.getItem("token"))
}