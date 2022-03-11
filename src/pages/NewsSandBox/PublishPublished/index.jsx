import { Button, notification } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import NewsPublish from "../../../components/NewsPublish";
import { SAVEUSER } from "../../../util/constant";

export default function PublishPublished() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios
      .get(
        `/news?author=${SAVEUSER().username}&publishState=2&_expand=category`
      )
      .then(res => {
        //console.log(res.data);
        setDataSource(res.data);
      });
  }, []);

  const sunsetNews = id => {
    //console.log(id);
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then(() => {
        setDataSource(dataSource.filter(data => data.id !== id));
        notification.info({
          message: "通知",
          description: "您的新闻已下线!",
          placement: "bottomRight",
        });
      });
  };
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={id => (
          <Button danger onClick={() => sunsetNews(id)}>
            下线
          </Button>
        )}
      />
    </div>
  );
}
