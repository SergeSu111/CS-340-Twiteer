import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";

import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";
import StatusService from "../../src/model/service/StatusService";
import { PostStatusView, PostStatusPresenter } from "../../src/presenters/PostStatusPresenter";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;

    
    const post = "Hello, World!";
    const authToken = new AuthToken("ABC123", Date.now());
    // 构造一个简单的 User 实例，用于构造 Status 对象
    const currentUser = new User("alias", "FirstName", "LastName", "imageUrl");

    // 创建一个 dummy event 以模拟 React.MouseEvent
    let mockEvent: React.MouseEvent;

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const PostStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance))
        postStatusPresenter = instance(PostStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(PostStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);

         // 构造一个 dummy event，用于阻止默认行为
        mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent;
        });


  it("tells the view to display a posting status message", async () => {
    // Mock 成功返回
    when(mockStatusService.postStatus(authToken, anything())).thenResolve();

    await postStatusPresenter.submitPost(mockEvent, post, currentUser, authToken);

    // 验证是否显示“Posting status...”提示
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });


  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    when(mockStatusService.postStatus(anything(), anything())).thenResolve();

    await postStatusPresenter.submitPost(mockEvent, post, currentUser, authToken);

    // 验证 postStatus 是否被正确调用
    verify(mockStatusService.postStatus(authToken, anything())).once();
    // 捕获传入的参数，进一步断言
    const [capturedToken, capturedStatus] = capture(mockStatusService.postStatus).last();
    expect(capturedToken).toEqual(authToken);
    // 验证创建的 Status 对象是否包含正确的 post 文本和用户信息
    expect(capturedStatus.post).toEqual(post);
    expect(capturedStatus.user).toEqual(currentUser);
  });

  it("when posting of the status is successful, clears the last info message, clears the post, and displays a status posted message", async () => {
    when(mockStatusService.postStatus(anything(), anything())).thenResolve();

    await postStatusPresenter.submitPost(mockEvent, post, currentUser, authToken);

    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
  });

  it("when posting is not successful, displays an error message and clears the last info message, and does not clear the post or display a status posted message", async () => {
    const error = new Error("Failed to post status");
    when(mockStatusService.postStatus(anything(), anything())).thenReject(error);

    await postStatusPresenter.submitPost(mockEvent, post, currentUser, authToken);

    // 验证错误消息
    verify(mockPostStatusView.displayErrorMessage(
      `Failed to post the status because of exception: Error: Failed to post status`
    )).once();

    // 不应清空 post，也不应显示“Status posted!”消息
    verify(mockPostStatusView.setPost("")).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();

    // finally 块中依旧会清除最后一次信息消息
    verify(mockPostStatusView.clearLastInfoMessage()).once();
  });
});