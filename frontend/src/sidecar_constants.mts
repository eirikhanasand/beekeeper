const { HEARTBEAT_REFERENCE } = process.env

const config = {
    HEARTBEAT_URL: 'https://status.login.no/api/push/{reference}?status=up&msg=OK&ping={ping}',
    HEARTBEAT_REFERENCE
}

export default config
