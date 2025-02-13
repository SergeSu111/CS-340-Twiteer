import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { User } from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import UserItem from "../userItem/UserItem";
import useToastListener from '../toaster/ToastListenerHook';
import { UseritemPresenter, UserItemView } from "../../presenters/UseritemPresenter";




interface Props {
  
 
  // 传入followeeView接口 给presenter 返回一个presenter
  presenterGenerator: (view: UserItemView) => UseritemPresenter;
}

const UserItemScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<User[]>([]);
  const [newItems, setNewItems] = useState<User[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);


  const { displayedUser, authToken } = useContext(UserInfoContext);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
  useEffect(() => {
    if(changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Add new items whenever there are new items to add
  useEffect(() => {
    if(newItems) {
      setItems([...items, ...newItems]);
    }
  }, [newItems])

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  }

  // 实现view接口 这样Presenter来的数据可以直接到这个UI前端里
  const listener: UserItemView = 
  {
    addItems: (newItems: User[]) =>
      setNewItems(newItems),
    dispalyErrorMessage: displayErrorMessage
  }

  const presenter = props.presenterGenerator(listener);
  // needs to be refactored

  const loadMoreItems = async () =>  {
    presenter.loadMoreItems(authToken!, displayedUser!.alias)
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <UserItem value={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
