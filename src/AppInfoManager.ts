import PORT from './port'

export default class AppInfoManager {
    private info: {[k: string]: any} = {
        app: 6621302,
        protectedKey: 'BuOkbxEly6ywp1t0rAhF',
        version: '5.80',
        redirect_uri: `http://localhost:${PORT}/vk-auth`,
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