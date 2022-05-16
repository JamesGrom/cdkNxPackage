import { InitCdkOptions } from '../init/schema';
export interface CdkAppOptions extends InitCdkOptions {
  projName?: string;
  directory?: string;
  tags?: string;
}
