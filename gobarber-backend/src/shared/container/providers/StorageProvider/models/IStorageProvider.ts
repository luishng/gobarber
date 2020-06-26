export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  removeFile(file: string): Promise<void>;
}
