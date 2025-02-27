import { AuthToken, Status } from 'tweeter-shared';
import { Presenter, View } from './Presenter';
import { PagedItemPresenter } from './PagedItemPresenter';
import StatusService from '../model/service/StatusService';


// storyPresenter和feed presenter的父类 因为要确保storyPresenter和feed presenter的数据类型一样
export interface StatusItemView extends View
{
    // 因为需要把后端的新加的items给到前端
    addItems: (statusItems: Status[]) => void
}

export abstract class StatusItemPresenter extends PagedItemPresenter<Status, StatusService>
{
    protected createService(): StatusService {
        return new StatusService();
      }
    }