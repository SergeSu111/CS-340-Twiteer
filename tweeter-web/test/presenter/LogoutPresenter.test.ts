import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito"
import { AuthToken } from "tweeter-shared";

import { UserService } from "../../src/model/UserService";
import { LogoutView, LogoutPresenter } from "../../src/presenters/LogoutPresenter";


describe("LogoutPresenter", () => {
    let mockLogoutView: LogoutView;
    let logOutPresenter: LogoutPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("ABC123", Date.now());
    beforeEach(() => {
        mockLogoutView = mock<LogoutView>();
        const mockLogoutViewInstance = instance(mockLogoutView);

        const LogoutPresenterSpy = spy(new LogoutPresenter(mockLogoutViewInstance))
        // logOutPresenter此时是一个spy了
        logOutPresenter = instance(LogoutPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);


        // 重新赋值
        when(LogoutPresenterSpy.UserService).thenReturn(mockUserServiceInstance);
    });
    it("tells the view to display a logging out message", async () =>
    {   
        await logOutPresenter.logOut(authToken);
        verify(mockLogoutView.displayInfoMessage("Logging Out...", 0)).once();

    });

    it("calls logout on the user service with correct auth token", async () => {
        await logOutPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();
        
    
    });

    it ("tells the view to clear the last info message, clear the user info, and navigate to the login page when logout is successful.", async () => {
         await logOutPresenter.logOut(authToken);

         verify(mockLogoutView.clearLastInfoMessage()).once();
         verify(mockLogoutView.clearUserInfo()).once();
         verify(mockLogoutView.navigate("/login")).once();
         verify(mockLogoutView.displayErrorMessage(anything())).never();
    });

    it ("display an error message and does not clear the last info message, and navigate to the login page when logout fails.", async () => {
       
        const error = new Error("An error occurred");
        when(mockUserService.logout(authToken)).thenThrow(error);

        await logOutPresenter.logOut(authToken);

        let [capturedErrorMessage] = capture(mockLogoutView.displayErrorMessage).last();
        console.log(capturedErrorMessage);

        verify(mockLogoutView.displayErrorMessage("Failed to log user out because of exception: Error: An error occurred")).once();

        verify(mockLogoutView.clearLastInfoMessage()).never();
        verify(mockLogoutView.clearUserInfo()).never();
        verify(mockLogoutView.navigate("/login")).never();
    });
}
)