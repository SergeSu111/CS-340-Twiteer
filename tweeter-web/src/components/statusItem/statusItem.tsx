import { MouseEvent, ReactNode, useContext, useState } from "react";

import Post from "./Post";
import { Link } from "react-router-dom";

import { FakeData } from "tweeter-shared/dist/util/FakeData";
import useToastListener from "../toaster/ToastListenerHook";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import useUserNavigation from "../userItem/UserNavigationHook";
import { Status, User } from "tweeter-shared";

interface Props {
    status: Status;        // 帖子本身
}
export const PAGE_SIZE = 10;
const StatusItem = (item: Props) =>{
    const navigateToUser = useUserNavigation();
    return(
            <div className="col bg-light mx-0 px-0">
              <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={item.status.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                      {item.status.user.firstName} {item.status.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={item.status.user.alias}
                        onClick={(event) => navigateToUser(event)}
                      >
                        {item.status.user.alias}
                      </Link>
                    </h2>
                    {item.status.formattedDate}
                    <br />
                    <Post status={item.status} />
                  </div>
                </div>
              </div>
            </div>
        
    );
}
export default StatusItem;