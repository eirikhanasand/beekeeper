// /**
//  * Logs in the user
//  * Request:
//  * username: string
//  * password: string
//  *
//  * Response:
//  * id: number
//  * name: string
//  * token: string (the api needs to keep track of tokens for each user and encrypt these)
//  * @param req Request object
//  * @param res Response object
//  * @returns Status code depending on the outcome of the operation
//  */
// export async function postLogin(req: Request, res: Response): Promise<any> {
//     // Wrapped in try-catch block to catch and handle errors gracefully
//     try {
//         // Destructures the relevant variables from the request body
//         const { username, password } = req.body as {
//             username: string
//             password: string
//         }

//         // Validate the required fields
//         if (!username || !password) {
//             return res.status(400).json({ error: 'Username and password are required' })
//         }

//         // Fetches the user data from Firestore
//         const userDoc = await db.collection('User').doc(username).get()

//         // Checks if the user exists, and returns a 404 status code if not
//         if (!userDoc.exists) {
//             return res.status(404).json({ error: 'User not found' })
//         }

//         // Extracts the user data from the document
//         const userData = userDoc.data()

//         // Checks if the user has data, and returns a 404 status code if not
//         if (!userData) {
//             return res.status(404).json({ error: 'User has no data' })
//         }

//         // Temporarily disabled
//         // if (userData.password !== password) { 
//         //     return res.status(401).json({ error: 'Invalid username or password' })
//         // }

//         // Generate the token
//         const token = generateToken(userDoc.id)

//         // Respond with user details and the generated token
//         res.json({
//             name: `${userData.firstName} ${userData.lastName}`,
//             username,
//             time: userData.time,
//             token,
//             score: userData.score,
//             solved: userData.solved
//         })
//     } catch (err) {
//         // Returns a 500 status code with the error message if an error occured
//         const error = err as Error
//         res.status(500).json({ error: error.message })
//     }
// }

// /**
//  * Posts a comment to the given course
//  * @param req Request object
//  * @param res Response object
//  * @returns Status code depending on the outcome of the operation
//  */
// export async function postComment(req: Request, res: Response): Promise<any> {
//     // Wrapped in try-catch block to catch and handle errors gracefully
//     try {
//         // Destructures the relevant variables from the request body
//         const { username, courseID, cardID, content, parent } = req.body as ReplyProps

//         // Validate the required fields
//         if (!username || !courseID || typeof cardID != 'number' || !content) {
//             return res.status(400).json({ error: 'Missing required field (username, courseID, cardID, content)' })
//         }

//         // Generates a new document reference with an auto-generated ID
//         const idDocRef = db.collection('Metadata').doc('commentIDCounter')

//         // Fetches the next ID from the metadata document
//         const nextID = await db.runTransaction(async (transaction) => {
//             // Fetches the document snapshot
//             const idDocSnapshot = await transaction.get(idDocRef)

//             // Checks if the document exists, and creates it if not
//             if (!idDocSnapshot.exists) {
//                 transaction.set(idDocRef, { nextID: 1 }) 
//                 return 0
//             }

//             // Updates the next ID in the document
//             const currentID = idDocSnapshot.data()!.nextID
//             transaction.update(idDocRef, { nextID: currentID + 1 })

//             // Returns the current ID
//             return currentID
//         })

//         // Generates a new document reference with the next ID
//         const commentRef = db.collection('Comment').doc(nextID.toString())

//         // Creates the comment data object
//         const commentData = {
//             id: nextID,
//             courseID,
//             cardID,
//             content,
//             username,
//             time: new Date().toISOString(),
//             rating: 0,
//             votes: []
//         }

//         // Adds the parent field to the comment data object if defined
//         if (parent !== undefined) {
//             // @ts-expect-error
//             commentData['parent'] = parent
//         }

//         // Saves the comment data to Firestore
//         await commentRef.set(commentData)

//         // Invalidates the cache to ensure that the new comment is included
//         invalidateCache(`${courseID}_comments`)

//         // Returns a 201 status code with the ID of the uploaded comment
//         res.status(201).json({ id: commentRef.id, nextID })
//     } catch (err) {
//         // Returns a 500 status code with the error message if an error occured
//         const error = err as Error
//         res.status(500).json({ error: error.message })
//     }
// }
