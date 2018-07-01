import axios from 'axios'

export const info = {
    app: 6621302,
    protectedKey: 'BuOkbxEly6ywp1t0rAhF',
    version: '5.80'
}

export const callApi = async (method: string, parameters: object, accessToken: string = info.protectedKey): Promise<object> => {
    let formattedParameters: string[] = []
    Object.keys(parameters).map((value, key) => {
        formattedParameters.push(`${key}=${value}`)
    })
    const response: object = await axios.get(`https://api.vk.com/method/${method}?${formattedParameters.join('&')}&access_token=${accessToken}&v=${info.version}`)
    return response
}