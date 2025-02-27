import { AuthToken, Status, User } from "tweeter-shared";
import StatusService from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, user: User): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(
      authToken,
      user.alias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
      return "load feed items"
  }
}
export default FeedPresenter