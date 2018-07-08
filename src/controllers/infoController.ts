import AppInfoManager from '../AppInfoManager'

const infoManager = new AppInfoManager(),
    info = infoManager.getInfo()

const link = `http://oauth.vk.com/authorize?client_id=${info.app}&redirect_uri=${info.redirect_uri}&response_type=${info.response_type}`

export const getLink = (req: any, res: any): Promise<object> => {
    return res.json({ link })
}