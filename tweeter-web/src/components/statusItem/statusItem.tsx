import { MouseEvent, ReactNode, useContext, useState } from "react";
import { Status } from "tweeter-shared/dist/model/domain/Status";
import Post from "./Post";
import { Link } from "react-router-dom";
import { User } from "tweeter-shared/dist/model/domain/User";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { FakeData } from "tweeter-shared/dist/util/FakeData";
import useToastListener from "../toaster/ToastListenerHook";
import { UserInfoContext } from "../userInfo/UserInfoProvider";

interface Props {
    status: Status;        // 帖子本身
    user: User;            // 发帖用户
    formattedDate: ReactNode;
}
const StatusItem = (item: Props) =>{
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } = useContext(UserInfoContext);
    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const user = await getUser(authToken!, alias);
    
          if (!!user) {
            if (currentUser!.equals(user)) {
              setDisplayedUser(currentUser!);
            } else {
              setDisplayedUser(user);
            }
          }
        } catch (error) {
          displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
      };
    
      const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
      };
    
      const getUser = async (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
      };

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