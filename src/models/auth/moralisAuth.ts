import { getMoralisAuth } from '@moralisweb3/client-firebase-auth-utils'
import { app } from '../firebase/client'

export const moralisAuth = getMoralisAuth(app)