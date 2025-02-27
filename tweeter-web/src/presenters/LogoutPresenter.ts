import { AuthToken, User } from "tweeter-shared";
import { UserService } from '../model/UserService';
import { Presenter, View } from "./Presenter";


export interface LogoutView extends View{
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void;
    // displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
    clearLastInfoMessage: () => void;
    clearUserInfo: () => void;
    navigate(path: string): void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
    // 目的给之后的spy留空间重新赋值
    private _userService: UserService | null = null;
    
   
    public constructor(view: LogoutView){
        super(view)
        this._userService = new UserService()
    }

    // factory method => spy
    public get UserService()
    {
      if(this._userService == null)
      {
        this._userService = new UserService();
      }
      return new UserService();
    }

    public async logOut(authToken: AuthToken | null) {
        this.view.displayInfoMessage("Logging Out...", 0);
    
        try {
          // call get function
          await this.UserService.logout(authToken!);
    
          this.view.clearLastInfoMessage();
          this.view.clearUserInfo();
          this.view.navigate("/login");
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
          );
        }
      };
}