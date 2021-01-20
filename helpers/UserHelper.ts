import { ApiHelper } from './ApiHelper'
import { UserInterface, ChurchInterface } from "../interfaces/AccessManagement";
import { UserContextInterface } from '../interfaces';

export class UserHelper {
    static currentChurch: ChurchInterface;
    static churches: ChurchInterface[];
    static user: UserInterface;
    static churchChanged: boolean = false;

    static selectChurch = async (context: UserContextInterface, churchId?: number,) => {
        var church = null;
        const keyName = window.location.hostname.split('.')[0];
        if (!churchId) UserHelper.churches.forEach(c => { if (c.subDomain === keyName) church = c; });
        else UserHelper.churches.forEach(c => { if (c.id === churchId) church = c; });
        if (church === null) window.location.reload();
        else {
            UserHelper.currentChurch = church;
            UserHelper.currentChurch.apis.forEach(api => { ApiHelper.setPermissions(api.keyName, api.jwt, api.permissions); });
            if (context.churchName !== "") UserHelper.churchChanged = true;
            context.setChurchName(UserHelper.currentChurch.name);
        }
    }

    static checkAccess(contentType: string, action: string, apiName?: string): boolean {
        const permissions = ApiHelper.getConfig(apiName).permisssions;

        var result = false;
        if (permissions !== undefined) {
            permissions.forEach(element => {
                if (element.contentType === contentType && element.action === action) result = true;
            });
        }
        return result;
    }

}

