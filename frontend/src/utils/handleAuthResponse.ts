import { setCookie } from "./cookies"

export default async function handleAuthResponse() {
    const url = window.location.href
    const query = new URLSearchParams(new URL(url).search)
    const userInfo = query.get("access_token")
    if (!userInfo) {
        return
    }

    const user = Object.fromEntries(query.entries())

    setCookie('id', user.id)
    setCookie('name', user.name)
    setCookie('email', user.email)
    setCookie('groups', user.groups)
    setCookie('access_token', user.access_token)

    const path = user.groups.toLowerCase().includes('tekkom') ? '/service/prod/global' : '/'
    window.location.href = path
}
