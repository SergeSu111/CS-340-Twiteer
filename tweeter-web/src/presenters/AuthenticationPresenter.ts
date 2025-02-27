import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { useNavigate } from "react-router-dom";
import { UserService } from "../model/UserService";


export interface AuthenticationView extends View {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export abstract class AuthenticationPresenter<
  V extends AuthenticationView
> extends Presenter<V> {
  navigate = useNavigate();
  protected service: UserService;

  public constructor(view: V) {
    super(view);
    this.service = new UserService();
  }

  public async loadUser(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
    firstName?: string | undefined,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ) {
    console.log(
      "loadUser being called by: ",
      alias,
      password,
      "anything",
      originalUrl
    );
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);

      let [user, authToken] = await this.getUser(
        alias,
        password,
        rememberMe,
        firstName,
        lastName,
        imageBytes,
        imageFileExtension,
        originalUrl
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (originalUrl) {
        this.navigate(originalUrl);
      } else {
        this.navigate("/");
      }
    }, this.getAction());
  }

  protected abstract getAction(): string;
  public abstract getUser(
    alias: string,
    password: string,
    rememberMe: boolean,
    firstName?: string | undefined,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string,
    originalUrl?: string
  ): Promise<[User, AuthToken]>;
}