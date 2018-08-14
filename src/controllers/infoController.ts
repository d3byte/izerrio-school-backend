import AppInfoManager from '../AppInfoManager'


const infoManager = new AppInfoManager()
const info = infoManager.getInfo()

const link = `http://oauth.vk.com/authorize?client_id=${info.app}&redirect_uri=${info.redirect_uri}&response_type=${info.response_type}`

export const getLink = (req: any, res: any): Promise<object> => {
    return res.json({ link })
}

export const sosatFreeKassa = (req: any, res: any): Promise<object> => {
  return res.send(`

  `)
}

export const sosatFreeKassa2 = (req: any, res: any): Promise<object> => {
  return res.send(`

  `)
}

export const successPayment = (req: any, res: any): Promise<object> => {
    return res.redirect('http://school.izerrio.pro/')
}
export const unsuccessPayment = (req: any, res: any): Promise<object> => {
    return res.redirect('http://school.izerrio.pro/shop')
}