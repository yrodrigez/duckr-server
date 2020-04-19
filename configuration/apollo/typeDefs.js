import {gql} from 'apollo-server-express'
import fs from 'fs'
import path  from 'path'

const walkSync = (dir, fileList = []) => {
  const files = fs.readdirSync(dir)
  fileList = fileList || []
  files.forEach(file => {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      fileList = walkSync(dir + '/' + file, fileList)
    } else if (file.split('.').pop() === 'graphql') {
      fileList.push(path.join(dir, file))
    }
  })
  return fileList
}

const SCHEMAS_DIR = path.join(__dirname, '../../schemas/graphql')

const files = walkSync(SCHEMAS_DIR)
let complete = ``
files.forEach(file => {
  const data = fs.readFileSync(file, 'utf8')
  complete = `${complete}
${data.trim()}`
})

// console.log(complete)
const typeDefs = gql`${complete}`
export default {typeDefs}