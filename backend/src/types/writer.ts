import { IArticle } from './article'

/**
 * Model definition for writer
 */
export interface IWriter {
  id: string
  name?: string
  picture?: Blob
  articles?: Article[]
  email?: string
}
