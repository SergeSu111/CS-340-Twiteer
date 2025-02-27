import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<PagedItemView<T>> {
  private _service: U;
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;

  public constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): U;

  protected get service() {
    return this._service;
  }

  protected get lastItem(): T | null {
    return this._lastItem;
  }

  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, user: User) {
    console.log("loading more items...\n");
    this.doFailureReportingOperation(async () => {
      let [newItems, hasMore] = await this.getMoreItems(authToken, user);

      this._hasMoreItems = hasMore;
      console.log(`hasMoreItems = ${this.hasMoreItems}\n`);
      this._lastItem = newItems[newItems.length - 1];
      console.log(`lastItem = ${JSON.stringify(this.lastItem)}`);
      this.view.addItems(newItems);
      console.log(`newItems = ${JSON.stringify(newItems)}`);
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    user: User
  ): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
}
