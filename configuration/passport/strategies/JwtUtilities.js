import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import UserDAL from '../../../model/UserDAL'

export const createAndSignToken = async( user, req ) => {
  const { JWT_EXPIRATION, JWT_SECRET, JWT_ALGORITHM } = process.env
  const payload = {
    sub: user._id,
    iat: Date.now() + parseInt( JWT_EXPIRATION ),
    username: user.username,
  }
  const token = jwt.sign(
    JSON.stringify( payload ),
    JWT_SECRET,
    { algorithm: JWT_ALGORITHM },
  )

  const ip = ( req.headers['x-forwarded-for'] || '' ).split( ',' ).pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  const location = await ( ( await fetch( `https://ipapi.co/${ ip }/json/` ) ).json() )
  await UserDAL.login( { token, userId: user._id, ip, location } )

  return token
}