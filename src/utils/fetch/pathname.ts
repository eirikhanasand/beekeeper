export default function getSegmentedPathname(path: string) {
    const url = new URL(path, 'https://login.no')
    const segments = url.pathname.split('/').filter(Boolean)
    return segments
}
