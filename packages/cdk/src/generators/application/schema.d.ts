import { InitCdkOptions } from '../init/schema';
export interface CdkAppOptions extends InitCdkOptions {
  name: string;
  directory?: string;
  tags?: string;
}
