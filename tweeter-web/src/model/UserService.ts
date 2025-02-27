import { Buffer } from "buffer";
import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias)
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser

        if (!user) {
            throw new Error("Invalid alias or password")
        }

        return [user, FakeData.instance.authToken]
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        // Not needed now, but will be used when calling the server in milestone 3
        const imageStringBase64 = Buffer.from(userImageBytes).toString("base64")

        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser

        if (!user) {
            throw new Error("Invalid registration")
        }

        return [user, FakeData.instance.authToken]
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        // TODO: Replace with the result of calling the server
        return FakeData.instance.isFollower()
    }

    public async getFollowerCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        // TODO: Replace with the result of calling the server
        return FakeData.instance.getFollowerCount(user.alias)
    }

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        // TODO: Replace with the result of calling the server
        return FakeData.instance.getFolloweeCount(user.alias)
    }

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[number, number]> {
        // Pause to simulate processing time, remove when connected to the server
        await new Promise(resolve => setTimeout(resolve, 2000))

        // TODO: Call the server

        const followerCount = await this.getFollowerCount(authToken, userToFollow)
        const followeeCount = await this.getFolloweeCount(authToken, userToFollow)

        return [followerCount, followeeCount]
    }

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[number, number]> {
        // Pause to simulate processing time, remove when connected to the server
        await new Promise(resolve => setTimeout(resolve, 2000))

        // TODO: Call the server

        const followerCount = await this.getFollowerCount(authToken, userToUnfollow)
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow)

        return [followerCount, followeeCount]
    }

    public async logout(authToken: AuthToken): Promise<void> {
        // Pause to simulate logging out message, delete when server call is implemented
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
}
