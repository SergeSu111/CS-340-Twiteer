import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";

// 如果 AuthToken 和 User 都来自 "tweeter-shared"
import { AuthToken, User } from "tweeter-shared";

import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import PostStatus from "../../../src/components/postStatus/PostStatus";

// 1. Mock userInfoHook
jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  // 准备一个假的 User、AuthToken
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    mockUserInstance = new User("alias", "first", "last", "imgUrl");
    mockAuthTokenInstance = new AuthToken("test-token", Date.now());

    // 让 useUserInfo 返回我们指定的用户信息
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("disables the Post Status and Clear buttons when first rendered", () => {
    const { postStatusButton, clearStatusButton } = renderAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { postStatusText, postStatusButton, clearStatusButton, user } =
      renderAndGetElements();

    await user.type(postStatusText, "hey pal");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { postStatusText, postStatusButton, clearStatusButton, user } =
      renderAndGetElements();

    await user.type(postStatusText, "hey pal");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();

    await user.clear(postStatusText);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("calls presenter's postStatus method with correct parameters when the post status button is pressed", async () => {
    // 1. 创建并实例化一个 mock 的 Presenter
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    // 2. 使用特定文案
    const testPost = "Welcome to Good Burger, home of the good burger.";

    // 3. 渲染组件时，注入我们的 mockPresenterInstance
    const { postStatusText, postStatusButton, user } = renderAndGetElements(mockPresenterInstance);

    // 4. 输入文本并点击按钮
    await user.type(postStatusText, testPost);
    await user.click(postStatusButton);

    // 5. 验证 presenter.submitPost(...) 被正确调用
    //    注意对第一个 event 参数使用 anything() 或 expect.anything() 来忽略真实事件对象
    verify(
      mockPresenter.submitPost(
        anything(),            // 忽略 event
        testPost,              // 输入的文本
        mockUserInstance,      // 来自 userInfoHook
        mockAuthTokenInstance  // 来自 userInfoHook
      )
    ).once();
  });
});

/**
 * 帮助函数：渲染 PostStatus，并获取常用元素
 * 允许通过可选参数 presenter 来注入 mock 的 Presenter
 */
function renderAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <PostStatus
        presenterGenerator={(view) =>
          presenter ?? new PostStatusPresenter(view)
        }
      />
    </MemoryRouter>
  );

  // 注意：你要在 PostStatus.tsx 给 textarea 加 aria-label="postStatusText"
  // 以及给按钮 <button name="postStatus"> 或 aria-label="postStatus" 才能这样获取
  const postStatusText = screen.getByLabelText("postStatusText");
  const postStatusButton = screen.getByRole("button", { name: "postStatus" });
  const clearStatusButton = screen.getByRole("button", { name: "clearStatus" });

  return { postStatusText, postStatusButton, clearStatusButton, user };
}
