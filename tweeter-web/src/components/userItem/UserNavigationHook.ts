
import useToastListener from "../toaster/ToastListenerHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import React from "react";
import useUserInfo from "../userInfo/UserInfoHook";

const useUserNavigation = () => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } = useUserInfo();

    const listener: UserNavigationView = {
      displayErrorMessage: displayErrorMessage,
      setDisplayedUser: setDisplayedUser
    }

    const presenter = new UserNavigationPresenter(listener)

    const navigateToUser = async (event: React.MouseEvent) =>{ 
      await presenter.navigateToUser(event, authToken, currentUser)
    }
    return navigateToUser
}

export default useUserNavigation