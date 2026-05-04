export async function upload(_file: File, _folder: string): Promise<string> {
  // TODO: integrate S3 / Cloudinary provider.
  return 'https://cdn.example.com/placeholder-file';
}
