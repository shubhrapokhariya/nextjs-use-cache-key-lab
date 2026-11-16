import { upload } from './actions'

export default function Page() {
  return (
    <form action={upload}>
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  )
}
