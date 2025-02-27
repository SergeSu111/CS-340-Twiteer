import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UseritemPresenter, UserItemView } from "./UseritemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

// 每一个Presenter class都需要一个 view interface来与实际的UI进行通信. 所以当Presenter得到后端的数据等,
// 再调用这个interface里的方法与前端连接. 


export class FolloweePresenter extends UseritemPresenter
{
  protected async getMoreItems(authToken: AuthToken, user: User): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(
      authToken,
      user.alias,
      PAGE_SIZE,
      this.lastItem
    )
}

protected getItemDescription(): string {
    return "load followers"
}
}