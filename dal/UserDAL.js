import User from '../schemas/users/User'
import { model } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import { UserAlreadyExistsError } from '../schemas/graphql/errors'

const cryptPassword = ( password ) => new Promise( ( cryptSuccess, cryptError ) => {
  bcrypt.genSalt( 10, ( err, salt ) => {
    if( err ) return cryptError( err )

    bcrypt.hash( password, salt, null, ( err, hash ) => cryptSuccess( hash ) )
  } )
} )


User.statics.registerUser = async function( user ) {
  user.password = await cryptPassword( user.password )

  return this.create( user )
}

User.statics.findByUsername = function( username ) {
  return this.findOne( {
    username,
  } )
}

User.statics.findByEmailAndPassword = async function( email, password ) {
  console.log(`User::findByEmailAndPassword - args: { email: ${email}, password: ${password} }`)
  const user = await this.findOne( { email } )
  if( !user && !user.password ) throw new Error( `Email: ${ email }, is not registered!` )

  const match = bcrypt.compareSync( password, user.password )

  if( match ) return user
  else new Error( 'Password does not match' )
}

User.statics.findAll = async function() {
  return ( await this.find() )
}

export default model( 'User', User )