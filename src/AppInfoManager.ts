import PORT from './port'

export default class AppInfoManager {
    private info: {[k: string]: any} = {
        app: 6621302,
        protectedKey: 'BuOkbxEly6ywp1t0rAhF',
        version: '5.80',
        redirect_uri: process.env.NODE_ENV === 'production' ? 'http://176.57.208.126:80/vk-auth' : `http://localhost:${PORT}/vk-auth`,
        response_type: 'code',
        code: ''
    }

    setField(key: string, value: any) {
        this.info[key] = value
        return this
    }

    getInfo() {
        return this.info
    }
}