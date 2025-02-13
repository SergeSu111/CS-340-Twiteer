import { AuthToken } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";


// 每一个Presenter class都需要一个 view interface来与实际的UI进行通信. 所以当Presenter得到后端的数据等,
// 再调用这个interface里的方法与前端连接. 
export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter
{
    // 因为Presenter是连接前端view 和 后端service的桥梁 所以要callService的class
    private followService: FollowService;
    public constructor(view: UserItemView)
    {
        super(view);
        this.followService = new FollowService();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        try {
            
          const [newItems, hasMore] = await this.followService.loadMoreFollowers(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
          );
    
          this.hasMoreItems = hasMore;
          this.lastItem = newItems[newItems.length - 1];
          this.view.addItems(newItems);
        } catch (error) {
         this.view.dispalyErrorMessage(
            `Failed to load followers because of exception: ${error}`
          );
        }
      };
}