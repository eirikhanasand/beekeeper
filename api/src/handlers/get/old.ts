// OAuth2 Endpoints for Authentik
// const AUTH_URL = `${BASE_URL}/application/o/authorize/`
// const TOKEN_URL = `${BASE_URL}/application/o/token/`
// const USERINFO_URL = `${BASE_URL}/application/o/userinfo/`

/**
 * Fetches all comments for the given item
 * @param req FastifyRequest
 * @param res FastifyReply
 */
// export async function getComments(req: FastifyRequest, res: FastifyReply) {
//     // Destructures the courseID from the request parameters
//     const { courseID } = req.params as CourseParam
        
//     /**
//      * Internal asynchronous function to fetch the comments from Firebase
//      * @returns The comments for the specified course if found, or otherwise a string indicating the error
//      */
//     async function fetchComments() {
//         // Fetches the comments from the 'Comment' collection in the database
//         const commentsSnapshot = await db.collection('Comment')
//             .where('courseID', '==', courseID)
//             .get()

//         // Returns an empty array if no comments are found
//         const comments = commentsSnapshot.docs.map((doc: any) => doc.data())

//         // Groups comments by cardID and initialize replies array
//         const groupedComments: { [key: string]: any[] } = {}
//         const commentById: { [key: string]: any } = {}

//         // Initialize comments by cardID and group comments
//         comments.forEach(comment => {
//             comment.replies = []
//             // Inserts the comment into commentById
//             commentById[comment.id] = comment

//             // Assigns the cardID to cardID, or 'no_cardID' if the cardID is not defined
//             const cardID = comment.cardID || 'no_cardID'

//             // Groups comments by cardID
//             if (!groupedComments[cardID]) {
//                 groupedComments[cardID] = []
//             }

//             // Pushes the comment into the groupedComments array
//             groupedComments[cardID].push(comment)
//         })

//         // Nests replies under their parent comments
//         comments.forEach(comment => {
//             // Assigns the parent comment to parentComment if it exists
//             if (comment.parent) {
//                 const parentComment = commentById[comment.parent]

//                 // Pushes the comment into the parentComment's replies array
//                 if (parentComment) {
//                     parentComment.replies.push(comment)
//                 }
//             }
//         })

//         // Filters out comments that are replies, to avoid duplicates in the top-level array
//         Object.keys(groupedComments).forEach(cardID => {
//             groupedComments[cardID] = groupedComments[cardID].filter(comment => !comment.parent)
//         })

//         // Converts grouped comments to 2D array
//         return Object.keys(groupedComments).map(cardID => groupedComments[cardID])
//     }

//     // Wrapped in a try-catch block to handle potential errors gracefully
//     try {
//         // Fetches the comments from cache or database and sends it as a response
//         const commentsArray = await cache(`${courseID}_comments`, fetchComments)
//         res.send(commentsArray)
//     } catch (err) {
//         // Returns a 500 status code with the error message if an error occured
//         const error = err as Error
//         res.status(500).send({ error: error.message })
//     }
// }

// Redirects to Authentik for login
// export function getLogin(_: FastifyRequest, res: FastifyReply) {
//     const state = Math.random().toString(36).substring(5)
//     const authQueryParams = new URLSearchParams({
//         client_id: CLIENT_ID as string,
//         redirect_uri: REDIRECT_URI as string,
//         response_type: 'code',
//         scope: 'openid profile email',
//         state: state,
//     }).toString()

//     res.redirect(`${AUTH_URL}?${authQueryParams}`)
// }

/**
 * Callback route to exchange code for token
 * @param req Request
 * @param res Response
 */
// export async function getCallback(req: FastifyRequest, res: FastifyReply): Promise<any> {
//     const { code } = req.query as any

//     if (!code) {
//         return res.status(400).send('No authorization code found.')
//     }
    
//     try {
//         // Exchanges callback code for access token
//         const tokenResponse = await fetch(TOKEN_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//             body: new URLSearchParams({
//                 client_id: CLIENT_ID as string,
//                 client_secret: CLIENT_SECRET as string,
//                 code: code as string,
//                 redirect_uri: REDIRECT_URI as string,
//                 grant_type: 'authorization_code',
//             }).toString()
//         })

//         const tokenResponseBody = await tokenResponse.text()
     
//         if (!tokenResponse.ok) {
//             return res.status(500).send(`Failed to obtain token: ${tokenResponseBody}`)
//         }

//         const token = JSON.parse(tokenResponseBody)

//         // Fetches user info using access token
//         const userInfoResponse = await fetch(USERINFO_URL, {
//             headers: { Authorization: `Bearer ${token.access_token}` }
//         })

//         if (!userInfoResponse.ok) {
//             const userInfoError = await userInfoResponse.text()
//             return res.status(500).send(`No user info found: ${userInfoError}`)
//         }

//         const userInfo = await userInfoResponse.json()

//         const redirectUrl = new URL(`${EXAM_URL}/login`)
//         const params = new URLSearchParams({
//             id: userInfo.sub,
//             name: userInfo.name,
//             email: userInfo.email,
//             groups: userInfo.groups.join(','),
//             access_token: token.access_token
//         })

//         redirectUrl.search = params.toString()
//         return res.redirect(redirectUrl.toString())
//     } catch (err: unknown) {
//         const error = err as Error
//         console.error('Error during OAuth2 flow:', error.message)
//         return res.status(500).send('Authentication failed')
//     }
// }

