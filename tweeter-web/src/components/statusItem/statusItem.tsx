import { MouseEvent, ReactNode, useContext, useState } from "react";
import { Status } from "tweeter-shared/dist/model/domain/Status";
import Post from "./Post";
import { Link } from "react-router-dom";
import { User } from "tweeter-shared/dist/model/domain/User";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { FakeData } from "tweeter-shared/dist/util/FakeData";
import useToastListener from "../toaster/ToastListenerHook";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import useUserNavigation from "../userItem/UserNavigationHook";

interface Props {
    status: Status;        // 帖子本身
    user: User;            // 发帖用户
    formattedDate: ReactNode;
}
const StatusItem = (item: Props) =>{
    const {navigateToUser} = useUserNavigation();
    return(
            <div className="col bg-light mx-0 px-0">
              <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={item.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {item.user.firstName} {item.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={item.user.alias}
                        onClick={(event) => navigateToUser(event)}
                      >
                        {item.user.alias}
                      </Link>
                    </h2>
                    {item.formattedDate}
                    <br />
                    <Post status={item.status} />
                  </div>
                </div>
              </div>
            </div>
        
    );
}
export default StatusItem;