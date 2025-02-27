import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";



export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  public getUser(alias: string, password: string, rememberMe?: boolean | undefined, firstName?: string | undefined, lastName?: string, imageBytes?: Uint8Array, imageFileExtension?: string, originalUrl?: string): Promise<[User, AuthToken]> {
    return this.service.login(alias, password)
}

protected getAction(): string {
    return "log user in";
}
}