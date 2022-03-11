import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Tree } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [rightsList, setRightsList] = useState([]);
  const [rightsId, setRightsId] = useState(0);
  useEffect(() => {
    axios.get("/roles").then(res => {
      setDataSource(res.data);
    });
    axios.get("/rights?_embed=children").then(res => {
      setTreeData(res.data);
    });
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: id => <b>{id}</b>,
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render: item => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => showConfirm(item)}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setRightsList(item.rights);
                setRightsId(item.id);
              }}
            />
          </div>
        );
      },
    },
  ];
  const handleOk = () => {
    axios
      .patch(`/roles/${rightsId}`, {
        rights: rightsList,
      })
      .then(() => {
        dataSource.map(item => {
          if (item.id === rightsId) item.rights = rightsList;
          return item;
        });
      });

    setIsModalVisible(false);
  };
  const showConfirm = item => {
    confirm({
      title: "警告",
      icon: <ExclamationCircleOutlined />,
      content: "确认删除吗?",
      onOk() {
        deleteRightList(item);
      },
    });
  };
  const deleteRightList = item => {
    axios.delete(`/roles/${item.id}`).then(() => {
      setDataSource(dataSource.filter(data => data.id !== item.id));
    });
  };
  const onCheck = data => {
    //console.log(data.checked);
    setRightsList(data.checked);
  };

  return (
    <div>
      <Table
        rowKey={item => item.id}
        dataSource={dataSource}
        columns={columns}
      />
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={() => handleOk()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Tree
          checkStrictly
          checkable
          treeData={treeData}
          checkedKeys={rightsList}
          onCheck={onCheck}
        />
      </Modal>
    </div>
  );
}
