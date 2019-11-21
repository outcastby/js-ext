import axios, { AxiosStatic } from 'axios'
import { ASTNode, print } from 'graphql'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { extractFiles } from 'extract-files'
import Dictionary from '../interfaces/Dictionary'
import Config from '../config'

interface File extends Blob {
  name: string
}

interface Config {
  axios: AxiosStatic
  options: object
  url: string
}

interface FetchResponse {
  data: ResponseData
}

interface ResponseData {
  data: Dictionary<any>
  errors: string
}

const adaptData = (data: object, files: Map<File, string[]>): object | FormData => {
  if (!files.size) return data
  const formData = new FormData()
  formData.append('operations', JSON.stringify(data))
  const map = {} as Dictionary<any>
  let i = 0
  files.forEach((paths, file: File) => {
    map[i] = paths
    formData.append(`${i}`, file, file.name)
    i++
  })
  formData.append('map', JSON.stringify(map))
  return formData
}

const options = (files: Map<File, string[]>): object => {
  if (!files.size) return Config.get(['jsExt', 'gql', 'options']) || {}
  return { headers: { 'Content-Type': 'multipart/form-data' } }
}

const fetch = (query: ASTNode, variables: object, url?: string): Promise<FetchResponse> => {
  const data = {
    query: print(query),
    variables,
  }
  const { clone, files } = extractFiles(data)

  const axiosFunc = Config.get(['jsExt', 'gql', 'axios'], axios)

  return axiosFunc.post(url || Config.get(['jsExt', 'gql', 'url']), adaptData(clone, files), options(files))
}

export default {
  fetch,
}
