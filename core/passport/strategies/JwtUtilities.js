import jwt from 'jsonwebtoken'
import geoip from 'geoip-lite'
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

  const ip = req.ip

  //const location = await ( ( await fetch( `https://ipapi.co/${ ip }/json/` ) ).json() )
  console.log(`This is the ip: ${ip}`)
  const location = geoip.lookup(ip)
  console.log(`This is the location: ${JSON.stringify(location)}`)
  await UserDAL.login( { token, userId: user._id, ip, location } )

  return token
}